import React, { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowsProp, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import * as Icon from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardActions, CardContent, CardHeader, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { validateCNPJ } from '../../utils/validation';
import useStyle from './style';
import { database } from '../../services/firebase';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from '@firebase/firestore';
import { PatternFormat } from 'react-number-format'
import { setLoading } from '../../utils/loadingState';
import { toast } from 'react-toastify';
import { translateMessageErrorToPTBR } from '../../utils/messageErrorsFirebase';

const Fornecedores: React.FC = () => {
  const classes = useStyle();
  const dataGridColumns: GridColDef[] = [
    {field: 'name', headerName: 'Nome', flex: 1},
    {
      field: 'cnpj',
      headerName: 'CNPJ',
      flex: 1,
      valueFormatter: ({value}) => value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    },
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
  const [formIsVisible, setFormIsVisible] = useState(false);

  useEffect(() => {
    const snapshot = onSnapshot(collection(database, 'providers'), snapshot => {
      setDataGridRows(snapshot.docs.map((doc, index: number) => ({
        id: index,
        uid: doc.id,
        name: doc.get('name'),
        cnpj: doc.get('cnpj')
      })))
    })

    return () => {
      snapshot();
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      uid: '',
      name: '',
      cnpj: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required('Nome é obrigatório'),
      cnpj: Yup.string().min(18).max(18).required('CNPJ é obrigatório').test(
        'test-invalid-cnpj',
        'CNPJ inválido',
        cnpj => cnpj ? validateCNPJ(cnpj) : false
      )
    }),
    onSubmit: values => submit(values)
  })

  const submit = ({uid, name, cnpj}: {uid:string, name:string, cnpj: string}) => {
    cnpj = cnpj.replace(/\D/g, '');
    setLoading(true);
    toast.dismiss();
    if (uid) {
      setDoc(doc(database, 'providers', uid), {
        name,
        cnpj
      }).then(() => {
        toast.success('Fornecedor alterado com sucesso');
      }).catch(error => {
        toast.error(translateMessageErrorToPTBR(error.code) ?? error.message);
      }).finally(() => {
        formik.resetForm();
        setLoading(false);
        setFormIsVisible(false);
      })
      return;
    }

    uid = (dataGridRows as any).findLast((element:any) => +element.uid).uid + 1

    setDoc(doc(database, 'providers', uid), {
      name,
      cnpj
    }).then(() => {
      toast.success('Fornecedor cadastro com sucesso');
    }).catch(error => {
      toast.error(translateMessageErrorToPTBR(error.code) ?? error.message);
    }).finally(() => {
      formik.resetForm();
      setLoading(false);
      setFormIsVisible(false);
    })
  }

  const handleAddToolbarButton = () => setFormIsVisible(true);
  const handleCancelClick = () => setFormIsVisible(false);

  const handleEditClick = (row: any) => {
    const { uid, name } = row;
    const cnpj = row.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    formik.setValues({
      uid,
      name,
      cnpj
    });
    setFormIsVisible(true);
  }

  const handleDeleteClick = (uid: string) => {
    const isDelete = window.confirm('Deseja deletar o fornecedor?')
    if (!isDelete) return;
    setLoading(true);
    deleteDoc(doc(database, 'providers', uid)).then(() => {
      toast.success('Fornecedor removido com sucesso');
    }).finally(() => {
      setLoading(false);
    })
  }

  const AddToolbarButton: React.FC = () => {
    return (
      <GridToolbarContainer>
        <Button
          disabled={formIsVisible}
          startIcon={<Icon.Add />}
          onClick={handleAddToolbarButton}>
          Adicionar fornecedor
        </Button>
        <GridToolbarExport/>
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
              title='Cadastrar/Editar Fornecedor'
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
                  error={Boolean(formik.touched.name && formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  margin='normal'
                  name='name'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type='text'
                  value={formik.values.name}
                />
                <PatternFormat
                  customInput={TextField}
                  label='CNPJ'
                  error={Boolean(formik.touched.cnpj && formik.errors.cnpj)}
                  helperText={formik.touched.cnpj && formik.errors.cnpj}
                  margin='normal'
                  name='cnpj'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type='text'
                  value={formik.values.cnpj}
                  format='##.###.###/####-##'
                  mask='_'
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
export default Fornecedores;
