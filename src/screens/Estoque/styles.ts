import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  h1:{
    color: '#00264d'
},
  tabela:{
    width:'800px',

  },
  botao:{
    width:'55px'
  },
  // o botãoler é o botão do ler mais :3
  botaoler:{
    right:'62px',
    top:'6px'
  },
  minQuantityRow: {
    backgroundColor: theme.palette.error.main,
    color: '#FFF'
  }
}));
