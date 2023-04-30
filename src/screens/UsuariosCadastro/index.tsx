import React, { useState } from 'react';
import { Button, FormControl, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { setLoading } from '../../utils/loadingState';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { translateMessageErrorToPTBR } from '../../utils/messageErrorsFirebase';
import { auth } from '../../services/firebase';
import { setDoc } from 'firebase/firestore';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import * as Icon from '@mui/icons-material'

const UsuariosCadastro:React.FC = () => {
  const rowModesModel = useState([]);
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required('Nome é obrigatório'),
      email: Yup.string().email().required('E-mail é obrigatório'),
      password: Yup.string().required('Senha é obrigatória'),
      confirmPassword: Yup.string().required('Confirmação de senha é obrigatória').oneOf([Yup.ref('password'), null], 'As senhas devem ser iguais')
    }),
    onSubmit: (values) => submit(values)
  });

  const submit = ({name, email, password}: {name: string, email: string, password: string}) => {
    setLoading(true);
    toast.dismiss();
    createUserWithEmailAndPassword(auth, email, password).then(() => {
      // setDoc();
      toast.success('Usuário cadastro com sucesso');
      formik.resetForm();
    }).catch(error => {
      toast.error(translateMessageErrorToPTBR(error.code) ?? error.message);
      formik.setSubmitting(false);
    }).finally(() => {
      setLoading(false);
    })
  }

  https://mui.com/x/react-data-grid/editing/#full-featured-crud-component

  const dataGrid:{columns:GridColDef[], rows: any} = {
    columns: [
      {field: 'name', headerName: 'Nome', minWidth: 150},
      {field: 'email', headerName: 'E-mail', width: 200},
      {
        field: 'actions',
        type: 'actions',
        width: 100,
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }

          return [
            <GridActionsCellItem
              icon={<Icon.Edit />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<Icon.Delete />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        }
      }
    ],
    rows: [
      {id: 1, name: 'Caio', email: 'caio@email.com'},
      {id: 2, name: 'Caio', email: 'caio@email.com'},
      {id: 3, name: 'Caio', email: 'caio@email.com'},
    ]
  }

  return (
    <div>
      <DataGrid
        columns={dataGrid.columns}
        rows={dataGrid.rows}
        rowSelection={true}
      />
      {/* <FormControl component='form' onSubmit={formik.handleSubmit}>
        <TextField
          label='Nome'
          error={Boolean(formik.touched.email && formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin='normal'
          name='email'
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type='email'
          value={formik.values.email}
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
        <TextField
          label='Senha'
          error={Boolean(formik.touched.email && formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin='normal'
          name='email'
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type='email'
          value={formik.values.email}
        />
        <TextField
          label='Confirmação de senha'
          error={Boolean(formik.touched.email && formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin='normal'
          name='email'
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type='email'
          value={formik.values.email}
        />
        <Button color='success' variant='contained'>Salvar</Button>
      </FormControl> */}
    </div>
  )
}
export default UsuariosCadastro
