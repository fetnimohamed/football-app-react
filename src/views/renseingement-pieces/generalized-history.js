import { Box, Chip, TableContainer } from '@material-ui/core';
import { DataGrid, frFR, GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid';
import { ThemeProvider } from '@material-ui/private-theming';
import React, { Fragment, useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { styled, alpha, createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Menu from '@mui/material/Menu';
import Modal from '@mui/material/Modal';
import EditOf from './editOF';
import CreateIcon from '@mui/icons-material/Create';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
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
    //  minWidth: 250,
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
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
  focused: {},
  notchedOutline: {},
}));

const defaultTheme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  frFR,
);
const useStyles = makeStyles(
  (theme) => {
    return {
      root: {
        '& .super-app-theme--1': {
          backgroundColor: '#D1CFE2',
          '&:hover': {
            backgroundColor: '#D1CFE2',
          },
        },
        '& .super-app-theme--2': {
          backgroundColor: '#F0AB8B',
          opacity: 0.8,
          color: 'white',
          '&:hover': {
            backgroundColor: '#F0AB8B',
          },
        },
        '& .super-app-theme--3': {
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: 'white',
          },
        },
        '& .super-app-theme--4': {
          backgroundColor: '#E94556',
          color: 'white',
          opacity: 0.7,
          '&:hover': {
            backgroundColor: '#E94556',
          },
        },
        '& .super-app-theme--5': {
          backgroundColor: 'blue',
          opacity: 0.5,
          color: 'white',
          '&:hover': {
            backgroundColor: 'blue',
          },
        },
      },
    };
  },
  { defaultTheme },
);
// const style = {
//   margin: '15px',
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '40%',
//   maxWidth: '100vw',
//   maxHeight: '60%',
//   bgcolor: 'background.paper',
//   boxShadow: 24,

//   pb: 2,
// };

const GeneralizedHistory = (data) => {
  const columns = [
    {
      field: 'id',
      headerName: 'Réference OF',
      width: 150,
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
      field: 'pbonnes',
      headerName: 'Nbr pièces bonnes',
      width: 220,
      filterable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'pretouche',
      headerName: 'Nbr pièces retouches',
      width: 220,
      sortable: false,
      filterable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'prebutes',
      headerName: 'Nbr pièces rébutés',
      width: 180,
      sortable: false,
      filterable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'pattenteDQ',
      headerName: 'Nbr pièces ADQ',
      width: 220,
      sortable: false,
      filterable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 220,
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
    // {
    //   field: 'modifiy',
    //   headerName: 'Correction',
    //   width: 220,
    //   sortable: false,
    //   filterable: false,
    //   hide: false,
    //   headerAlign: 'center',
    //   align: 'center',
    //   renderCell: (params) => (
    //     <>
    //       <CreateIcon
    //         onClick={(e) => {
    //           setValue(params.row);
    //           console.log('ediyt', params.row);
    //           openEdit(e);
    //         }}
    //       />
    //     </>
    //   ),
    // },
  ];
  const [matricule, setUserMatricule] = useState();
  const [value, setValue] = useState([]);

  // EDIT DROPDOWN //
  const [anchorEl4, setAnchorEl4] = React.useState(null);
  const openEditValue = Boolean(anchorEl4);
  const openEdit = (event) => {
    // console.log(event);
    setAnchorEl4(event.currentTarget);
  };
  const closeEdit = () => {
    setAnchorEl4(null);
    // getData();
  };
  useEffect(() => {
    console.log('gennnnnnnnenenenene', data);
  }, []);
  return (
    <>
      <TableContainer sx={{ height: '450px', width: '100%' }} component={Paper}>
        <ThemeProvider theme={defaultTheme}>
          {data ? <DataGrid rows={data.data} aria-label="customized table" columns={columns} /> : <h3>test</h3>}
        </ThemeProvider>
      </TableContainer>
      <Modal open={openEditValue} onClose={closeEdit}>
        <Box sx={style}>
          {value.map((element) => {
            console.log('element', element);
            return <EditOf data={element} close={closeEdit} />;
          })}
        </Box>
      </Modal>
    </>
  );
};

export default GeneralizedHistory;
