import React, { useEffect, useState } from 'react';
import { Card, CardActionArea, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { Item } from '../../types';
import { collection, onSnapshot } from 'firebase/firestore';
import { database } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Item[]>([]);

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
      setProducts(prods.filter(prod => prod.quantity < prod.min_quantity));
    });

    return () => {
      snapshot();
    }
  }, []);

  const redirectToStockScreen = () => {
    navigate('/stock')
  }

  return (
    <Grid container sx={{marginTop: theme.spacing(1)}}>
      {!products.length && (
        <Grid item xs display='flex' justifyContent='center'>
          <Typography
            component='h2'
            variant='h4'
          >
            Não há produtos com estoque baixo
          </Typography>
        </Grid>
      )}
      {products.map((product, index) => (
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
                    <Typography color={'#FFF'}>Quant. mín.:{product.min_quantity}</Typography>
                  </CardContent>
                </CardActionArea>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
export default Dashboard;
