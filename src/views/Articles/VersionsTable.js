import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'v', headerName: 'V', width: 90 },
  {
    field: 'date',
    headerName: 'Date',
    width: 150,
    editable: false,
  },
  {
    field: 'value',
    headerName: 'T.Cycle',
    width: 250,
    editable: false,
  },
];

export default function VersionsTable({ data }) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data || []}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        disableColumnMenu={true}
      />
    </div>
  );
}
