import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { setLoading } from '../../utils/loadingState';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { translateMessageErrorToPTBR } from '../../utils/messageErrorsFirebase';
import { auth, database } from '../../services/firebase';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowsProp, GridToolbarContainer } from '@mui/x-data-grid';
import * as Icon from '@mui/icons-material';
import { AccordionDetails } from '@material-ui/core';
import useStyle from './style';

interface SubmitData {
  uid: string
  first_name: string
  last_name: string
  email: string
  password: string
}

const Usuarios:React.FC = () => {
  const [formIsVisible, setFormIsVisible] = useState(false);
  const classes = useStyle();

  const formik = useFormik({
    initialValues: {
      uid: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      admin: false
    },
    validationSchema: Yup.object({
      first_name: Yup.string().max(255).required('Nome é obrigatório'),
      last_name: Yup.string().max(255).required('Sobrenome é obrigatório'),
      email: Yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
      password: Yup.string()
        .required('Senha é obrigatória')
        .min(8, 'Deve conter 8 caracteres')
        .matches(/[a-z]/g, 'Deve conter letras minúsculos')
        .matches(/[A-Z]/g, 'Deve conter letras maiúsculas')
        .matches(/[0-9]/g, 'Deve conter números')
        .matches(/[~`!@#$%^&*+=\-[\]\\';,/{}|\\":<>?çÇ]/g, 'Deve conter caracteres especiais'),
      passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'As senhas não coincidem')
    }),
    onSubmit: (values) => submit(values)
  });

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

  const submit = ({uid, first_name, last_name, email, password}: SubmitData) => {
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
    createUserWithEmailAndPassword(auth, email, password).then(result => {
      const { uid } = result.user;
      setDoc(doc(database, 'users', uid), {
        email,
        first_name,
        last_name
      }).then(() => {
        toast.success('Usuário cadastro com sucesso');
        formik.resetForm();
        setFormIsVisible(false);
      });
    }).catch(error => {
      toast.error(translateMessageErrorToPTBR(error.code) ?? error.message);
      formik.setSubmitting(false);
    }).finally(() => {
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
              <Grid
                container
                spacing={2}
                component={'form'}
                onSubmit={formik.handleSubmit}
                noValidate
                sx={{
                  '& .MuiTextField-root': { m: 1 },
                }}
              >
                <Grid item md={4}>
                  <TextField
                    fullWidth
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
                </Grid>
                <Grid item md={4}>
                  <TextField
                    fullWidth
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
                </Grid>
                <Grid item md={4}>
                  <TextField
                    fullWidth
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
                </Grid>
                <Grid item md={4}>
                  <TextField
                    fullWidth
                    label='Senha'
                    error={Boolean(formik.touched.password && formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    margin='normal'
                    name='password'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type='password'
                    value={formik.values.password}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    fullWidth
                    label='Confirmação de senha'
                    error={Boolean(formik.touched.passwordConfirmation && formik.errors.passwordConfirmation)}
                    helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
                    margin='normal'
                    name='passwordConfirmation'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type='password'
                    value={formik.values.passwordConfirmation}
                  />
                </Grid>
                <Grid item md={4} display='flex'>
                  <FormControlLabel
                    sx={{ml: 1}}
                    control={<Checkbox />}
                    label='Admin'
                    name='admin'
                    onChange={formik.handleChange}
                    value={formik.values.admin}
                  />
                </Grid>
              </Grid>
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
