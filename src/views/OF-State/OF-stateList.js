import { Box, Chip, Menu, Paper, TableContainer } from '@material-ui/core';
import { DataGrid, frFR } from '@material-ui/data-grid';
import { ThemeProvider } from '@material-ui/styles';
import react, { useEffect, useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';

import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import EditOf from './editOf';
import { styled, alpha } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import ADDRENS from './AddRens';

const defaultTheme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  frFR,
);
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 17,
    marginTop: theme.spacing(1),
    width: 1000,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
  focused: {},
  notchedOutline: {},
}));
const OFStateList = ({ state, displayTable, getData }) => {
  useEffect(() => {
    console.log('state', state);
  }, [state]);
  ////////////////// use state ////////////////
  const [value, setValue] = useState([]);
  //const [openEdit, setOpenEdit] = useState()

  // EDIT DROPDOWN //
  const [anchorEl4, setAnchorEl4] = useState(null);
  const openEditValue = Boolean(anchorEl4);
  const openEdit = (event) => {
    // console.log(event);
    setAnchorEl4(event.currentTarget);
  };
  const closeEdit = () => {
    setAnchorEl4(null);
    getData();
  };

  const columns = [
    {
      field: 'id',
      headerName: 'OF',
      width: 120,
      sortable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <>{params.row.of}</>;
      },
    },
    {
      field: 'articleCode',
      headerName: 'Code article',
      width: 150,
      sortable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'quantity',
      headerName: 'Lot',
      width: 100,
      sortable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'pbonnes',
      headerName: 'Bonnes',
      width: 150,
      filterable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'pretouche',
      headerName: 'Retouches',
      width: 150,
      sortable: false,
      filterable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'prebutes',
      headerName: 'Retour',
      width: 130,
      sortable: false,
      filterable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'pattenteDQ',
      headerName: 'ADQ',
      width: 100,
      sortable: false,
      filterable: false,
      hide: false,
      headerAlign: 'center',

      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Etat',
      width: 150,
      sortable: false,
      filterable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <>
          {params.row.status === 3 ? (
            <Chip
              label="Non-traité"
              color="primary"
              style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}
            />
          ) : params.row.status === 1 ? (
            <Chip label="Cloturé" color="primary" style={{ backgroundColor: 'grey', color: 'white' }} />
          ) : params.row.status === 4 ? (
            <Chip label="Bloqué" color="error" />
          ) : (
            <Chip label="En cours" color="warning" />
          )}
        </>
      ),
    },
    {
      field: 'modifiy',
      headerName: 'Correction',
      width: 150,
      sortable: false,
      filterable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <>
          <CreateIcon
            onClick={(e) => {
              setValue(state.data);
              openEdit(e);
            }}
          />
        </>
      ),
    },
  ];
  return (
    <>
      {displayTable ? (
        <>
          <TableContainer sx={{ height: '250px', width: '100%' }} component={Paper}>
            <ThemeProvider theme={defaultTheme}>
              <DataGrid
                rows={state.globalOFState}
                aria-label="customized table"
                disableColumnMenu={true}
                columns={columns}
              />
            </ThemeProvider>
          </TableContainer>
          <Modal open={openEditValue} onClose={closeEdit}>
            <Box sx={style}>
              {value.map((element) => {
                console.log('element', element);
                return <EditOf data={element} close={closeEdit} />;
              })}
              <ADDRENS data={state.globalOFState} />
            </Box>
          </Modal>
        </>
      ) : (
        <Box
          sx={{
            width: '100%',
            bgcolor: 'white',
            boxShadow: 3,
            borderRadius: 3,
            padding: '20px',
            marginTop: 5,
          }}
        >
          <h3>Veuillez remplir les champs du filtre pour visualiser les états des OFs</h3>
        </Box>
      )}
    </>
  );
};

export default OFStateList;
