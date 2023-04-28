import React from 'react';
import useStyles from './styles';
import { colors } from '@mui/material';
import { Box, Grid, TextField, Button, FormControl } from '@mui/material';

const Cadastros: React.FC = () => {
  return (
    <div>
      <h1 style={{ color: '#00264d' }}>Cadastro Itens:</h1>

      <Box mb={2} />

      <Grid container columnSpacing={17} direction="row" justifyContent="space-evenly" alignItems="flex-start">
        <TextField id="Cod" label="Código" variant="outlined" />
        <TextField id="Nome" label="Nome*" variant="outlined" style={{ width: 340 }} />
      </Grid>

      <Box mb={2} />

      <Grid container direction="row" justifyContent="space-evenly" alignItems="center" columnSpacing={7}>
        <TextField id="Cor" label="Cor" variant="outlined" style={{ width: 159 }} />
        <TextField id="Tipo" label="Tipo" variant="outlined" />
        <TextField id="Forne" label="Fornecedor" variant="outlined" />
      </Grid>

      <Box mb={2} />

      <FormControl style={{ width: 354 }}>
        <TextField multiline maxRows={4} fullWidth id="Descri" label="Descrição" variant="standard" />
      </FormControl>

      <Box mb={6} />

      <Grid container direction="row-reverse" justifyContent="space-between" alignItems="flex-end">
        <Button variant="contained" color="success">
          confirmar
        </Button>
        <Button variant="contained" color="error">
          cancelar
        </Button>
      </Grid>
    </div>
  );
};

export default Cadastros;
