import React, { useContext, useEffect, useState } from 'react';
import { IconEye } from '@tabler/icons';
import useProcessTypeService from 'services/processTypeService';
import { ConfigsContext } from 'context/ConfigsContext';
import useArticlesService from 'services/articlesService';
import { Button, TextField, Stack, Modal, MenuItem, FormControl, InputLabel, Select } from '@material-ui/core';
import moment from 'moment';
import { DataGrid, frFR, GridSearchIcon } from '@material-ui/data-grid';
import OvertureMachine from 'views/overtureMachine';
import useUserService from 'services/usersService';
import { AuthContext } from 'context/AuthContext';
import AddUserForm from './addUserForm';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import { Box } from '@material-ui/system';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { createStyles, makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

///////////////////////////////////////////
/*
Modal style
*/
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 7,
  width: '40%',
  maxWidth: '100vw',
  pt: 1,
  px: 4,
  pb: 2,
};
const defaultTheme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  frFR,
);
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        padding: theme.spacing(0.5, 0.5, 0),
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      },
      textField: {
        [theme.breakpoints.down('xs')]: {
          width: '100%',
        },
        border: `1px solid ${theme.palette.divider}`,
        margin: theme.spacing(2, 2, 1.5),
        padding: theme.spacing(2, 2, 1.5),
        borderRadius: 10,
        '& .MuiSvgIcon-root': {
          marginRight: theme.spacing(0.5),
        },
        '& .MuiInput-underline:before': {
          display: 'none',
        },
      },
    }),
  { defaultTheme },
);
function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function QuickSearchToolbar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Rechercher"
        className={classes.textField}
        InputProps={{
          startAdornment: <GridSearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
export default function ConfigUsers() {
  ///////////////////////////////////
  /* 
   use state
  */
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [processType, setProcessType] = useState('');
  const [userData, setUserData] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [status, setStatus] = useState('');
  const [searchText, setSearchText] = useState('');
  const [date, setDate] = useState(null);
  ///////////////////////////////////
  /* 
  services
  */
  const { getAllProcessTypes } = useProcessTypeService();
  const { getAllUsers, deleteUser } = useUserService();
  ///////////////////////////////////
  /* 
  use context
  */
  const { processTypes } = useContext(ConfigsContext);
  const { users } = useContext(AuthContext);
  const [rows, setRows] = useState(users);
  const [pageSize, setPageSize] = React.useState(25);

  ////////////////////// search method ////////////////////////
  /////////////////////////////////////////////////////////////
  const requestSearch = (searchValue) => {
    if (searchValue) {
      setSearchText(searchValue);
      const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
      const filteredRows = users.filter((row) => {
        return Object.keys(row).some((field) => {
          return searchRegex.test(row[field].toString());
        });
      });
      setRows(filteredRows);
    } else {
      setRows(users);
    }
  };
  ///////////////////////////////////
  /* 
   Datagrid columns
  */
  const columns = [
    {
      field: 'firstName',
      headerName: 'Nom',
      width: 200,
      filtrable: true,
      hide: false,
    },
    {
      field: 'lastName',
      headerName: 'Prénom',
      width: 200,
      filterable: true,
      hide: false,
    },
    { field: 'matricule', headerName: 'Matricule', width: 200, disableColumnMenu: true },
    {
      field: 'Etat',
      headerName: 'Statut',
      sortable: true,
      disableColumnMenu: true,
      width: 200,
      renderCell: (params) => (
        <div>
          <Chip
            label={params.row.status ? 'activé' : 'désactivé'}
            color={params.row.status ? 'success' : 'default'}
            variant="outlined"
          />
        </div>
      ),
    },
    {
      field: 'processType',
      headerName: 'Type de process',
      sortable: false,
      disableColumnMenu: true,
      width: 200,
      renderCell: (params) => <div>{processTypes?.find((p) => p.id === params.row.processType)?.designation}</div>,
    },
    {
      field: 'createDate',
      headerName: 'Date de création',
      sortable: true,
      disableColumnMenu: true,
      width: 200,
      renderCell: (params) => <div>{moment(params.row.createDate).format('LLL')}</div>,
    },
    {
      field: '',
      headerName: 'Activé/Désactivé',
      sortable: false,
      disableColumnMenu: true,
      width: 200,
      renderCell: (params) => (
        <div>
          <Switch
            checked={params.row.status}
            onClick={() => {
              setOpenDeleteModal(true);
              setUserData(params.row);
            }}
            name="gilad"
          />
        </div>
      ),
    },
    {
      field: 'Action ',
      headerName: 'Action',
      sortable: false,
      width: 200,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div>
          <IconButton aria-label="edit" onClick={() => openModal(params.row)}>
            <CreateIcon />
          </IconButton>
          <IconButton aria-label="show" onClick={() => openModal(params.row, true)}>
            <RemoveRedEyeIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  ///////////////////////////////////
  /* 
  Open details modal
  */
  const openModal = (details, rOnly = false) => {
    setOpenDetailsModal(true);
    setUserData(details);
    if (rOnly) setReadOnly(true);
  };

  ///////////////////////////////////
  /* 
  Close details Modal
  */
  const closeModal = () => {
    setOpenDetailsModal(false);
    setUserData({});
    setReadOnly(false);
  };
  ///////////////////////////////////
  /* 
   use Effect
  */

  useEffect(() => {
    getAllProcessTypes();
    getAllUsers(1, setRows);
    //setRows(users)
  }, []);

  ///////////////////////////////////////////////////
  /* 
  ADD OPERATOR MODAL Button
  */
  return (
    <>
      {/* ADD USER BUTTON */}
      <Stack direction="row" alignItems="end" justifyContent="end" margin={2}>
        <Button variant="contained" onClick={() => setOpenDetailsModal(true)}>
          Ajouter un compagnon
        </Button>
      </Stack>
      {/* FILTER WITH PROCESS TYPE */}
      <Stack
        direction="row"
        spacing={1}
        margin={1}
        sx={{
          backgroundColor: 'white',
          padding: '15px',
          justifyContent: 'center',
          margin: '15px',
          borderRadius: '15px',
        }}
      >
        {/* Choose process Type */}
        <FormControl sx={{ width: '25%' }}>
          <InputLabel id="demo-simple-select-label">Type de process</InputLabel>
          <Select
            name="processType"
            id="demo-simple-select"
            value={processType}
            onChange={(e) => {
              setDate(null);
              setStatus('');
              setProcessType(e.target.value);
              const filteredRows = users.filter((user) => user.processType === e.target.value);
              setRows(filteredRows);
            }}
          >
            {processTypes?.map((row) => (
              <MenuItem value={row.id}>{row.designation}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ width: '25%' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DesktopDatePicker
                inputFormat="dd/MM/yyyy"
                label="Date"
                value={date}
                onChange={(newValue) => {
                  setProcessType('');
                  setStatus('');
                  setDate(newValue);
                  const filteredRows = users.filter(
                    (user) => moment(newValue).format('YYYY-MM-DD') == moment(user.createDate).format('YYYY-MM-DD'),
                  );
                  setRows(filteredRows);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
        </FormControl>
        {/* FILTER WITH STATUS */}
        <FormControl sx={{ width: '25%' }}>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            name="status"
            id="demo-simple-select"
            value={status}
            onChange={(e) => {
              setDate(null);
              setProcessType('');
              setStatus(e.target.value);
              const filteredRows = users.filter((user) => user.status == e.target.value);
              setRows(filteredRows);
            }}
          >
            <MenuItem value="1">Activé</MenuItem>
            <MenuItem value="0">Désactivé</MenuItem>
          </Select>
        </FormControl>
        <Button>
          <RefreshIcon
            onClick={() => {
              setProcessType('');
              setStatus('');
              setDate(null);
              setRows(users);
            }}
          />
        </Button>
      </Stack>

      {/* FILTER WITH MATRICULE, FIRSTNAME OU LASTNAME */}
      {/* USERS DATA */}
      <div style={{ height: '400px', width: '100%', background: '#fff' }}>
        <ThemeProvider theme={defaultTheme}>
          <DataGrid
            components={{ Toolbar: QuickSearchToolbar }}
            rows={rows}
            columns={columns}
            pagination
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[25, 50, 100]}
            componentsProps={{
              toolbar: {
                value: searchText,
                onChange: (event) => {
                  requestSearch(event.target.value);
                  setSearchText(event.target.value);
                },
                clearSearch: () => {
                  setSearchText('');
                  setRows(users);
                },
              },
            }}
          />
        </ThemeProvider>
      </div>

      {/*  ADD OPERATOR MODAL */}
      <Modal open={openDetailsModal}>
        <AddUserForm
          editUserData={userData}
          readOnly={readOnly}
          closeModal={() => {
            closeModal();
            getAllUsers(1, setRows);
            setRows(users);
          }}
          refreshData={() => getAllUsers(1, setRows)}
        />
      </Modal>

      {/* DELETE Modal */}
      <Modal open={openDeleteModal}>
        <Box
          sx={{
            ...style,
            width: 500,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="center" margin={1}>
            <h2 variant="subtitle1">Désactiver un compagnon</h2>
          </Stack>
          <h3>Etes-vous sûr de vouloir effectuer cet action à cet élément ?</h3>
          <Button
            variant="contained"
            sx={{ m: 1 }}
            color="error"
            onClick={() => {
              deleteUser(
                userData.id,
                () => {
                  setUserData(null);
                  setOpenDeleteModal(false);
                },
                1,
              );
            }}
          >
            Oui
          </Button>
          <Button
            variant="contained"
            sx={{ m: 1 }}
            onClick={() => {
              setOpenDeleteModal(false);
              setUserData(null);
            }}
          >
            Non
          </Button>
        </Box>
      </Modal>
    </>
  );
}
