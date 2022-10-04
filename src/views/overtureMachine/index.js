import React, { useContext, useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ConfigsContext } from 'context/ConfigsContext';
import useProcessTypeService from 'services/processTypeService';
import { Button, Paper, TableContainer } from '@material-ui/core';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Grid from '@mui/material/Grid';

import MultiSelect from './multSelect';

import useModelsMachineService from 'services/modelsMachineService';
import Checkbox from '@mui/material/Checkbox';

import { IconPlus, IconPencil, IconTrash } from '@tabler/icons';
import useQuartService from 'services/quart.service';
import useMachineService from 'services/machineService';
import moment from 'moment';
import { toast } from 'react-toastify';

const stickyStyle = {
  position: 'sticky',
  left: 0,
  backgroundColor: 'white',
  zIndex: 2000,
};

const stickyHead = {
  backgroundColor: 'white',
  position: 'sticky',
  zIndex: 2000,
  top: 0,
};

export default function OvertureMachine({ data, editData, editspecData }) {
  const { getAllProcessTypes } = useProcessTypeService();
  const { editOVMachines, editOVMachinesSpec } = useModelsMachineService();
  const { getAllMachines } = useMachineService();

  const { machines } = useContext(ConfigsContext);

  const { getallquarts: getAllQuarters, getallquartsspec } = useQuartService();

  const [standardData, setStandardData] = useState([]);
  const [specData, setSpecData] = useState([]);
  const [day, setDay] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dataChanged, setDataChanged] = useState(false);
  const [processTypes, setProcessTypes] = useState([]);
  const [processTypeSelected, setProcessTypeSelected] = useState('all');

  const [selectedMachines, setSelectedMachines] = useState([]);

  const days = ['d', 'l', 'm', 'me', 'j', 'v', 's'];

  var Days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getAllMachines();
      const res1 = await getAllQuarters();
      const res2 = await getallquartsspec();
      const res3 = await getAllProcessTypes();
      setStandardData([...res1.models]);
      setSpecData([...res2.models]);
      setProcessTypes([...res3]);
      setDay(new Date(res1.models[res1.models.length - 1]?.createDate).getDate());
      setMonth(new Date(res1.models[res1.models.length - 1]?.createDate).getMonth());
      setYear(new Date(res1.models[res1.models.length - 1]?.createDate).getFullYear());
      setLoading(false);
    })();
  }, []);

  // handle validate
  const handleValidate = async () => {
    try {
      setDataChanged(false);
      await editOVMachines(standardData);
      await editOVMachinesSpec(specData);
      toast.success('Opération effectuée avec succès');
    } catch (err) {}
  };

  function checkInSpec(item, idM, idx, index) {
    const isExist = specData[index].Machines[idx].find((machine) => machine === idM);
    if (isExist) return true;
    return false;
  }

  const checkIn = (item, date, idM, idx) => {
    const { exist, index } = isSpec(date);
    if (exist) return checkInSpec(item, idM, idx, index);
    const isExist = standardData[standardData.length - 1].detail_semaine[item].machines[idx]?.findIndex(
      (machine) => machine === idM,
    );
    if (isExist !== -1) return true;
    return false;
  };

  const editSpecQ = async (item, idM, index, indx) => {
    const isExist = specData[index].Machines[indx].findIndex((m) => m === idM);
    if (isExist !== -1) {
      specData[index].Machines[indx] = specData[index]?.Machines[indx]?.filter((machine) => machine !== idM);
      setSpecData([...specData]);
    } else {
      specData[index].Machines[indx].push(idM);
      setSpecData([...specData]);
    }
  };

  const editQ = async (item, date, idM, indx) => {
    setDataChanged(true);
    const { exist, index } = isSpec(date);
    if (exist) return editSpecQ(item, idM, index, indx);
    const isExist = checkIn(item, date, idM, indx);
    if (isExist) {
      standardData[standardData.length - 1].detail_semaine[item].machines[indx] = standardData[
        standardData.length - 1
      ]?.detail_semaine[item].machines[indx].filter((machine) => machine !== idM);
      setStandardData([...standardData]);
    } else {
      standardData[standardData.length - 1].detail_semaine[item].machines[indx].push(idM);
      setStandardData([...standardData]);
    }
  };

  const nbrQuarts = (date) => {
    let exist = false;
    let isWorkDay = true;
    let index;
    specData.map((d, i) => {
      const d1 = new Date(d.date_quart[0]);
      const d2 = new Date(d.date_quart[1]);

      if (new Date(date) >= d1 && new Date(date) <= d2) {
        exist = true;
        index = i;
        if (d.jours_non_ouvrable.includes(moment(new Date(date)).format('YYYY/MM/DD'))) isWorkDay = false;
        return;
      }
    });

    if (exist) {
      if (!isWorkDay) return 0;
      let nb = 0;
      if (specData[index].details_quarter.activation_matin) nb++;
      if (specData[index].details_quarter.activation_midi) nb++;
      if (specData[index].details_quarter.activation_nuit) nb++;
      if (specData[index].details_quarter.activation_q4) nb++;
      return nb;
    }

    let nb = 0;
    if (standardData[standardData.length - 1].detail_semaine[getDayFirstLettre(date)].q1) nb++;
    if (standardData[standardData.length - 1].detail_semaine[getDayFirstLettre(date)].q2) nb++;
    if (standardData[standardData.length - 1].detail_semaine[getDayFirstLettre(date)].q3) nb++;
    if (standardData[standardData.length - 1].detail_semaine[getDayFirstLettre(date)].q4) nb++;
    return nb;
  };

  function isSpec(date) {
    let exist = false;
    let index;
    specData.map((d, i) => {
      const d1 = new Date(d.date_quart[0]);
      const d2 = new Date(d.date_quart[1]);
      if (new Date(date) >= d1 && new Date(date) <= d2) {
        exist = true;
        index = i;
        return;
      }
    });
    return { exist, index };
  }

  function getDaysBetweenDates(startDate, endDate) {
    let dates = [];

    const theDate = startDate;
    while (theDate < endDate) {
      dates = [...dates, new Date(theDate)];
      theDate.setDate(theDate.getDate() + 1);
    }
    return dates;
  }

  function getDay(date) {
    return Days[new Date(date).getDay()];
  }

  function getDayFirstLettre(date) {
    return days[new Date(date).getDay()];
  }

  function check1(date) {
    const { exist, index } = isSpec(date);
    if (exist) return specData[index].details_quarter.activation_matin;
    return standardData[standardData.length - 1].detail_semaine[getDayFirstLettre(date)].q1;
  }

  function check2(date) {
    const { exist, index } = isSpec(date);
    if (exist) return specData[index].details_quarter.activation_midi;
    return standardData[standardData.length - 1].detail_semaine[getDayFirstLettre(date)].q2;
  }

  function check3(date) {
    const { exist, index } = isSpec(date);
    if (exist) return specData[index].details_quarter.activation_nuit;
    return standardData[standardData.length - 1].detail_semaine[getDayFirstLettre(date)].q3;
  }

  function check4(date) {
    const { exist, index } = isSpec(date);
    if (exist) return specData[index].details_quarter.activation_q4;
    return standardData[standardData.length - 1].detail_semaine[getDayFirstLettre(date)].q4;
  }

  let dateList = getDaysBetweenDates(new Date(year, month + page - 1, day), new Date(year, month + page, day));

  if (loading)
    return (
      <Stack
        direction="row"
        component={Paper}
        spacing={1}
        margin={1}
        style={{ width: '100%', justifyContent: 'center', padding: 20 }}
      >
        {'Loading data...'}
      </Stack>
    );

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <select
            onChange={(e) => setProcessTypeSelected(e.target.value)}
            style={{ height: '90%', width: '100%', border: '1px #eee', borderRadius: 10 }}
          >
            <option value={'all'}>Tous les types de process</option>
            {processTypes.map((p) => (
              <option value={p.id} selected={processTypeSelected === p.id}>
                {p.designation}
              </option>
            ))}
          </select>
        </Grid>
        <Grid item xs={8}>
          <div style={{ width: '100%', margin: 'auto', paddingBottom: 5 }}>
            <MultiSelect
              data={machines
                .filter((machine) => {
                  if (processTypeSelected === 'all') return machine;
                  if (machine.id_processType === processTypeSelected) return machine;
                })
                .map((machine) => ({ value: machine.id, label: machine.code, ...machine }))}
              onChange={(values) => setSelectedMachines(values)}
            />
          </div>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" fullWidth disabled={!dataChanged} onClick={handleValidate}>
            sauvegarder
          </Button>
        </Grid>
      </Grid>

      <TableContainer style={{ width: '100%', margin: 'auto', height: '480px', backgroundColor: 'white' }}>
        <Table sx={{ borderColor: 'grey.500' }}>
          <TableHead>
            <TableRow>
              <TableCell rowspan="2" style={{ ...stickyStyle, top: 0, zIndex: 3000 }}>
                Machine
              </TableCell>
              {dateList.map((date) => (
                <TableCell
                  colspan={nbrQuarts(date)}
                  style={{
                    ...stickyHead,
                    display: nbrQuarts(date) === 0 ? 'none' : true,
                    background: isSpec(date).exist ? '#06B2FA' : 'white',
                    color: isSpec(date).exist ? 'white' : '',
                  }}
                >
                  {' '}
                  <div style={{ border: '1px solid #eee', padding: 3 }}>
                    <p>{getDay(date)}</p>
                    <p>{moment(date).format('DD/MM/YYYY')}</p>
                  </div>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              {dateList.map((date, i) => (
                <>
                  {check1(date) && nbrQuarts(date) > 0 ? (
                    <TableCell style={{ ...stickyHead, top: 120 }}>Matin</TableCell>
                  ) : null}
                  {check2(date) && nbrQuarts(date) > 0 ? (
                    <TableCell style={{ ...stickyHead, top: 120 }}>Après-Midi</TableCell>
                  ) : null}
                  {check3(date) && nbrQuarts(date) > 0 ? (
                    <TableCell style={{ ...stickyHead, top: 120 }}>Nuit</TableCell>
                  ) : null}
                  {check4(date) && nbrQuarts(date) > 0 ? (
                    <TableCell style={{ ...stickyHead, top: 120 }}> Quatrème quart</TableCell>
                  ) : null}
                </>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {' '}
            {selectedMachines?.map((machine, i) => (
              <>
                <TableRow>
                  <TableCell style={stickyStyle}>{machine.label}</TableCell>
                  {dateList.map((date, i) => (
                    <>
                      {check1(date) ? (
                        <TableCell>
                          <Checkbox
                            disabled={!machine.status}
                            checked={checkIn(getDayFirstLettre(date), date, machine.id, 0)}
                            onClick={() => editQ(getDayFirstLettre(date), date, machine.id, 0)}
                          />
                        </TableCell>
                      ) : null}
                      {check2(date) ? (
                        <TableCell>
                          <Checkbox
                            disabled={!machine.status}
                            checked={checkIn(getDayFirstLettre(date), date, machine.id, 1)}
                            onClick={() => editQ(getDayFirstLettre(date), date, machine.id, 1)}
                          />
                        </TableCell>
                      ) : null}
                      {check3(date) ? (
                        <TableCell>
                          <Checkbox
                            disabled={!machine.status}
                            checked={checkIn(getDayFirstLettre(date), date, machine.id, 2)}
                            onClick={() => editQ(getDayFirstLettre(date), date, machine.id, 2)}
                          />
                        </TableCell>
                      ) : null}
                      {check4(date) ? (
                        <TableCell>
                          <Checkbox
                            disabled={!machine.status}
                            checked={checkIn(getDayFirstLettre(date), date, machine.id, 3)}
                            onClick={() => editQ(getDayFirstLettre(date), date, machine.id, 3)}
                          />
                        </TableCell>
                      ) : null}
                    </>
                  ))}
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        direction="row"
        component={Paper}
        spacing={1}
        margin={1}
        style={{ width: '100%', justifyContent: 'center', padding: 10 }}
      >
        <Pagination
          page={page}
          count={parseInt(365 / 30)}
          onChange={(e, value) => setPage(value)}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </div>
  );
}
