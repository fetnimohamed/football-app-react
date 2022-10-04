import { Modal, TableContainer } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useHistoryService from 'services/historyservice.';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@material-ui/data-grid';
import useProcessTypeService from 'services/processTypeService';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImportOutput from 'views/automaticReport/importOutput';
import moment from 'moment';
import { Box } from '@material-ui/system';
import { Button, Stack } from '@material-ui/core';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
const History = () => {
  const styleError = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 7,
    width: 'auto',
    maxWidth: '100vw',
    pt: 1,
    px: 4,
    pb: 2,
    display: 'flex',
    justifyContent: 'center',
  };
  //use state zone//
  const [pageSize, setPageSize] = React.useState(25);

  const [rows, setRows] = useState([]);
  const [processType, setProcessType] = useState([]);
  const [history, setHistory] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  //service//
  const { getHistory } = useHistoryService();
  const { getAllProcessTypes } = useProcessTypeService();
  //getdata//
  const getData = async () => {
    const response = await getHistory();
    const process = await getAllProcessTypes();
    console.log('process', process);
    response.map((history) => {
      history.date = moment(history.date).format('YYYY-MM-DD HH:mm');
      history.processType = process.filter((process) => process.id === history.processTypeId)[0].designation;
    });
    setRows(response);
  };
  const columns = [
    {
      field: 'processType',
      headerName: 'Type de process',
      width: 250,
    },
    {
      field: 'date',
      headerName: "Date d'exécution",
      width: 250,
    },
    {
      field: 'executionType',
      headerName: "type d'éxécution",
      width: 250,
    },
    {
      field: 'status',
      headerName: 'Etat',
      width: 250,
      type: 'boolean',
    },
    {
      field: '',
      headerName: 'Actions',
      sortable: false,
      width: 150,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <>
            <VisibilityIcon
              onClick={() => {
                console.log(params.row);
                setHistory(params.row);
                params.row.history ? setOpenModal(true) : setOpenErrorModal(true);
              }}
            />
          </>
        );
      },
    },
  ];
  useEffect(() => {
    getData();
  }, []);
  return (
    <TableContainer component={Paper}>
      <div style={{ height: '550px', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[25, 50, 100]}
          pagination
          initialState={{
            sorting: {
              sortModel: [{ field: 'date', sort: 'asc' }],
            },
          }}
        />
      </div>
      <Modal open={openModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        {<ImportOutput data={history} close={() => setOpenModal(false)} />}
      </Modal>
      <Modal open={openErrorModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={{ ...styleError }}>
          <Stack direction="column" alignItems="center" justifyContent="center" margin={2}>
            <h1>Erreur d'import</h1>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 550 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">{history.date}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Indication de l'erreur</TableCell>
                    <TableCell align="right">{history.error}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Code erreur</TableCell>
                    <TableCell align="right">{history.code}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Type de process</TableCell>
                    <TableCell align="right">{history.processType}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Type de exécution</TableCell>
                    <TableCell align="right">{history.executionType}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            <Button
              variant="contained"
              size="small"
              style={{ margin: 10, float: 'right' }}
              margin={1}
              onClick={() => {
                setOpenErrorModal(false);
              }}
            >
              retour
            </Button>
          </Stack>
          {/* <Stack direction="column" alignItems="center" justifyContent="center" margin={2}>
          </Stack> */}
        </Box>
      </Modal>
    </TableContainer>
  );
};
export default History;
