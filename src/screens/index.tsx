import React from 'react';
import Dashboard from './Dashboard';
import * as Icon from '@mui/icons-material'
import Cadastros from './Cadastros';

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
    name: 'Cadastro',
    path: '/cadastro',
    component: <Cadastros/>,
    icon: <Icon.AppRegistration/>
  }
  
];
export default screens;
