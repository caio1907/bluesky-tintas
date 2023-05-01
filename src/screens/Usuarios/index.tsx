import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, Box, Button, Card, CardActions, CardContent, CardHeader, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { setLoading } from '../../utils/loadingState';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { translateMessageErrorToPTBR } from '../../utils/messageErrorsFirebase';
import { auth, database } from '../../services/firebase';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowsProp, GridToolbarContainer } from '@mui/x-data-grid';
import * as Icon from '@mui/icons-material';
import { AccordionDetails } from '@material-ui/core';
import useStyle from './style';

const Usuarios:React.FC = () => {
  const [formIsVisible, setFormIsVisible] = useState(false);
  const classes = useStyle();

  const dataGridColumns: GridColDef[] = [
    {field: 'first_name', headerName: 'Nome', flex: 1},
    {field: 'last_name', headerName: 'Sobrenome', flex: 1},
    {field: 'email', headerName: 'E-mail', flex: 1},
    {
      field: 'actions',
      headerName: 'Ações',
      type: 'actions',
      maxWidth: 100,
      getActions: (params) => {
        const { row } = params;

        return [
          <GridActionsCellItem
            disabled={formIsVisible}
            icon={<Icon.Edit color='warning' filter={`grayscale(${formIsVisible ? '1' : '0'})`}/>}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditClick(row)}
            color="inherit"
          />,
          <GridActionsCellItem
            disabled={formIsVisible}
            icon={<Icon.Delete color='error' filter={`grayscale(${formIsVisible ? '1' : '0'})`}/>}
            label="Delete"
            onClick={() => handleDeleteClick(row.uid)}
            color="inherit"
          />
        ];
      }
    }
  ];

  const [dataGridRows, setDataGridRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    const snapshot = onSnapshot(collection(database, 'users'), snapshot => {
      setDataGridRows(snapshot.docs.map((doc, index: number) => ({
        id: index,
        uid: doc.id,
        first_name: doc.get('first_name'),
        last_name: doc.get('last_name'),
        email: doc.get('email')
      })))
    })

    return () => {
      snapshot();
    }
  }, []);

  const handleCancelClick = () => {
    setFormIsVisible(false);
    formik.resetForm();
  }

  const handleEditClick = (row: any) => {
    const { uid, first_name, last_name, email } = row
    formik.setValues({
      uid,
      first_name,
      last_name,
      email
    });
    setFormIsVisible(true);
  }

  const handleDeleteClick = (uid: string) => {
    const isDelete = window.confirm('Deseja deletar o usuário?')
    if (!isDelete) return;
    setLoading(true);
    deleteDoc(doc(database, 'users', uid)).then(() => {
      toast.success('Usuário removido com sucesso');
    }).finally(() => {
      setLoading(false);
    })
  }

  const handleAddToolbarButton = () => setFormIsVisible(true)

  const formik = useFormik({
    initialValues: {
      uid: '',
      first_name: '',
      last_name: '',
      email: ''
    },
    validationSchema: Yup.object({
      first_name: Yup.string().max(255).required('Nome é obrigatório'),
      last_name: Yup.string().max(255).required('Sobrenome é obrigatório'),
      email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório')
    }),
    onSubmit: (values) => submit(values)
  });

  const submit = ({uid, first_name, last_name, email}: {uid: string, first_name: string, last_name: string, email: string}) => {
    setLoading(true);
    toast.dismiss();
    if (uid) {
      setDoc(doc(database, 'users', uid), {
        email,
        first_name,
        last_name
      }).then(() => {
        toast.success('Usuário alterado com sucesso');
      }).catch(error => {
        toast.error(translateMessageErrorToPTBR(error.code) ?? error.message);
      }).finally(() => {
        formik.resetForm();
        setLoading(false);
        setFormIsVisible(false);
      })
      return;
    }
    const password = Math.random().toString(36).slice(-8);
    createUserWithEmailAndPassword(auth, email, password).then(result => {
      const { uid } = result.user;
      setDoc(doc(database, 'users', uid), {
        email,
        first_name,
        last_name
      }).then(() => {
        toast.success('Usuário cadastro com sucesso');
        sendPasswordResetEmail(auth, email).then(() => {
          toast.info('Um e-mail para definir a senha foi enviado para o e-mail cadastrado')
        }).catch(error => {
          toast.error(translateMessageErrorToPTBR(error.code) ?? error.message);
        }).finally(() => {
          formik.resetForm();
          setLoading(false);
          setFormIsVisible(false);
        })
      });
    }).catch(error => {
      toast.error(translateMessageErrorToPTBR(error.code) ?? error.message);
      formik.setSubmitting(false);
      setLoading(false);
    })
  }

  const AddToolbarButton: React.FC = () => {
    return (
      <GridToolbarContainer>
        <Button
          disabled={formIsVisible}
          color='info'
          startIcon={<Icon.Add />}
          onClick={handleAddToolbarButton}>
          Adicionar usuário
        </Button>
      </GridToolbarContainer>
    )
  }

  return (
    <div>
      <Accordion expanded={formIsVisible}>
        <AccordionSummary sx={{display: 'none'}}></AccordionSummary>
        <AccordionDetails className={classes.accordionAlignCenter}>
          <Card variant='outlined' sx={{mb: 2}}>
            <CardHeader
              title='Cadastrar/Editar Usuário'
              sx={{
                pb: 0
              }}
            />
            <CardContent>
              <Box
                component={'form'}
                onSubmit={formik.handleSubmit}
                noValidate
                sx={{
                  '& .MuiTextField-root': { m: 1 },
                }}
              >
                <TextField
                  label='Nome'
                  error={Boolean(formik.touched.first_name && formik.errors.first_name)}
                  helperText={formik.touched.first_name && formik.errors.first_name}
                  margin='normal'
                  name='first_name'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type='text'
                  value={formik.values.first_name}
                />
                <TextField
                  label='Sobrenome'
                  error={Boolean(formik.touched.last_name && formik.errors.last_name)}
                  helperText={formik.touched.last_name && formik.errors.last_name}
                  margin='normal'
                  name='last_name'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type='text'
                  value={formik.values.last_name}
                />
                <TextField
                  label='E-mail'
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  margin='normal'
                  name='email'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type='email'
                  value={formik.values.email}
                />
              </Box>
            </CardContent>
            <CardActions sx={{display: 'flex', justifyContent: 'end'}}>
              <Button color='error' onClick={handleCancelClick}>Cancelar</Button>
              <Button color='success' onClick={formik.submitForm}>Salvar</Button>
            </CardActions>
          </Card>
        </AccordionDetails>
      </Accordion>
      <DataGrid
        columns={dataGridColumns}
        rows={dataGridRows}
        rowSelection={false}
        slots={{
          toolbar: AddToolbarButton
        }}
      />
    </div>
  )
}
export default Usuarios
