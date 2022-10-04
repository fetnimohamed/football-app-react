import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridApi,
  GridCellValue,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridSearchIcon,
  frFR,
} from '@material-ui/data-grid';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Button,
  Modal,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import Paper from '@mui/material/Paper';
import useMachineCycleService from 'services/machineCycle';

import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@material-ui/system';
import AddCycle from './addEditMachineCycle';
import { useTranslation } from 'react-i18next';
import ConfirmDeleteModal from 'views/machine/deleteMachineConfirm';

import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import useProcessTypeService from 'services/processTypeService';
import { ThemeProvider } from '@material-ui/private-theming';

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
export default function MachineCycle() {
  /////////////////////// services //////////////////////////
  //////////////////////////////////////////////////////////

  const { getAllProcessTypes } = useProcessTypeService();
  const { addCycle, getAllCycle, editCycle, deleteCycle } = useMachineCycleService();

  //////////////////////// use state //////////////////////
  /////////////////////////////////////////////////////////

  const [cycles, setCycles] = useState([]);
  const [rows, setRows] = useState([]);
  const [cyclesToEdit, setCyclesToEdit] = useState([]);
  const [cyclesToDelete, setCyclesToDelete] = useState([]);
  const [processTypeData, setProcessTypedata] = useState([]);

  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [searchText, setSearchText] = useState('');
  const [openDelete, setOpenDelete] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenAdd = () => setOpenAdd(true);
  const { t, i18n } = useTranslation();
  const handleClose = () => {
    setOpen(false);
    setOpenAdd(false);
    setOpenDelete(false);
    getCycles();
  };

  ////////////////////// search method ////////////////////////
  /////////////////////////////////////////////////////////////
  const requestSearch = (searchValue) => {
    if (searchValue) {
      setSearchText(searchValue);
      const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
      const filteredRows = cycles.filter((row) => {
        return Object.keys(row).some((field) => {
          return searchRegex.test(row[field].toString());
        });
      });
      setRows(filteredRows);
    } else {
      setRows(cycles);
    }
  };

  /////////////////////////// Columns //////////////////////////
  //////////////////////////////////////////////////////////////
  const columns = [
    {
      field: 'processTypeId',
      headerName: t('PROCESS_TYPE.PROCESS_TYPE'),
      width: 250,

      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <>{processTypeData ? processTypeData?.find((p) => p.id === params.row.processTypeId)?.designation : ''}</>
      ),
    },
    {
      field: 'codeCycle',
      headerName: t('MACHINE_CYCLE.CYCLE_CODE'),
      width: 300,

      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'designation',
      headerName: t('GENERAL.DESIGNATION'),
      width: 300,

      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'margin',
      headerName: t('MACHINE.MARGIN'),
      width: 250,

      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        return <>{params.row.margin} %</>;
      },
    },
    {
      field: '',
      align: 'center',
      headerAlign: 'center',
      headerName: t('GENERAL.ACTIONS'),
      width: 250,
      hide: false,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <>
            <CreateIcon
              onClick={() => {
                handleOpen();
                setCyclesToEdit(params.row);
              }}
            />
            <DeleteIcon
              onClick={() => {
                console.log('delete');
                setOpenDelete(true);
                setCyclesToDelete(params.row);
                getCycles();
              }}
            />
          </>
        );
      },
    },
  ];
  //////////////////////////// get all data ////////////////////
  /////////////////////////////////////////////////////////////
  async function getCycles() {
    const data = await getAllCycle();
    const processTypeData = await getAllProcessTypes();
    setProcessTypedata(processTypeData);
    setCycles(data.data);
    setRows(data.data);
  }

  useEffect(() => {
    getCycles();
  }, []);

  return (
    <>
      <Stack direction="row" alignItems="end" justifyContent="end" margin={2}>
        <Button disableElevation size="large" type="submit" variant="contained" color="primary" onClick={handleOpenAdd}>
          {t('MACHINE.ADD_NEW_MACHINE_CYCLE')}
        </Button>
        <Modal open={openAdd}>
          <AddCycle handleClose={handleClose} />
        </Modal>
      </Stack>
      <Modal open={open}>{<AddCycle handleClose={handleClose} cycle={cyclesToEdit} />}</Modal>
      <Modal open={openDelete}>
        <ConfirmDeleteModal
          callback={() => {
            setOpenDelete(false);
          }}
          deleteElemnt={deleteCycle}
          id={cyclesToDelete.id}
        />
      </Modal>
      <TableContainer sx={{ height: '500px', width: '100%' }} component={Paper}>
        <ThemeProvider theme={defaultTheme}>
          {rows ? (
            <DataGrid
              components={{ Toolbar: QuickSearchToolbar }}
              rows={rows}
              columns={columns}
              hideFooterPagination={true}
              componentsProps={{
                toolbar: {
                  value: searchText,
                  onChange: (event) => {
                    requestSearch(event.target.value);
                    setSearchText(event.target.value);
                  },
                  clearSearch: () => {
                    setSearchText('');
                    getCycles();
                  },
                },
              }}
            />
          ) : (
            ''
          )}
        </ThemeProvider>
      </TableContainer>
    </>
  );
}
