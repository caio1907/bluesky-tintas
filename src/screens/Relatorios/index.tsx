import React, { useEffect, useState } from 'react';
import { Item, Providers, User } from '../../types';
import { Timestamp, collection, onSnapshot } from 'firebase/firestore';
import { database } from '../../services/firebase';
import { DataGrid, GridColDef, GridRowsProp, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { format } from 'date-fns';

const Relatorios:React.FC = () => {
  const [providers, setProviders] = useState<Providers[]>([]);
  const [products, setProducts] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const dataGridColumns: GridColDef[] = [
    {field: 'ean', headerName: 'EAN', flex: 1},
    {field: 'name', headerName: 'Nome', flex: 1},
    {field: 'provider', headerName: 'Fornecedor', flex: 1},
    {field: 'min_quantity', headerName: 'Quant. Mín.', flex: 1},
    {field: 'quantity', headerName: 'Quant.', flex: 1},
    {field: 'currenty_quantity', headerName: 'Quant. Atual', flex: 1},
    {
      field: 'type',
      headerName: 'Tipo',
      flex: 1,
      valueFormatter: ({value}) => value === 'E' ? 'Entrada' : value === 'S' ? 'Saída' : ''
    },
    {field: 'date', headerName: 'Data', flex: 1},
    {field: 'user', headerName: 'Usuário', flex: 1}
  ];
  const [dataGridRows, setDataGridRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    const snapshotProviders = onSnapshot(collection(database, 'providers'), snapshot => {
      setProviders(snapshot.docs.map((doc, index: number) => ({
        uid: doc.id,
        name: doc.get('name'),
        cnpj: doc.get('cnpj')
      })))
    });

    const snapshotProducts = onSnapshot(collection(database, 'products'), snapshot => {
      setProducts(snapshot.docs.map((doc, index: number) => ({
        id: index,
        uid: doc.id,
        ean: doc.get('ean'),
        provider: doc.get('provider'),
        min_quantity: doc.get('min_quantity'),
        name: doc.get('name'),
        quantity: doc.get('quantity'),
      })))
    });

    const snapshotUsers = onSnapshot(collection(database, 'users'), snapshot => {
      setUsers(snapshot.docs.map(doc => ({
        uid: doc.id,
        first_name: doc.get('first_name'),
        last_name: doc.get('last_name'),
        email: doc.get('email')
      })))
    })

    return () => {
      snapshotProviders();
      snapshotProducts();
      snapshotUsers();
    }
  }, []);

  useEffect(() => {
    if (providers.length && products.length && users.length) {
      const snapshot = onSnapshot(collection(database, 'logs'), snapshot => {
        setDataGridRows(snapshot.docs.map((doc, index: number) => {
          const product = getProductData(doc.get('product'));
          const timeStamp = new Timestamp(doc.get('created_at').seconds, doc.get('created_at').nanoseconds);
          return {
            id: index,
            ean: doc.get('product'),
            name: product?.name,
            provider: product?.provider ? getProviderName(product?.provider) : '',
            min_quantity: product?.min_quantity,
            currenty_quantity: product?.quantity,
            quantity: doc.get('quantity'),
            type: doc.get('type'),
            date: format(timeStamp.toDate(), 'dd/MM/yyyy HH:ii:ss'),
            user: getUserFullName(doc.get('user'))
          }
        }))
      });

      return () => {
        snapshot();
      }
    }
  }, [providers, products, users]); // eslint-disable-line

  const getProductData = (productEAN: number) => {
    return products.find(product => product.ean === productEAN.toString());
  }

  const getProviderName = (providerID:number) => {
    return providers.find(provider => provider.uid === providerID.toString())?.name
  }

  const getUserFullName = (userUID: string) => {
    const user = users.find(user => user.uid === userUID);
    return `${user?.first_name} ${user?.last_name}`;
  }

  const CustomDataGridToolBar: React.FC = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarExport/>
      </GridToolbarContainer>
    )
  }

  return (
    <>
      <DataGrid
        columns={dataGridColumns}
        rows={dataGridRows}
        rowSelection={false}
        slots={{toolbar: CustomDataGridToolBar}}
      />
    </>
  )
}
export default Relatorios;
