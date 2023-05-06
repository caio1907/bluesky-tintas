import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Grid, MenuItem, TextField, Typography, useTheme } from '@mui/material';
import { Item } from '../../types';
import { addDoc, collection, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, database } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import useStyles from './style';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { setLoading } from '../../utils/loadingState';
import { toast } from 'react-toastify';
import { translateMessageErrorToPTBR } from '../../utils/messageErrorsFirebase';

interface SubmitValues {
  product: string
  quantity: number
  type: string
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Item[]>([]);
  const [formIsVisible, setFormIsVisible] = useState(false);

  useEffect(() => {
    const snapshot = onSnapshot(collection(database, 'products'), snapshot => {
      const prods = snapshot.docs.map((doc, index: number) => ({
        id: index,
        uid: doc.id,
        ean: doc.get('ean'),
        provider: doc.get('provider'),
        min_quantity: doc.get('min_quantity'),
        name: doc.get('name'),
        quantity: doc.get('quantity'),
      }));
      setProducts(prods);
    });

    return () => {
      snapshot();
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      product: '',
      quantity: 0,
      type: 'S'
    },
    validationSchema: Yup.object({
      product: Yup.string().required('Produto é obrigatório'),
      quantity: Yup.number().min(1, 'Quantidade deve ser maior que ou igual a 1').required('Quantidade é obrigatória'),
      type: Yup.string().equals(['S','E'])
    }),
    onSubmit: (values) => submit(values)
  });

  const submit = ({product, quantity, type}:SubmitValues) => {
    setLoading(true);
    toast.dismiss();
    const docCollection = collection(database, 'logs');
    addDoc(docCollection, {
      created_at: serverTimestamp(),
      product,
      quantity,
      type,
      user: auth.currentUser?.uid
    }).then(() => {
      toast.success(`${type === 'S' ? 'Saída' : 'Entrada'} registrada com sucesso`);
      const productData = products.find(item => item.ean === product);
      const docProductRef = doc(database, 'products', productData?.uid ?? '');
      const quantityUpdated = type === 'S' ? (productData?.quantity ?? 0) - quantity : (productData?.quantity ?? 0) + quantity
      updateDoc(docProductRef, {
        quantity: quantityUpdated
      }).then(() => {
        toast.success('Quantidade do produto atualizada com sucesso');
      }).catch(error => {
        toast.error(translateMessageErrorToPTBR(error.code) ?? error.message);
        formik.setSubmitting(false);
      });
    }).catch(error => {
      toast.error(translateMessageErrorToPTBR(error.code) ?? error.message);
      formik.setSubmitting(false);
    }).finally(() => {
      setLoading(false);
      setFormIsVisible(false);
    });
  }

  const handleCancelClick = () => {
    setFormIsVisible(false);
    formik.resetForm();
  }

  const redirectToStockScreen = () => {
    navigate('/stock')
  }

  return (
    <>
      <Accordion expanded={formIsVisible}>
        <AccordionSummary sx={{display: 'none'}}></AccordionSummary>
        <AccordionDetails className={classes.accordionAlignCenter}>
          <Card variant='outlined' sx={{mb: 1, flex: 1}}>
            <CardHeader
              title='Entrada/saída'
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
                    label='Produto'
                    select
                    error={Boolean(formik.touched.product && formik.errors.product)}
                    helperText={formik.touched.product && formik.errors.product}
                    margin='normal'
                    name='product'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type='text'
                    value={formik.values.product}
                  >
                    {products.map((product, index) => (
                      <MenuItem key={index} value={product.ean}>{product.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={4}>
                  <TextField
                    fullWidth
                    label='Quantidade'
                    error={Boolean(formik.touched.quantity && formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                    margin='normal'
                    name='quantity'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type='number'
                    value={formik.values.quantity}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    fullWidth
                    label='Tipo'
                    select
                    error={Boolean(formik.touched.type && formik.errors.type)}
                    helperText={formik.touched.type && formik.errors.type}
                    margin='normal'
                    name='type'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type='text'
                    value={formik.values.type}
                  >
                    <MenuItem value='S'>Saída</MenuItem>
                    <MenuItem value='E'>Entrada</MenuItem>
                  </TextField>
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
      <Button
        color='success'
        variant='contained'
        onClick={() => setFormIsVisible(true)}
        disabled={formIsVisible}
      >Registrar entrada/saída</Button>
      <Grid container sx={{marginTop: theme.spacing(1)}}>
        {!products.filter(prod => prod.quantity < prod.min_quantity).length && (
          <Grid item xs display='flex' justifyContent='center'>
            <Typography
              component='h2'
              variant='h4'
            >
              Não há produtos com estoque baixo
            </Typography>
          </Grid>
        )}
        {products.filter(prod => prod.quantity < prod.min_quantity).map((product, index) => (
          <Grid key={index} item md={3} sm={4} xs={6}>
            <Card sx={{
              backgroundColor: product.quantity < product.min_quantity ? theme.palette.error.main : undefined
            }}>
              <Grid container>
                <Grid item xs>
                  <CardActionArea onClick={redirectToStockScreen}>
                    <CardContent>
                      <Typography color={'#FFF'}>{product.name}</Typography>
                      <Typography color={'#FFF'}>Quantidade: {product.quantity}</Typography>
                      <Typography color={'#FFF'}>Quant. mín.: {product.min_quantity}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
export default Dashboard;
