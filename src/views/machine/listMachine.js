import * as React from 'react';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';
import {
  Button,
  TableContainer,
  Modal,
  Pagination,
  PaginationItem,
  InputLabel,
  Checkbox,
  TextField,
  IconButton,
  Stack,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import MachineDetails from './machineDetails';
import ConfirmDelete from 'views/processType/confirmDelete';
import AddMachineForm from './addMachineForm';
import useProcessTypeService from 'services/processTypeService';
import useModelsMachineService from 'services/modelsMachineService';

import ClearIcon from '@mui/icons-material/Clear';

import { DataGrid, GridSearchIcon, frFR } from '@material-ui/data-grid';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import EditMachineForm from './editMachine';
import useMachineService from 'services/machineService';
import ConfirmDeleteModal from './deleteMachineConfirm';
import { ConfigsContext } from 'context/ConfigsContext';
import { ThemeProvider } from '@material-ui/private-theming';
import useMappingService from 'services/mappingService';
import getpath from './getpath';

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
        placeholder="Recherche..."
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

const ListMachine = ({ data, refreshData }) => {
  //////////////////////////// services ////////////////////////
  //////////////////////////////////////////////////////////////
  const { getProcessTypeById, getAllModels, getAllProcessTypes } = useProcessTypeService();
  const { getAllMapping } = useMappingService();
  const { getModelsMachine } = useModelsMachineService();
  const { deleteMachine } = useMachineService();

  //////////////////////// use state ////////////////////////////
  //////////////////////////////////////////////////////////////

  const { t, i18n } = useTranslation();
  const [displayModal, setDisplayModal] = React.useState(false);
  const [displayEditModal, setDisplayEditModal] = React.useState(false);
  const [displayDeleteModal, setDisplayDeleteModal] = React.useState(false);
  const [displayData, setDisplayData] = React.useState([]);
  const [mapping, setMapping] = React.useState([]);
  const [machinesModel, setMachinesModel] = React.useState([]);
  const [processType, setProcessType] = React.useState([]);
  const [status, setStatus] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [model, setModel] = React.useState('');
  const [machine, setMachine] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const { models } = React.useContext(ConfigsContext);
  const [state, setState] = React.useState([]);
  const [pageSize, setPageSize] = React.useState(25);

  ///////////////////////// request search /////////////////////////////
  /////////////////////////////////////////////////////////////////////
  const requestSearch = (searchValue) => {
    console.log('"', searchValue);
    if (searchValue && searchValue !== '') {
      setSearchText(searchValue);
      const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
      const filteredRows = data.filter((row) => {
        return Object.keys(row).some((field) => {
          return searchRegex.test(row[field].toString());
        });
      });
      console.log(filteredRows);
      setDisplayData(filteredRows);
    } else {
      setDisplayData(data);
    }
  };
  //////////////////////// getAll Data ////////////////////////////////
  /////////////////////////////////////////////////////////////////////

  async function getAllData() {
    const processType = await getAllProcessTypes();
    setProcessType(processType);
    const machineModel = await getModelsMachine();
    setMachinesModel(machineModel);
    const mapping = await getAllMapping();
    setMapping(mapping.data.mapping);
    setDisplayData(data);
    setState(data);
  }

  React.useEffect(() => {
    getAllData();
  }, [data]);

  //////////////////////// COLUMNS ///////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  const columns = [
    {
      field: 'code',
      headerName: t('GENERAL.CODE'),
      width: 150,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      hide: false,
      disableColumnMenu: true,
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'processType',
      headerName: t('PROCESS_TYPE.PROCESS_TYPE'),
      width: 180,
      sortable: false,
      hide: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => <>{processType?.find((p) => p.id === params.row.id_processType)?.designation}</>,
    },
    {
      field: 'model',
      headerName: t('GENERAL.MODEL'),
      width: 180,
      sortable: false,
      hide: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => <>{machinesModel?.find((p) => p.id === params.row.id_model)?.name}</>,
    },
    {
      field: 'position',
      headerName: 'Position',
      width: 150,
      filterable: false,
      hide: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'mapping',
      headerName: t('GENERAL.LOCAL'),
      width: 180,
      sortable: false,
      filterable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
      disableColumnMenu: true,
      renderCell: (params) => <>{mapping ? getpath(mapping, params.row.local) : ''}</>,
    },
    {
      field: 'seuil',
      headerName: t('MACHINE.MAXIMUM'),
      width: 180,
      sortable: false,
      hide: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      disableColumnMenu: true,
      renderCell: (params) => <>{params.row.seuil}%</>,
    },
    {
      field: 'status',
      headerName: t('GENERAL.STATUS'),
      width: 180,
      filterable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
      disableColumnMenu: true,
      type: 'boolean',
    },
    {
      field: 'actions',
      align: 'center',
      headerAlign: 'center',
      headerName: t('GENERAL.ACTIONS'),
      width: 180,
      hide: false,
      sortable: false,
      disableColumnMenu: true,
      filterable: false,
      renderCell: (params) => (
        <>
          <VisibilityIcon
            onClick={() => {
              console.log(params.row);
              setMachine(params.row);
              setDisplayModal(true);
            }}
          />
          <CreateIcon
            onClick={() => {
              setMachine(params.row);
              setDisplayEditModal(true);
              console.log('ediyt', params.row);
            }}
          />
          <DeleteIcon
            onClick={() => {
              setMachine(params.row);
              setDisplayDeleteModal(true);
            }}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Stack direction="row" spacing={1} margin={1} justifyContent="center">
        {/* ////////////////////////// BEGIN PROCESS TYPE LIST /////////////////////// */}
        <FormControl style={{ width: '30%' }}>
          <InputLabel id="demo-simple-select-label">{t('PROCESS_TYPE.PROCESS_TYPE')}</InputLabel>
          <Select
            name="id_processType"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={(e) => {
              console.log('e.target.value', e.target.value);
              const filteredRows = state.filter((p) => p.id_processType === e.target.value);
              setDisplayData(filteredRows);
            }}
          >
            <MenuItem onClick={getAllData}>Tous les types de process</MenuItem>
            {processType?.map((row) => (
              <MenuItem value={row.id}>{row.designation}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* ////////////////////////// END PROCESS TYPE LIST /////////////////////// */}

        {/* ////////////////////////// BEGIN MACHINE MODEL LIST /////////////////////// */}
        <FormControl style={{ width: '30%' }}>
          <InputLabel id="demo-simple-select-label">{t('GENERAL.MODEL')}</InputLabel>
          <Select
            name="id_model"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={(e) => {
              console.log('e.target.value', e.target.value);
              const filteredRows = state.filter((p) => p.id_model === e.target.value);
              setDisplayData(filteredRows);
            }}
          >
            <MenuItem onClick={getAllData}>Tous les modèles de machine</MenuItem>
            {machinesModel?.map((row) => (
              <MenuItem value={row.id}>{row.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: '30%' }}>
          <InputLabel id="demo-multiple-name-label">Status</InputLabel>
          <Select
            label="Status"
            id="outlined-basic"
            variant="outlined"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          >
            <MenuItem value={true}>Activé</MenuItem>
            <MenuItem value={false}>Désactivé</MenuItem>
          </Select>
        </FormControl>
        {/* ////////////////////////// END MACHINE MODEL LIST /////////////////////// */}
      </Stack>
      <TableContainer sx={{ height: '440px', width: '1400px' }} component={Paper}>
        <ThemeProvider theme={defaultTheme}>
          <DataGrid
            components={{ Toolbar: QuickSearchToolbar }}
            rows={status != 'all' ? displayData.filter((row) => row.status === status) : displayData}
            aria-label="customized table"
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[25, 50, 100]}
            pagination
            componentsProps={{
              toolbar: {
                value: searchText,
                onChange: (event) => {
                  requestSearch(event.target.value);
                  console.log(event.target.value, searchText);
                  setSearchText(event.target.value);
                },
                clearSearch: () => {
                  setSearchText('');
                  requestSearch('');
                },
              },
            }}
          />
        </ThemeProvider>
      </TableContainer>

      <Modal open={displayModal}>
        <MachineDetails machine={machine} callback={() => setDisplayModal(false)} />
      </Modal>

      <Modal open={displayEditModal}>
        <EditMachineForm
          existMachine={machine}
          callback={() => {
            setDisplayEditModal(false);
            refreshData();
          }}
        />
      </Modal>

      <Modal open={displayDeleteModal}>
        <ConfirmDeleteModal
          callback={() => {
            setDisplayDeleteModal(false);
            refreshData();
          }}
          deleteElemnt={deleteMachine}
          id={machine.id}
        />
      </Modal>
    </>
  );
};
export default ListMachine;
