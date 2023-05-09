import React from 'react';
import Dashboard from './Dashboard';
import * as Icon from '@mui/icons-material'
import Estoque from './Estoque';
import Produtos from './Produtos';
import Usuarios from './Usuarios';
import Fornecedores from './Fornecedores';
import Relatorios from './Relatorios';

export interface ScreenProps {
  path: string
  name: string
  icon: JSX.Element
  component: React.ReactNode
  onlyAdmin?: boolean
}

const screens: ScreenProps[] = [
  {
    name: 'Dashboard',
    path: '/',
    component: <Dashboard/>,
    icon: <Icon.Home/>
  },
  {
    name: 'Estoque',
    path: '/stock',
    component: <Estoque/>,
    icon: <Icon.Storage/>
  },
  {
    name: 'Produtos',
    path: '/cadastro',
    component: <Produtos/>,
    icon: <Icon.Window/>
  },
  {
    name: 'Fornecedores',
    path: '/providers',
    component: <Fornecedores/>,
    icon: <Icon.Handshake/>
  },
  {
    name: 'Relatório de movimentações',
    path: '/reports',
    component: <Relatorios/>,
    icon: <Icon.Assessment/>
  },
  {
    name: 'Usuários',
    path: '/users',
    component: <Usuarios/>,
    icon: <Icon.People/>,
    onlyAdmin: true
  }
];
export default screens;
