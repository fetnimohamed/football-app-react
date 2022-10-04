import { TableContainer, Stack, TextField, Typography, Grid, Button } from '@material-ui/core';
import Modal from '../../ui-component/modal/modal';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import React, { useContext, useEffect, useState } from 'react';
import useHistoryService from 'services/historyservice.';
import Paper from '@mui/material/Paper';
import { DataGrid, GridToolbarExport, GridToolbarContainer } from '@material-ui/data-grid';
import useProcessTypeService from 'services/processTypeService';
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
  //use state zone//
  const [rows, setRows] = useState([]);
  const [processType, setProcessType] = useState([]);
  const [row, setrow] = useState(null);
  const [viewModal, setviewModal] = useState(false);

  const [Range, setRange] = React.useState([null, null]);
  const [filter, setfilter] = useState({
    machineId: '',
    start_date: Range[0],
    end_date: Range[1],
    processType_id: '',
  });

  //service//
  const { getpassation } = useClotureDataService();
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

    const machineData = await getAllMachines();
    setMachines(machineData);
  };

  const search = async (filter) => {
    if (filter.processType_id === '') toast.info('Le champs type de process est obligatoire');
    else if (filter.machineId === '') toast.info('Le champs machine est obligatoire');
    else if (filter.start_date == null || filter.end_date == null) toast.info('Veuillez choisir les dates !');
    else {
      const passations = await getpassation(filter);
      if (passations.length > 0) {
        setRows(passations);
      } else {
        toast.warn('données introuvable');
      }
    }
  };
  const columns = [
    {
      field: 'creationDate',
      headerName: 'Date - Heure',
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <td>{moment(params.row.creationDate).format('LLL')}</td>
          </>
        );
      },
    },
    {
      field: 'quartCode',
      headerName: 'Quart',
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <td>{params.row.quartCode.substring(0, params.row.quartCode.length - 8)}</td>
          </>
        );
      },
    },
    {
      field: 'matricule',
      headerName: 'Editeur',
      width: 180,
    },
    {
      field: 'passation_tags',
      headerName: 'Tag de passation',
      width: 250,
    },
    {
      field: 'testIncoherence',
      headerName: "Taux d'incohérence",
      width: 250,
      renderCell: (params) => {
        return (
          <>
            {(100 - (params.row.trgValue + params.row.nonTrgValues.nonTrgGlobalValue)).toFixed(2)}%
          </>
        );
      },
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
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={() => {
                setrow(params.row);
                setviewModal(true);
              }}
            >
              <RemoveRedEyeIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Stack direction="row" spacing={1} margin={1}>
        <FormControl style={{ width: '30%' }}>
          <InputLabel id="demo-simple-select-label">Type de process</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            onChange={(e) => {
              setfilter({ ...filter, processType_id: e.target.value });
              const machineList = machines.filter((p) => p.id_processType === e.target.value);
              setMachines(machineList);
            }}
          >
            {processType.map((prosess) => (
              <MenuItem value={prosess.id}>{prosess.designation}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ width: '30%' }}>
          <InputLabel id="demo-simple-select-label">Machine</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            onChange={(e) => setfilter({ ...filter, machineId: e.target.value })}
          >
            {machines.map((machine) => (
              <MenuItem value={machine.id}>{machine.code}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={15}>
            <DesktopDateRangePicker
              startText="Période de"
              inputFormat="dd/MM/yyyy"
              endText="à"
              value={Range}
              onChange={(newValue) => {
                if (!newValue[0] || !newValue[1]) return;
                setRange(newValue);
                setfilter({ ...filter, start_date: newValue[0], end_date: newValue[1] });
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
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} hideFooterPagination={true} />
        </div>
        <Modal
          close={() => {
            setviewModal(false);
            setrow(null);
          }}
          open={viewModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="center">
              <h3>Les détails d'une passation</h3>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="center">
              <Grid container spacing={2} lg={12}>
                <Grid item lg={6}>
                  <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>Matricule : </InputLabel>
                </Grid>

                <Grid item lg={6}>
                  <InputLabel>{row?.matricule}</InputLabel>
                </Grid>

                <Grid item lg={6}>
                  <InputLabel sx={{ fontWeight: 500, color: '#616161' }}> Machine :</InputLabel>
                </Grid>

                <Grid item lg={6}>
                  <InputLabel>{machines ? machines?.find((p) => p.id === row?.machine)?.code : ''}</InputLabel>
                </Grid>

                <Grid item lg={6}>
                  <InputLabel sx={{ fontWeight: 500, color: '#616161' }}> Date et Heure :</InputLabel>
                </Grid>
                <Grid item lg={6}>
                  <InputLabel>{moment(row?.creationDate).format('LLL')}</InputLabel>
                </Grid>

                <Grid item lg={6}>
                  <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>Quart :</InputLabel>
                </Grid>
                <Grid item lg={6}>
                  <InputLabel>{row?.quartCode.substring(0, row?.quartCode.length - 8)}</InputLabel>
                </Grid>

                <Grid item lg={6}>
                  <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>Tag de passation :</InputLabel>
                </Grid>
                <Grid item lg={6}>
                  <InputLabel>{row?.passation_tags}</InputLabel>
                </Grid>

                <Grid item lg={6}>
                  <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>Passation :</InputLabel>
                </Grid>
                <Grid item lg={6}>
                  <InputLabel>{row?.passation}</InputLabel>
                </Grid>

                <Grid item lg={6}>
                  <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>Justification :</InputLabel>
                </Grid>
                <Grid item lg={6} >
                  <InputLabel sx={{ overflow: 'hidden', whiteSpace: 'nowrap', display: 'block' }}>{row?.justification_tag}</InputLabel>
                </Grid>

                <Grid item lg={6}>
                  <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>Valeur de TRG :</InputLabel>
                </Grid>
                <Grid item lg={6}>
                  <InputLabel>{row?.trgValue.toFixed(2)}</InputLabel>
                </Grid>

                <Grid item lg={6}>
                  <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>Test d'incoherence :</InputLabel>
                </Grid>
                <Grid item lg={6}>
                  {row?.testIncoherence === -1 ? (
                    <Chip label="Non Acceptable" color="error" variant="outlined" />
                  ) : (
                    <Chip label="Acceptable" color="success" variant="outlined" />
                  )}
                </Grid>
              </Grid>
            </Stack>
          </Box>
        </Modal>
      </TableContainer>
    </>
  );
};
export default HistoryPassation;
