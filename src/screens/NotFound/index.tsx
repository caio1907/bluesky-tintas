import { Container, Typography } from "@mui/material"
import { Link } from "react-router-dom";

const NotFound:React.FC = () => {
  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography component='h1' variant='h5'>
        404
      </Typography>
      <Typography component={Link} to='/' variant='h6'>
        voltar
      </Typography>
    </Container>
  )
}
export default NotFound
