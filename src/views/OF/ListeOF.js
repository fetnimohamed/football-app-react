import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TableContainer,
  TextField,
  Modal,
  Button,
  Pagination,
} from '@material-ui/core';
import { DataGrid, GridSearchIcon, frFR } from '@material-ui/data-grid';
import { ThemeProvider } from '@material-ui/private-theming';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from '@mui/material/Paper';
import useProcessTypeService from 'services/processTypeService';
import { DesktopDatePicker, DesktopDateRangePicker, LocalizationProvider } from '@mui/lab';
import DateFNSUtils from '@mui/lab/AdapterDateFns';
import Chip from '@mui/material/Chip';
import DetailsOF from './detailsOF';
import { Box } from '@material-ui/system';
import { toast } from 'react-toastify';
import useImportOrdersService from 'services/importOrdersService';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import RefreshIcon from '@mui/icons-material/Refresh';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
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
/////////////////////////////// BEGIN SEARCH //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////// END SEARCH //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

const ListOF = () => {
  //////////////////////////// services //////////////////
  ///////////////////////////////////////////////////////
  const { getAllProcessTypes } = useProcessTypeService();
  const { getOrders } = useImportOrdersService();

  /////////////////////////////USE STATE ////////////////
  //////////////////////////////////////////////////////
  const { t, i18n } = useTranslation();
  const [OFData, setOFData] = useState([]);
  const [displayModal, setDisplayModal] = useState();
  const [searchText, setSearchText] = useState('');
  const [displayData, setDisplayData] = useState([]);
  const [state, setState] = useState([]);
  const [processTypeData, setProcessTypedata] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [value, setValue] = React.useState([null, null]);
  const [pageSize, setPageSize] = React.useState(25);

  ////////////////////////// search method ////////////////
  /////////////////////////////////////////////////////////
  const requestSearch = (searchValue) => {
    if (searchValue) {
      setSearchText(searchValue);
      const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
      const filteredRows = state.filter((row) => {
        return Object.keys(row).some((field) => {
          return searchRegex.test(row[field].toString());
        });
      });
      setDisplayData(filteredRows);
    } else {
      setDisplayData(state);
    }
  };
  ////////////////////////////// get All data /////////////////////
  /////////////////////////////////////////////////////////////////

  async function getAllData() {
    const processTypeData = await getAllProcessTypes();
    setProcessTypedata(processTypeData);
    const data = await getOrders();
    setState(data.data);
    setDisplayData(data.data);
  }

  ////////////////////////////// use effect ///////////////////////
  /////////////////////////////////////////////////////////////////
  useEffect(() => {
    getAllData();
  }, []);

  ////////////////////////////// columns ///////////////////////
  /////////////////////////////////////////////////////////////////
  const columns = [
    {
      field: 'of',
      headerName: t('OF.OF'),
      width: 150,
      sortable: false,
      filterable: true,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'articleCode',
      headerName: t('OF.ARTICLE_CODE'),
      width: 200,
      sortable: false,
      filterable: true,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'designation',
      headerName: t('OF.DESIGNATION_ARTICLE'),
      width: 200,
      sortable: false,
      filterable: true,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'duration',
      headerName: t('OF.DURATION_OF'),
      width: 150,
      filterable: false,
      sortable: true,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'mois',
      headerName: t('OF.MONTH'),
      width: 150,
      filterable: false,
      sortable: true,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'start',
      headerName: t('OF.startDate'),
      width: 150,
      filterable: false,
      sortable: true,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'end',
      headerName: t('OF.endDate'),
      width: 150,
      filterable: false,
      sortable: true,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'machine',
      headerName: t('GENERAL.MACHINE'),
      width: 150,
      sortable: false,
      filterable: true,
      hide: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'processTypeId',
      headerName: t('PROCESS_TYPE.PROCESS_TYPE'),
      width: 250,
      sortable: false,
      hide: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <>{processTypeData ? processTypeData?.find((p) => p.id == params.row.processTypeId)?.designation : ''}</>
      ),
    },
    {
      field: 'quantity',
      headerName: t('OF.QUANTITY'),
      width: 150,
      sortable: true,
      hide: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'tcycle',
      headerName: 'Tcycle',
      width: 150,
      sortable: true,
      hide: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => <>{(params.row.duration / params.row.quantity).toFixed(2)}</>,
    },
    {
      field: 'status',
      headerName: t('GENERAL.STATUS'),
      width: 150,
      filterable: false,
      hide: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <>
          {params.row.status === 2 ? (
            <Chip label="En cours" color="warning" />
          ) : params.row.status === 1 ? (
            <Chip label="Cloturé" color="primary" style={{ backgroundColor: 'grey', color: 'white' }} />
          ) : params.row.status === 4 ? (
            <Chip label="Bloqué" color="error" />
          ) : (
            <Chip
              label="Non-traité"
              color="primary"
              style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}
            />
          )}
        </>
      ),
    },
    {
      field: 'actions',
      align: 'center',
      headerAlign: 'center',
      headerName: t('GENERAL.ACTIONS'),
      width: 50,
      hide: false,
      sortable: false,
      filterable: false,
      ///////// TO DISPLAY OF DETAILS //////////////////////////
      renderCell: (params) => (
        <>
          <VisibilityIcon
            onClick={() => {
              setOFData(params.row);
              setDisplayModal(true);
            }}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Stack direction="row" spacing={1} margin={1}>
        {/* ////////////////////////// BEGIN PROCESS TYPE LIST /////////////////////// */}
        <FormControl style={{ width: '30%' }}>
          <InputLabel id="demo-simple-select-label">{t('PROCESS_TYPE.PROCESS_TYPE')}</InputLabel>
          <Select
            name="id_processType"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={(e) => {
              console.log('e.target.value', e.target.value);
              const filteredRows = state.filter((p) => p.processTypeId === e.target.value);
              setDisplayData(filteredRows);
            }}
          >
            <MenuItem onClick={getAllData}>Tous les types de process</MenuItem>
            {processTypeData?.map((row) => (
              <MenuItem value={row.id}>{row.designation}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ width: '30%' }}>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            name="status"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={(e) => {
              console.log('e.target.value', e.target.value);
              const filteredRows = state.filter((p) => p.status == e.target.value);
              setDisplayData(filteredRows);
            }}
          >
            <MenuItem onClick={getAllData}>Tous les status</MenuItem>
            <MenuItem value="3">Non-traité</MenuItem>
            <MenuItem value="2">En cours</MenuItem>
            <MenuItem value="1">Cloturé</MenuItem>
            <MenuItem value="4">Bloqué</MenuItem>
          </Select>
        </FormControl>
        {/* ////////////////////////// END PROCESS TYPE LIST /////////////////////// */}

        {/* ////////////////////////// BEGIN DATEPICKER /////////////////////// */}
        {/* <LocalizationProvider dateAdapter={DateFNSUtils}>
                    <Stack spacing={3}>
                        <DesktopDatePicker
                            label="Péride de"
                            inputFormat="dd/MM/yyyy"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e)
                                state.filter((p) => { 
                                   console.log("Date de début", startDate)
                                   console.log("OF start date", Date(p.start))
                                   console.log("Date de fin", endDate)
            
                                })
                                // console.log('filteredRows',filteredRows)
                                // setDisplayData(filteredRows) 
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Stack>
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={DateFNSUtils}>
                    <Stack spacing={3}>
                        <DesktopDatePicker
                            label="à"
                            inputFormat="dd/MM/yyyy"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e)
                                if (startDate > e) {
                                    toast.warning('La date de fin doit être supérieur à la date de début !')
                                }
                                else{
                                    const filteredRows = state.filter((p) => startDate < Date(p.end) < e)
                                    console.log('filteredRows',filteredRows)
                                    setDisplayData(filteredRows) 
                                }

                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Stack>
                </LocalizationProvider> */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={1}>
            <DesktopDateRangePicker
              startText="Période de"
              inputFormat="dd/MM/yyyy"
              endText="à"
              value={value}
              onChange={(newValue) => {
                if (!newValue[0] || !newValue[1]) return;

                setValue(newValue);
                console.log('newValue[0]', newValue[0]);
                console.log('newValue[1]', newValue[1]);
                const filteredRows = state?.filter((p) => {
                  console.log('pppp', p.start);
                  console.log('sssssss', p.end);
                  const startDate = new Date(
                    p.start.substring(6, 10),
                    parseInt(p.start.substring(3, 5)) - 1,
                    p.start.substring(0, 2),
                  );
                  const endDate = new Date(
                    p.end.substring(6, 10),
                    parseInt(p.end.substring(3, 5)) - 1,
                    p.end.substring(0, 2),
                  );
                  console.log('start', startDate);
                  console.log('end', endDate);
                  return (
                    newValue[0].toISOString() < startDate.toISOString() &&
                    newValue[1].toISOString() > endDate.toISOString()
                  );
                });
                setDisplayData(filteredRows);
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <Box sx={{ mx: 2 }}> </Box>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}> à </Box>
                  <TextField {...endProps} />
                </React.Fragment>
              )}
            />
          </Stack>
        </LocalizationProvider>
        <Button>
          <RefreshIcon
            onClick={() => {
              setValue([null, null]);
              setDisplayData(state);
            }}
          />
        </Button>
      </Stack>
      {/* ////////////////////////// END DATEPICKER /////////////////////// */}

      {/* ////////////////////////// DATA GRID /////////////////////// */}
      <TableContainer sx={{ height: '75%', width: '100%' }} component={Paper}>
        {displayData ? (
          <ThemeProvider theme={defaultTheme}>
            <DataGrid
              components={{ Toolbar: QuickSearchToolbar }}
              aria-label="customized table"
              rows={displayData}
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[25, 50, 100]}
              pagination
              disableColumnMenu={true}
              componentsProps={{
                toolbar: {
                  value: searchText,
                  onChange: (event) => requestSearch(event.target.value),
                  clearSearch: () => {
                    setSearchText('');
                    getAllData();
                  },
                },
              }}
            />
          </ThemeProvider>
        ) : (
          'vide'
        )}
      </TableContainer>

      {/* ////////////////////////// DATA GRID /////////////////////// */}

      {/* ////////////////////////// DETAILS MODAL /////////////////////// */}
      <Modal open={displayModal}>
        <DetailsOF data={OFData} callback={() => setDisplayModal(false)} />
      </Modal>
      {/* ////////////////////////// DETAILS MODAL /////////////////////// */}
    </>
  );
};

export default ListOF;
