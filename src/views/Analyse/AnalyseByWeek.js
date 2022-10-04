import React, { useEffect, useState } from 'react';

import MainCard from 'ui-component/cards/MainCard';

import { TextField, Stack, Button, Grid } from '@mui/material';

import Modal from 'ui-component/modal/modal';

import MachineTree from './machineTree';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { toast } from 'react-toastify';

import useAnalyseService from '../../services/analyseService';

const WeekNumberFunction = () => {
  const currentdate = new Date(); // change date to test here
  const oneJan = new Date(currentdate.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
  const result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
  return result;
};

const WeekStartFunction = () => {
  let fixedDate = new Date('November 8, 2021');
  let dateToInc = new Date(fixedDate);
  const ourDate = new Date(); // change date to test here
  while (fixedDate.toISOString() < ourDate.toISOString()) {
    dateToInc = new Date(fixedDate);
    fixedDate.setDate(fixedDate.getDate() + parseInt(7));
  }
  return dateToInc;
};

const averageOfShiftsFromTRG = (TRG) => {
  const moy = [0, 0, 0, 0];
  const counters = [0, 0, 0, 0];
  if (Array.isArray(TRG))
    TRG.forEach((day) => {
      if (day.S1) {
        moy[0] += day.S1;
        counters[0] += 1;
      }
      if (day.S2) {
        moy[1] += day.S2;
        counters[1] += 1;
      }
      if (day.S3) {
        moy[2] += day.S3;
        counters[2] += 1;
      }
      if (day.S4) {
        moy[3] += day.S3;
        counters[3] += 1;
      }
    });
  const result = [];
  for (let i = 0; i < 4; i++) {
    if (moy[i] !== 0 && counters[i] !== 0) result.push(moy[i] / counters[i]);
    else result.push(null);
  }

  return {
    S1: result[0],
    S2: result[1],
    S3: result[2],
    S4: result[3],
  };
};

const averageOfWeek = (weekTRG) => {
  let moy = 0;
  let count = 0;
  if (weekTRG.S1) {
    moy += weekTRG.S1;
    count++;
  }
  if (weekTRG.S2) {
    moy += weekTRG.S2;
    count++;
  }
  if (weekTRG.S3) {
    moy += weekTRG.S3;
    count++;
  }
  if (weekTRG.S4) {
    moy += weekTRG.S4;
    count++;
  }
  if (moy !== 0) return Math.floor(moy / count);
};

const averageOfDaysFromShifts = (TRG) => {
  const result = TRG.map((day) => {
    let counter = 0;
    let moy = 0;
    if (day.S1) {
      moy += day.S1;
      counter += 1;
    }
    if (day.S2) {
      moy += day.S2;
      counter += 1;
    }
    if (day.S3) {
      moy += day.S3;
      counter += 1;
    }
    if (day.S4) {
      moy += day.S3;
      counter += 1;
    }
    if (moy !== 0 && counter !== 0) return moy / counter;
    else return null;
  });
  return result;
};

const RenderOneDay = ({ trgObject, siteValeurObjectif }) => {
  return (
    <TableCell component="th" scope="row">
      <TableCell
        sx={
          trgObject.S1
            ? trgObject.S1 < siteValeurObjectif
              ? { backgroundColor: '#e57373' }
              : { backgroundColor: '#69f0ae' }
            : null
        }
      >
        {' '}
        {trgObject.S1 ? trgObject.S1 : 'X'}{' '}
      </TableCell>
      <TableCell
        sx={
          trgObject.S2
            ? trgObject.S2 < siteValeurObjectif
              ? { backgroundColor: '#e57373' }
              : { backgroundColor: '#69f0ae' }
            : null
        }
      >
        {' '}
        {trgObject.S2 ? trgObject.S2 : 'X'}{' '}
      </TableCell>
      <TableCell
        sx={
          trgObject.S3
            ? trgObject.S3 < siteValeurObjectif
              ? { backgroundColor: '#e57373' }
              : { backgroundColor: '#69f0ae' }
            : null
        }
      >
        {' '}
        {trgObject.S3 ? trgObject.S3 : 'X'}{' '}
      </TableCell>
      {trgObject.S4 && (
        <TableCell
          sx={
            trgObject.S4
              ? trgObject.S4 < siteValeurObjectif
                ? { backgroundColor: '#e57373' }
                : { backgroundColor: '#69f0ae' }
              : null
          }
        >
          {' '}
          {trgObject.S4}{' '}
        </TableCell>
      )}
    </TableCell>
  );
};

export default function AnalyseByWeek() {
  // date params
  const WeekNumber = WeekNumberFunction();
  const WeekStart = WeekStartFunction();
  const [tableData, setTableData] = useState(null);
  const [site, setSite] = useState('');
  const [sitePath, setSitePath] = useState('');
  const [siteValeurObjectif, setSiteValeurObjectif] = useState('');
  const [ligneModal, setLigneModal] = useState(false);
  const { getTRGWeek } = useAnalyseService();

  return (
    <MainCard>
      <Stack spacing={4}>
        <Grid container direction="row" justifyContent="space-between" alignItems="flex-start" spacing={4}>
          <Grid item spacing={4}>
            <div>
              <TextField
                id="outlined-basic"
                label="Site"
                disabled={true}
                variant="outlined"
                value={sitePath}
                sx={{ marginTop: 2 }}
              />
              <Button
                onClick={() => {
                  setLigneModal(true);
                }}
                varian="outlined"
                sx={{ marginTop: 2, marginLeft: 1 }}
              >
                choisir ligne
              </Button>
            </div>

            <div>
              <TextField
                id="outlined-basic"
                label="Objectif"
                disabled={true}
                variant="outlined"
                value={siteValeurObjectif}
                sx={{ marginTop: 2 }}
              />
            </div>
            <div>
              <Button
                sx={{ marginTop: 2 }}
                variant="contained"
                onClick={() => {
                  if (!site || site.length === 0) {
                    toast.error('veuillez choisir un site');
                    return;
                  }
                  const startDay = WeekStart.toISOString().slice(0, 10);
                  const TRG = getTRGWeek(startDay, site).then((TRG) => {
                    const averageOfShifts = averageOfShiftsFromTRG(TRG);
                    const averageOfDays = averageOfDaysFromShifts(TRG);
                    const weekAverage = averageOfWeek(averageOfShifts);
                    setTableData({
                      TRG,
                      averageOfShifts,
                      averageOfDays,
                      weekAverage,
                    });
                  });
                }}
              >
                Valider
              </Button>
            </div>
          </Grid>
          <Grid item>
            <div>
              <h3>Le premier jour de la semaine (ISO-8601) est {WeekStart.toDateString()}</h3>
            </div>
            <div>
              <h3>Semaine numero {WeekNumber}</h3>
            </div>
          </Grid>
        </Grid>

        {tableData && (
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left"> </TableCell>
                    <TableCell align="right">Lundi</TableCell>
                    <TableCell align="right">Mardi</TableCell>
                    <TableCell align="right">Mercredi</TableCell>
                    <TableCell align="right">Jeudi</TableCell>
                    <TableCell align="right">Vendredi</TableCell>
                    <TableCell align="right">Samedi</TableCell>
                    <TableCell align="right">Dimanche</TableCell>
                    <TableCell align="right">Moyenne</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      TRG par Shift
                    </TableCell>

                    {tableData.TRG.map((trg) => (
                      <RenderOneDay trgObject={trg} siteValeurObjectif={siteValeurObjectif} />
                    ))}

                    <TableCell component="th" scope="row">
                      <TableCell
                        sx={
                          tableData.averageOfShifts?.S1
                            ? tableData.averageOfShifts?.S1 < siteValeurObjectif
                              ? { backgroundColor: '#e57373' }
                              : { backgroundColor: '#69f0ae' }
                            : null
                        }
                      >
                        {tableData.averageOfShifts?.S1 ? parseInt(tableData.averageOfShifts.S1) : 'X'}
                      </TableCell>
                      <TableCell
                        sx={
                          tableData.averageOfShifts?.S2
                            ? tableData.averageOfShifts?.S2 < siteValeurObjectif
                              ? { backgroundColor: '#e57373' }
                              : { backgroundColor: '#69f0ae' }
                            : null
                        }
                      >
                        {tableData.averageOfShifts?.S2 ? parseInt(tableData.averageOfShifts.S2) : 'X'}
                      </TableCell>
                      <TableCell
                        sx={
                          tableData.averageOfShifts?.S3
                            ? tableData.averageOfShifts?.S3 < siteValeurObjectif
                              ? { backgroundColor: '#e57373' }
                              : { backgroundColor: '#69f0ae' }
                            : null
                        }
                      >
                        {tableData.averageOfShifts?.S3 ? parseInt(tableData.averageOfShifts.S3) : 'X'}
                      </TableCell>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {' '}
                      TRG par jour{' '}
                    </TableCell>
                    {tableData.averageOfDays?.map((value) => (
                      <TableCell
                        component="th"
                        scope="row"
                        sx={
                          value
                            ? value < siteValeurObjectif
                              ? { backgroundColor: '#e57373' }
                              : { backgroundColor: '#69f0ae' }
                            : null
                        }
                      >
                        {value ? parseInt(value) : 'X'}
                      </TableCell>
                    ))}

                    <TableCell
                      component="th"
                      scope="row"
                      sx={
                        tableData.weekAverage
                          ? tableData.weekAverage < siteValeurObjectif
                            ? { backgroundColor: '#e57373' }
                            : { backgroundColor: '#69f0ae' }
                          : null
                      }
                    >
                      {tableData.weekAverage ? parseInt(tableData.weekAverage) : 'X'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </Stack>
      <Modal
        open={ligneModal}
        close={() => {
          setLigneModal(false);
        }}
      >
        <MachineTree
          setSite={setSite}
          setSitePath={setSitePath}
          setSiteValeurObjectif={setSiteValeurObjectif}
          setLigneModal={setLigneModal}
        />
      </Modal>
    </MainCard>
  );
}
