import { TableContainer } from '@material-ui/core';
import { DataGrid, frFR, GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid';
import { ThemeProvider } from '@material-ui/private-theming';
import React, { Fragment, useEffect, useState } from 'react';
import { createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Box } from '@material-ui/system';
import moment from 'moment';

const defaultTheme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  frFR,
);
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
const columns = [
  {
    field: 'editTime',
    headerName: 'Date de modification',
    width: 250,
    filterable: true,
    sortable: true,
    headerAlign: 'center',
    align: 'center',
    hide: false,
    renderCell: (params) => <>{moment(params.row.editTime).format('MMMM Do YYYY, h:mm:ss a')}</>,
  },
  {
    field: 'of',
    headerName: 'OF',
    width: 220,
    sortable: true,
    filterable: true,
    hide: false,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'articleCode',
    headerName: 'Article',
    width: 220,
    sortable: true,
    filterable: true,
    hide: false,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'matricule',
    headerName: 'Compagnon',
    width: 220,
    sortable: true,
    filterable: true,
    hide: false,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'piece_type',
    headerName: 'Type de pièce',
    width: 220,
    sortable: false,
    filterable: false,
    hide: false,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <>
        {params.row.code === 1
          ? 'Bonne'
          : params.row.code === 2
          ? 'Retouches'
          : params.row.code === 3
          ? 'Rébutés'
          : 'ADQ'}
      </>
    ),
  },
  {
    field: 'quantity',
    headerName: 'Nombre de pièces',
    width: 220,
    sortable: true,
    filterable: true,
    hide: false,
    headerAlign: 'center',
    align: 'center',
  },
];

const DetailedHistory = (data) => {
  ///////////////////// use Effect //////////////////
  useEffect(() => {
    console.log('dataaaaaaaaa ', data);
  }, []);
  return (
    <>
      <TableContainer sx={{ height: '450px', width: '100%' }} component={Paper}>
        <ThemeProvider theme={defaultTheme}>
          {data ? (
            <DataGrid rows={data.data} columns={columns} />
          ) : (
            <Box>
              <h3>Pas de données disponible </h3>
            </Box>
          )}
        </ThemeProvider>
      </TableContainer>
    </>
  );
};

export default DetailedHistory;
