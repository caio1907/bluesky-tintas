import React from 'react';
import useStyles from './styles';
import { TextField, InputAdornment, Grid, Box, Button } from '@mui/material';
import { useState } from 'react';
import * as Icon from '@mui/icons-material'


const Estoque: React.FC = () => {
  const classes = useStyles();
  const [filter, setFilter] = useState('');

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  // Dados da tabela
  const tableData = [
    { coluna1: '02323', coluna2: 'tinta amarela', coluna3: 'parede', coluna4: "kibom", coluna5: "5" },
    { coluna1: '54321', coluna2: 'tinta  vermelha', coluna3: 'óleo', coluna4: "coral", coluna5: "7" },
    { coluna1: '12345', coluna2: 'tinta azul piscina', coluna3: 'óleo', coluna4: "surveni",coluna5: "2" },
    { coluna1: '542', coluna2: 'tinta  vermelha', coluna3: 'óleo', coluna4: "friboi",coluna5: "3" },
  ];

  const filteredData = tableData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  return (
    <div>
      <h1 className={classes.h1}>Estoque: </h1>
      <Grid container
        direction="row"
        justifyContent="space-between"
        alignItems="center">
            <button className={classes.botao}><Icon.Print/></button>
      <TextField
        label="Filtrar"
        value={filter}
        onChange={handleFilterChange}
        margin="dense"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Icon.FilterAlt />
            </InputAdornment>
          ),
        }}
      />
      </Grid>
      <Box mb={2} />
      <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center">
      <table className={classes.tabela}
      border={1}
      >
        <thead>
          <tr>
            <th>Cod.</th>
            <th>Nome</th>
            <th>Variação</th>
            <th>Fornecedor</th>
            <th>Qnt</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.coluna1}</td>
              <td>{item.coluna2}</td>
              <td>{item.coluna3}</td>
              <td>{item.coluna4}</td>
              <td>{item.coluna5}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </Grid>
      <Grid container
        direction="row"
        justifyContent="flex-end"
        alignItems="center" >
        <Button variant='text' href='' size="small" className={classes.botaoler}> ver mais 	&#8675;  </Button>
        
      </Grid>
    </div>
  );
}

export default Estoque;
