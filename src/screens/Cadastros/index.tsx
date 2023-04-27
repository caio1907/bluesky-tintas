import React from 'react';
import useStyles from './styles';
import { colors } from '@mui/material';
import {TextField} from '@mui/material';

const Cadastros: React.FC = () => {
    const classes = useStyles();


    return (
        <div>
            <h1 style={{color:'#00264d'}}>Cadastro Itens</h1>

            <TextField id="Cod" label="Código" variant="outlined" />
            <TextField id="Nome" label="Nome*" variant="outlined" />
            <TextField id="Cor" label="Cor" variant="outlined" />
            <TextField id="Tipo" label="Tipo" variant="outlined" />
            <TextField id="Forne" label="Fornecedor" variant="outlined" />
            <TextField multiline maxRows={4} id="Descri" label="Descrição" variant="standard"/>
        </div>
    );













};
export default Cadastros;