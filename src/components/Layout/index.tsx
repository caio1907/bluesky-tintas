import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Box, Container, Grid, Typography } from '@mui/material';
import * as Icon from '@mui/icons-material';
import useStyles from './style';

interface Props {
  children: React.ReactNode,
  logOut: () => void
}

const Root = styled('div')(({theme}) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  height: 'calc(100vh - 64px)',
  flexDirection: 'column',
  justifyContent: 'space-between',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
  }
}));

const Dashboard:React.FC<Props> = ({
  children,
  logOut
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleChangeSidebarState = () => setIsSidebarOpen(prev => !prev);
  const classes = useStyles();
  return (
    <>
      <Root>
        <Container>
          <Box sx={{ pt: 2 }}>
            {children}
          </Box>
        </Container>
        <div className={classes.footerMain}>
          <div>
            <div className={classes.title}>
              <Icon.Phone/> Contato
            </div>
            <Typography>Tel: (081) 98765-4321</Typography>
            <Typography>E-mail: contato@bluesky.com</Typography>
          </div>
          <div>
            <div className={classes.title}>
              <Icon.Language/> Redes Sociais
            </div>
            <Typography>@BlueSkyTintas</Typography>
            <Grid container spacing={2}>
              <Grid item><Icon.Twitter/></Grid>
              <Grid item><Icon.Instagram/></Grid>
              <Grid item><Icon.Facebook/></Grid>
            </Grid>
          </div>
          <div>
            <div>
              <Typography>Termo e Condições</Typography>
              <Typography>Política de Privacidade</Typography>
            </div>
            <div>
              <Typography>Copyright <Icon.Copyright fontSize='small'/> 2023 BlueSkyTintas</Typography>
            </div>
          </div>
        </div>
      </Root>
      <Navbar {...{logOut}} sidebarOnOpen={handleChangeSidebarState}/>
      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
    </>
  )
}
export default Dashboard;
