import React, { useState } from 'react';
import { Box, Button, Container, Grid, TextField } from '@mui/material';
import { setLoading } from '../../utils/loadingState';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth } from '../../services/firebase';
import { translateMessageErrorToPTBR } from '../../utils/messageErrorsFirebase';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useStyles from './styles';
import * as Icon from '@mui/icons-material';
import ReCAPTCHA from 'react-google-recaptcha';

interface IData {
  email: string,
  password: string
}

const Login:React.FC = () => {
  const classes = useStyles();
  const [reCaptcha, setReCaptcha] = useState('');
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('E-mail inválido')
        .max(255)
        .required('E-mail é obrigatório'),
      password: Yup
        .string()
        .max(255)
        .required('Senha é obrigatória')
    }),
    onSubmit: (values) => signIn(values)
  });

  const signIn = ({email, password}: IData) => {
    if (!reCaptcha) {
      toast.error('ReCaptcha inválido');
      formik.setSubmitting(false);
      return;
    }
    setLoading(true);
    toast.dismiss();
    signInWithEmailAndPassword(auth, email, password).then(() => {
      setLoading(false)
    }).catch(error => {
      toast.error(translateMessageErrorToPTBR(error.code) ?? error.message);
      setLoading(false)
      formik.setSubmitting(false);
    })
  }

  return (
    <Box
      component='main'
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%',
        height: '100vh',
        backgroundColor: '#e7e6e1'
      }}
    >
      <Container
        maxWidth='sm'
        sx={{
          backgroundColor: '#f2a154',
          boxShadow: '10px 10px 10px #182f32',
          paddingTop: 2
        }}
      >
        <img className={classes.logoImage} src="/logo.png" alt="BlueSky Tintas"/>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            error={Boolean(formik.touched.email && formik.errors.email)}
            fullWidth
            helperText={formik.touched.email && formik.errors.email}
            label='E-mail'
            margin='normal'
            name='email'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type='email'
            value={formik.values.email}
            variant='outlined'
            autoFocus
          />
          <TextField
            error={Boolean(formik.touched.password && formik.errors.password)}
            fullWidth
            helperText={formik.touched.password && formik.errors.password}
            label='Senha'
            margin='normal'
            name='password'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type='password'
            value={formik.values.password}
            variant='outlined'
          />
          <Grid container spacing={2} mt={1} mb={2}>
            <Grid item sm={12} display='flex' justifyContent='center'>
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_PUBLIC_KEY ?? ''}
                onChange={token => setReCaptcha(token ?? '')}
                onExpired={() => setReCaptcha('')}
              />
            </Grid>
            <Grid item sm={12} display='flex' justifyContent='center'>
              <Button
                disabled={formik.isSubmitting}
                size='large'
                type='submit'
                variant='contained'
                endIcon={<Icon.Send/>}
              >Entrar</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  )
}
export default Login
