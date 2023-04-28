import React, { useState } from 'react';
import useStyles from './styles';
import { redirect } from 'react-router-dom';
import { colors } from '@mui/material';
import { TextField } from '@mui/material';



const Dashboard: React.FC = () => {
  const classes = useStyles();
  const [filter, setFilter] = useState('');

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  // Dados da tabela
  const tableData = [
    { coluna1: '02323', coluna2: 'tinta amarela', coluna3: 'parede', coluna4: "5" },
    { coluna1: '54321', coluna2: 'tinta spray vermelha', coluna3: 'óleo', coluna4: "7" },
  ];

  const filteredData = tableData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  return (
    <div className={classes.main}>
      <h1 style={{ color: "#00264d" }}>Monitoramento:</h1>
      <TextField
        label="Filtrar"
        value={filter}
        onChange={handleFilterChange}
        fullWidth
        margin="dense"
      />
      <table >
        <thead>
          <tr>
            <th>Cod.</th>
            <th>Nome</th>
            <th>Variação</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Dashboard;