import React, { useEffect, useState } from 'react';
import useStyles from './styles';
import { DataGrid, GridColDef, GridRowsProp, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { database } from '../../services/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Providers } from '../../types';

const Produtos: React.FC = () => {
  const classes = useStyles();
  const [providers, setProviders] = useState<Providers[]>([]);
  const dataGridColumns: GridColDef[] = [
    {field: 'ean', headerName: 'EAN', flex: 1},
    {field: 'name', headerName: 'Nome', flex: 1},
    {field: 'provider', headerName: 'Fornecedor', flex: 1},
    {field: 'quantity', headerName: 'Quantidade', flex: 1},
    {field: 'min_quantity', headerName: 'Quantidade Mínima', flex: 1}
  ];
  const [dataGridRows, setDataGridRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    const snapshot = onSnapshot(collection(database, 'providers'), snapshot => {
      setProviders(snapshot.docs.map((doc, index: number) => ({
        uid: doc.id,
        name: doc.get('name'),
        cnpj: doc.get('cnpj')
      })))
    });

    return () => {
      snapshot();
    }
  }, []);

  useEffect(() => {
    if (providers) {
      const q = query(collection(database, 'products'), orderBy('quantity', 'desc'));
      const snapshot = onSnapshot(q, snapshot => {
        setDataGridRows(snapshot.docs.map((doc, index: number) => ({
          id: index,
          uid: doc.id,
          ean: doc.get('ean'),
          provider: getProviderName(doc.get('provider')),
          min_quantity: doc.get('min_quantity'),
          name: doc.get('name'),
          quantity: doc.get('quantity')
        })))
      });

      return () => {
        snapshot();
      }
    }
  }, [providers]); // eslint-disable-line

  const getProviderName = (fornecedorId: number) => {
    return providers.find(provider => provider.uid === fornecedorId.toString())?.name;
  }

  const CustomDataGridToolbar: React.FC = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarExport/>
      </GridToolbarContainer>
    )
  }

  return (
    <div>
      <DataGrid
        columns={dataGridColumns}
        rows={dataGridRows}
        rowSelection={false}
        getCellClassName={params => {
          if (params.row.quantity < params.row.min_quantity) {
            return classes.minQuantityRow
          }
          return '';
        }}
        slots={{ toolbar: CustomDataGridToolbar }}
      />
    </div>
  );
}

export default Produtos;
