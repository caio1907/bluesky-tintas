import React, { Component } from 'react';
import Dashboard from './Dashboard';
import * as Icon from '@mui/icons-material'
import Cadastros from './Cadastros';
import Produtos from './Estoque';

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
    name: 'Produtos',
    path: '/estoque',
    component: <Produtos/>,
    icon: <Icon.Storage/>
  }

];
export default screens;
