import {
  Button,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Box } from '@material-ui/system';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { InputLabel } from '@mui/material';
import MachineTree from './machineTree';

import Checkbox from '@mui/material/Checkbox';
import useProcessTypeService from 'services/processTypeService';
import { TreeView } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import useMappingService from 'services/mappingService';
import getpath from './getpath';
import useModelsMachineService from 'services/modelsMachineService';
import useMachineCycleService from 'services/machineCycle';

const style = {
  margin: '15px',
  position: 'absolute',
  overflowY: 'auto',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxWidth: '70vw',
  maxHeight: '90%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const MachineDetails = ({ machine, callback }) => {
  ////////////////////////// services ////////////////////////
  ///////////////////////////////////////////////////////////
  const { getProcessTypeById, getAllProcessTypes } = useProcessTypeService();
  const { getAllMapping } = useMappingService();
  const { getModelsMachine } = useModelsMachineService();
  const { getAllCycle } = useMachineCycleService();

  ////////////////////////// use state ////////////////////////
  /////////////////////////////////////////////////////////////
  const [processType, setProcessType] = useState([]);
  const [machinesModel, setMachinesModel] = useState([]);
  const [mapping, setMapping] = useState([]);
  const { t, i18n } = useTranslation();
  const [machineCycleData, setMachineCycleData] = useState([]);

  /////////////////// get all data ////////////////////////////
  //////////////////////////////////////////////////////////////
  async function getAllData() {
    const processType = await getAllProcessTypes();
    setProcessType(processType);
    const machineModel = await getModelsMachine();
    setMachinesModel(machineModel);
    const cycleMachineData = await getAllCycle();
    setMachineCycleData(cycleMachineData.data);
    const mapping = await getAllMapping();
    setMapping(mapping.data.mapping);
  }

  React.useEffect(() => {
    getAllData();
  }, []);

  return (
    <>
      {machine ? (
        <Box
          sx={{
            ...style,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="center" margin={1}>
            <h3>{t('MACHINE.MACHINE_DETAILS')}</h3>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="center">
            <Grid container spacing={2} lg={12}>
              <Grid item lg={6}>
                <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('GENERAL.CODE')} : </InputLabel>
              </Grid>

              <Grid item lg={6}>
                <InputLabel>{machine.code}</InputLabel>
              </Grid>

              <Grid item lg={6}>
                <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('PROCESS_TYPE.PROCESS_TYPE')}</InputLabel>
              </Grid>

              <Grid item lg={6}>
                <InputLabel> {processType?.find((p) => p.id === machine.id_processType)?.designation}</InputLabel>
              </Grid>

              <Grid item lg={6}>
                <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('MACHINE.MACHINE_CYCLE')}</InputLabel>
              </Grid>
              <Grid item lg={6}>
                <InputLabel>{machineCycleData?.find((p) => p.id === machine.id_cycle)?.designation}</InputLabel>
              </Grid>

              <Grid item lg={6}>
                <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('GENERAL.MODEL')}</InputLabel>
              </Grid>
              <Grid item lg={6}>
                <InputLabel>{machinesModel?.find((p) => p.id === machine.id_model)?.name}</InputLabel>
              </Grid>

              <Grid item lg={6}>
                <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('GENERAL.PDT')}</InputLabel>
              </Grid>
              <Grid item lg={6}>
                <InputLabel>{machine.workStation}</InputLabel>
              </Grid>

              <Grid item lg={6}>
                <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('MACHINE.MAXIMUM')}</InputLabel>
              </Grid>
              <Grid item lg={6}>
                <InputLabel>{machine.seuil}</InputLabel>
              </Grid>

              <Grid item lg={6}>
                <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('GENERAL.STATUS')}</InputLabel>
              </Grid>
              <Grid item lg={6}>
                {machine.status ? (
                  <InputLabel>
                    <Checkbox size="small" disabled defaultChecked />
                  </InputLabel>
                ) : (
                  <InputLabel>
                    <Checkbox size="small" disabled />
                  </InputLabel>
                )}
              </Grid>
              {machine.detail ? (
                <>
                  <Grid item lg={6}>
                    <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('GENERAL.DETAILS')}</InputLabel>
                  </Grid>
                  <Grid item lg={6}>
                    <InputLabel>{machine.detail}</InputLabel>
                  </Grid>
                </>
              ) : (
                ''
              )}

              <Grid item lg={6}>
                <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('GENERAL.LOCAL')}</InputLabel>
              </Grid>
              <Grid item lg={6}>
                <InputLabel>{mapping ? getpath(mapping, machine.local) : ''}</InputLabel>
              </Grid>
            </Grid>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="center" sx={{ margin: 5 }}>
            <TableContainer>
              <Table sx={{ minWidth: 400 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('GENERAL.ATTRIBUTES')}</TableCell>
                    <TableCell>{t('GENERAL.VALUE')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {machine.attributes.map((row) => (
                    <TableRow key={Object.keys(row)[0]}>
                      <TableCell component="th" scope="row">
                        {Object.keys(row)[0]}
                      </TableCell>
                      <TableCell>{row[Object.keys(row)]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Grid item lg={12}>
              <Box sx={{ '& button': { m: 1 }, display: 'flex', justifyContent: 'end' }}>
                <Button variant="contained" color="error" size="small" margin={1} onClick={() => callback()}>
                  {t('GENERAL.BACK')}
                </Button>
              </Box>
            </Grid>
          </Stack>
        </Box>
      ) : (
        'vide'
      )}
    </>
  );
};

export default MachineDetails;
