import { Button } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import Modal from 'ui-component/modal/modal';
import Table from './Table';

import { ConfigsContext } from 'context/ConfigsContext';
import useConfigsService from '../../services/configsService';
import useFicheSuiveuseService from '../../services/ficheSuiveuseService';
import useClotureDataService from 'services/historyservice.';
import useProcessTypeService from 'services/processTypeService';
import { DesktopDatePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@material-ui/core';
import moment from 'moment';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import useMachineService from 'services/machineService';

export default function MachineStatusHistoryCorrection() {
  const { getConfigs, editMachineStatusData } = useFicheSuiveuseService();
  const { getAllProcessTypes } = useProcessTypeService();
  const { getAllMachines } = useMachineService();
  const { getEtat } = useClotureDataService();
  const [openModal, setOpenModal] = useState(false);
  const { ficheSuiveuseConfigs } = useContext(ConfigsContext);
  const [limit, setLimit] = useState(-1);
  let [machineStatusHistoryData, setMachineStatusHistoryData] = useState({});

  const [processType, setProcessType] = useState([]);
  const [machines, setMachines] = useState([]);

  const [filter, setfilter] = useState({
    machine: '',
    date: '',
    processType_id: '',
    quart: '',
  });

  //getdata//
  const getData = async () => {
    const process = await getAllProcessTypes();
    setProcessType(process);
    const listMachines = await getAllMachines();
    setMachines([...listMachines]);
  };
  const handleChangeprosess = (event) => {
    setfilter({ ...filter, processType_id: event.target.value });
  };

  const codeMachineCorrecte = (id) => {
    return machines.findIndex((m) => m.id === id);
  };

  const search = async (filter) => {
    setMachineStatusHistoryData({});
    const index = codeMachineCorrecte(filter.machine);
    if (index === -1) return toast.info('Code machine invalide');
    if (filter.processType_id == '') toast.info('Insérer le type de process');
    else if (filter.quart == '') toast.info('Insérer le quart');
    else if (filter.machine == '') toast.info('Insérer code Machine');
    else if (filter.date == '') toast.info('Insérer une date');
    else {
      await getConfigs(machines[index].id_model);
      const result = await getEtat(filter);
      if (JSON.stringify(result.historyData) === '{}') {
        toast.warn('Données introuvable');
      } else {
        setMachineStatusHistoryData({ ...result.historyData });
      }
    }
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  const correctionData = async (data) => {
    try {
      await editMachineStatusData(
        {
          correctionData: data,
          machine: filter.machine,
          quart: filter.quart,
          processType_id: filter.processType_id,
          date: filter.date,
        },
        () => setOpenModal(false),
      );
      await getData();
      toast.success('operation effectuée avec succes');
    } catch (err) {}
  };

  return (
    <div>
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
            onChange={(e) => setfilter({ ...filter, machine: e.target.value })}
          >
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
                label="Date "
                value={filter.date}
                onChange={(newValue) => {
                  setfilter({ ...filter, date: moment(newValue) });
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
      {JSON.stringify(machineStatusHistoryData) !== '{}' && (
        <Table
          machineStatusData={machineStatusHistoryData}
          configs={ficheSuiveuseConfigs || []}
          setOpenModal={setOpenModal}
          correctionData={correctionData}
          limit={limit}
        />
      )}
    </div>
  );
}
