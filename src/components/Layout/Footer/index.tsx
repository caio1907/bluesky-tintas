import React from 'react';
import { Grid, Typography } from '@mui/material';
import * as Icon from '@mui/icons-material';
import useStyles from './style';

const Footer:React.FC = () => {
  const classes = useStyles();
  return (
    <Grid container sx={{backgroundColor: '#111827', color: '#FFF', p: 2}}>
      <Grid item sm={6} md={4}>
        <div className={classes.title}>
          <Icon.Phone/> Contato
        </div>
        <Typography>Tel: (081) 98765-4321</Typography>
        <Typography>E-mail: contato@bluesky.com</Typography>
      </Grid>
      <Grid item sm={6} md={5}>
        <div className={classes.title}>
          <Icon.Language/> Redes Sociais
        </div>
        <Typography>@BlueSkyTintas</Typography>
        <Grid container spacing={2}>
          <Grid item><Icon.Twitter/></Grid>
          <Grid item><Icon.Instagram/></Grid>
          <Grid item><Icon.Facebook/></Grid>
        </Grid>
      </Grid>
      <Grid item sm={12} md={3}>
        <Grid container spacing={2}>
          <Grid item>
            <Typography>Termo e Condições</Typography>
          </Grid>
          <Grid item>
            <Typography>Política de Privacidade</Typography>
          </Grid>
          <Grid item>
            <Typography>Copyright &copy; 2023 BlueSkyTintas</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
export default Footer;
