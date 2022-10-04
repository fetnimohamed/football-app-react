import { TableContainer, Stack, TextField, Typography } from '@material-ui/core';
import Modal from '../../ui-component/modal/modal';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from 'react';
import useHistoryService from 'services/historyservice.';
import Paper from '@mui/material/Paper';
import { DataGrid, GridToolbarExport, GridToolbarContainer } from '@material-ui/data-grid';
import useProcessTypeService from 'services/processTypeService';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImportOutput from 'views/automaticReport/importOutput';
import moment from 'moment';
import { DesktopDatePicker, DesktopDateRangePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box } from '@material-ui/system';
import useClotureDataService from 'services/ClotureDate.service';
import { toast } from 'react-toastify';
import useMachineService from 'services/machineService';

const HistoryPassation = () => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 7,
    width: '25%',
    maxWidth: '100vw',
    pt: 1,
    px: 4,
    pb: 2,
    display: 'flex',
    justifyContent: 'center',
  };
  //use state zone//
  const [rows, setRows] = useState([]);
  const [processType, setProcessType] = useState([]);
  const [periode, setPeriode] = useState({});
  const [row, setrow] = useState(null);
  const [viewModal, setviewModal] = useState(false);

  const [value, setValue] = useState('');
  const [Range, setRange] = React.useState([null, null]);
  const [filter, setfilter] = useState({
    machine: '',
    date: '',
    processType_id: '',
    quart: '',
  });

  //service//
  const { getHistory } = useHistoryService();
  const { getpassation, getEtat } = useClotureDataService();
  const [machines, setMachines] = useState([]);

  const { getAllProcessTypes } = useProcessTypeService();
  const { getAllMachines } = useMachineService();

  useEffect(() => {
    getData();
  }, []);
  //getdata//
  const getData = async () => {
    const process = await getAllProcessTypes();
    setProcessType(process);
    console.log('process__pp', process);
    const machineData = await getAllMachines();
    setMachines(machineData);
  };

  const search = async (filter) => {
    //alert(JSON.stringify(filter))
    if (filter.processType_id == '') toast.info('insérer le type de process');
    else if (filter.quart == '') toast.info('insérer le quart');
    else if (filter.machine == '') toast.info('insérer code Machine');
    else if (filter.date == '') toast.info('insérer une date');
    else {
      const etatdata = await getEtat(filter);
      console.log('etatdata', etatdata);
      if (!etatdata.length) {
        toast.warn('données introuvable');
      } else {
        setRows(etatdata);
      }
    }
  };

  const columns = [
    {
      field: 'created_date',
      headerName: 'Date - Heure',
      width: 250,
      renderCell: (params) => <div>{moment(params.row.data.start).format('LLL')}</div>,
    },
    {
      field: 'compagnon',
      headerName: ' Editeur',
      width: 150,
    },
    {
      field: 'etat',
      headerName: 'Etat',
      width: 400,
      renderCell: (params) => (
        <div>
          {params.row.etat == 'Standart' ? (
            <Chip label={params.row.etat} color="success" variant="outlined" />
          ) : (
            <Chip
              label={params.row.etat + '/' + params.row.cat + '/' + params.row.cause}
              color="error"
              variant="outlined"
            />
          )}
        </div>
      ),
    },
    // {
    //   field: "",
    //   headerName: "Actions",
    //   sortable: false,
    //   width: 150,
    //   disableClickEventBubbling: true,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <IconButton
    //           color="primary"
    //           aria-label="upload picture"
    //           component="span"
    //           onClick={() => {
    //             //setrow(params.row);
    //             //setviewModal(true)
    //           }}
    //         >
    //           <RemoveRedEyeIcon />
    //         </IconButton>
    //       </>
    //     );
    //   },
    // },
  ];

  return (
    <>
      <Stack direction="row" spacing={1} margin={1}>
        <FormControl style={{ width: '30%' }}>
          <InputLabel id="demo-simple-select-label">Type de process</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            //value={quartdata.Process_type_id}
            onChange={(e) => {
              setfilter({ ...filter, processType_id: e.target.value });
              const machineList = machines.filter((p) => p.id_processType === e.target.value);
              setMachines(machineList);
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {processType.map((prosess) => (
              <MenuItem value={prosess.id}>{prosess.designation}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ width: '30%' }}>
          <InputLabel id="demo-simple-select-label">Quart</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            label="quart de début"
            onChange={(event) => {
              setfilter({ ...filter, ['quart']: event.target.value });
            }}
          >
            <MenuItem value="">
              <em>Aucune</em>
            </MenuItem>
            <MenuItem value={'matin'}>matin</MenuItem>
            <MenuItem value={'midi'}>Aprés midi</MenuItem>
            <MenuItem value={'nuit'}>nuit</MenuItem>
          </Select>
        </FormControl>

        <FormControl style={{ width: '30%' }}>
          <InputLabel id="demo-simple-select-label">Machine</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            onChange={(e) => setfilter({ ...filter, ['machine']: e.target.value })}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {machines.map((machine) => (
              <MenuItem value={machine.id}>{machine.code}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ width: '25%' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <DesktopDatePicker
                inputFormat="dd/MM/yyyy"
                label="Date"
                value={filter.date}
                onChange={(newValue) => {
                  setfilter({ ...filter, ['date']: moment(newValue) });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider>
        </FormControl>
        <LoadingButton
          //onClick={handleClick}
          variant="contained"
          loadingIndicator="en cours..."
          onClick={() => {
            search(filter);
          }}
          //disabled
        >
          Rechercher
        </LoadingButton>
      </Stack>
      <TableContainer component={Paper}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} hideFooterPagination={true} />
        </div>
        {/* <Modal
          close={() => {
            setviewModal(false);
            setrow(null);
          }}
          open={viewModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        ></Modal> */}
      </TableContainer>
    </>
  );
};
export default HistoryPassation;
