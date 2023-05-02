import React from 'react';
import Dashboard from './Dashboard';
import * as Icon from '@mui/icons-material'
import Usuarios from './Usuarios';
import Fornecedores from './Fornecedores';

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
    component: <Usuarios/>,
    icon: <Icon.People/>
  },
  {
    name: 'Fornecedores',
    path: '/providers',
    component: <Fornecedores/>,
    icon: <Icon.Handshake/>
  }
];
export default screens;
