import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Accordion, AccordionSummary, AccordionDetails, Card, CardHeader, CardContent, CardActions, MenuItem } from '@mui/material';
import * as Icon from '@mui/icons-material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowsProp, GridToolbarContainer } from '@mui/x-data-grid';
import { addDoc, collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { setLoading } from '../../utils/loadingState';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { database } from '../../services/firebase';
import * as Yup from 'yup';
import useStyle from './style';
import { translateMessageErrorToPTBR } from '../../utils/messageErrorsFirebase';
import { Providers, Item } from '../../types';

const Produtos: React.FC = () => {
  const [providers, setProviders] = useState<Providers[]>([]);
  const [formIsVisible, setFormIsVisible] = useState(false);
  const classes = useStyle();

  const dataGridColumns: GridColDef[] = [
    {field: 'ean', headerName: 'EAN', flex: 1},
    {field: 'name', headerName: 'Nome', flex: 1},
    {field: 'provider', headerName: 'Fornecedor', flex: 1},
    {field: 'min_quantity', headerName: 'Quantidade Mínima', flex: 1},
    {field: 'quantity', headerName: 'Quantidade', flex: 1},
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
    const snapshot = onSnapshot(collection(database, 'providers'), snapshot => {
      setProviders(snapshot.docs.map((doc, index: number) => ({
        uid: doc.id,
        name: doc.get('name'),
        cnpj: doc.get('cnpj')
      })))
    });

    return () => {
      snapshot();
    }
  }, []);

  useEffect(() => {
    if (providers) {
      const snapshot = onSnapshot(collection(database, 'products'), snapshot => {
        setDataGridRows(snapshot.docs.map((doc, index: number) => ({
          id: index,
          uid: doc.id,
          ean: doc.get('ean'),
          provider: getProviderName(doc.get('provider')),
          min_quantity: doc.get('min_quantity'),
          name: doc.get('name'),
          quantity: doc.get('quantity'),
        })))
      });

      return () => {
        snapshot();
      }
    }
  }, [providers]); // eslint-disable-line

  const getProviderName = (fornecedorId: number) => {
    return providers.find(provider => provider.uid === fornecedorId.toString())?.name;
  }

  const handleCancelClick = () => {
    setFormIsVisible(false);
    formik.resetForm();
  }

  const handleEditClick = (row: any) => {
    const { uid, ean, name, min_quantity, quantity } = row;
    const provider = +(providers.find(provider => provider.name === row.provider)?.uid ?? 0);
    formik.setValues({
      uid,
      ean,
      name,
      provider,
      min_quantity,
      quantity
    });
    setFormIsVisible(true);
  }

  const handleDeleteClick = (uid: string) => {
    const isDelete = window.confirm('Deseja deletar o item?')
    if (!isDelete) return;
    setLoading(true);
    deleteDoc(doc(database, 'products', uid)).then(() => {
      toast.success('Item removido com sucesso');
    }).finally(() => {
      setLoading(false);
    })
  }

  const handleAddToolbarButton = () => {
    formik.setValues({
      ...formik.values,
      provider: +providers[0].uid
    })
    setFormIsVisible(true)
  }

  const formik = useFormik({
    initialValues: {
      uid: '',
      ean: '',
      name: '',
      provider: 0,
      min_quantity: 0,
      quantity: 0,
    },
    validationSchema: Yup.object({
      ean: Yup.string().required('EAN é obrigatório'),
      name: Yup.string().max(255).required('Nome é obrigatório'),
      provider: Yup.number().required('Fornecedor é obrigatório'),
      min_quantity: Yup.number().required('Quantidade mínima é obrigatório'),
      quantity: Yup.number().required('Quantidade é obrigatório'),
    }),
    onSubmit: (values) => submit(values)
  });

  const submit = ({uid, ean, name, provider, min_quantity, quantity}: Item) => {
    setLoading(true);
    toast.dismiss();
    if (uid) {
      setDoc(doc(database, 'products', uid), {
        name,
        ean,
        provider: +provider,
        min_quantity,
        quantity
      }).then(() => {
        toast.success('Item alterado com sucesso');
      }).catch(error => {
        toast.error(translateMessageErrorToPTBR(error.code) ?? error.message);
      }).finally(() => {
        formik.resetForm();
        setLoading(false);
        setFormIsVisible(false);
      })
      return;
    }
    addDoc(collection(database, 'products'), {
      ean,
      name,
      provider: +provider,
      min_quantity,
      quantity
    }).then(() => {
      toast.success('Item cadastrado com sucesso')
    }).catch(error => {
      toast.error(translateMessageErrorToPTBR(error.code) ?? error.message);
    }).finally(() => {
      formik.resetForm();
      setLoading(false);
      setFormIsVisible(false);
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
          Adicionar item
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
              title='Cadastrar/Editar Item'
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
                  '& .MuiTextField-root': { m: 1, minWidth: '25ch' },
                }}
              >
                <TextField
                  label='EAN'
                  error={Boolean(formik.touched.ean && formik.errors.ean)}
                  helperText={formik.touched.ean && formik.errors.ean}
                  margin='normal'
                  name='ean'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type='text'
                  value={formik.values.ean}
                />
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
                <TextField
                  label='Fornecedor'
                  select
                  error={Boolean(formik.touched.provider && formik.errors.provider)}
                  helperText={formik.touched.provider && formik.errors.provider}
                  margin='normal'
                  name='provider'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type='text'
                  value={formik.values.provider}
                >
                  {providers.map((provider, index) => (
                    <MenuItem key={index} value={provider.uid}>{provider.name}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  label='Quantidade mínima'
                  error={Boolean(formik.touched.min_quantity && formik.errors.min_quantity)}
                  helperText={formik.touched.min_quantity && formik.errors.min_quantity}
                  margin='normal'
                  name='min_quantity'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type='text'
                  value={formik.values.min_quantity}
                />
                <TextField
                  label='Quantidade'
                  error={Boolean(formik.touched.quantity && formik.errors.quantity)}
                  helperText={formik.touched.quantity && formik.errors.quantity}
                  margin='normal'
                  name='quantity'
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type='text'
                  value={formik.values.quantity}
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
  );
};

export default Produtos;
