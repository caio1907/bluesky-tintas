import React, { Component } from 'react';
import Dashboard from './Dashboard';
import * as Icon from '@mui/icons-material'
import Cadastros from './Cadastros';
import Estoque from './Estoque';

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
  },
  {
    name: 'Estoque',
    path: '/estoque',
    component: <Estoque/>,
    icon: <Icon.Storage/>
  }

];
export default screens;
