import React from 'react';
import Dashboard from './Dashboard';
import * as Icon from '@mui/icons-material'
import UsuariosCadastro from './UsuariosCadastro';

export interface ScreenProps {
  path: string
  name: string
  icon: JSX.Element
  component: React.ReactNode
}

const screens: ScreenProps[] = [
  {
    name: 'Dashboard',
    path: '/',
    component: <Dashboard/>,
    icon: <Icon.Home/>
  },
  {
    name: 'Usuários',
    path: '/users',
    component: <UsuariosCadastro/>,
    icon: <Icon.People/>
  }
];
export default screens;
