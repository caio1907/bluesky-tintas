import React, { Component } from 'react';
import Dashboard from './Dashboard';
import * as Icon from '@mui/icons-material'
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
    name: 'Produtos',
    path: '/products',
    component: <Produtos/>,
    icon: <Icon.Storage/>
  }

];
export default screens;
