import React, { useEffect, useState } from 'react';
// material-ui
import { Button, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

// project imports
import Machines from './Machines.json';
import useMachineService from 'services/machineService';
import useQuartService from 'services/quart.service';
import useMappingService from 'services/mappingService';
import { mapTreeToArray, getAllRows, getRowName, getRowMachines, getBgDependOnStatus } from './utils';
import useFicheSuiveuseService from 'services/ficheSuiveuseService';
import imgUrl from '../../assets/images/machinelogo.PNG';
import moment from 'moment';

// ===========================|| LIGNES ET MACHINES DASHBOARD ||=========================== //
const useStyles = makeStyles({
  table: {
    border: '0px',
    borderCollapse: 'separate',
    borderSpacing: '0px 4px',
  },
});

const Lignesmachines = () => {
  const { getAllMachines } = useMachineService();
  const { getAllMapping } = useMappingService();
  const { getAllMachnesStatus, testInCoherence, getTrgValue, getNonTrgValue } = useFicheSuiveuseService();
  const { getQuartdetails } = useQuartService();

  const [isLoading, setLoading] = useState(true);
  const [machines, setMachines] = useState([]);
  const [mapping, setMapping] = useState([]);
  const [quart, setQuart] = useState('');
  const [rows, setRows] = useState([]);
  const [machinesStatus, setMachinesStatus] = useState([]);
  let [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();

  const classes = useStyles();

  const dotStyle = {
    backgroundColor: '#bbb',
    borderRadius: '50%',
    display: 'inline-block',
  };

  // get machines status
  const prepareMachineStatusData = async () => {
    const result = await getAllMachnesStatus();
    setMachinesStatus([...result]);
  };

  // get data
  useEffect(() => {
    (async () => {
      const quart = await getQuartdetails();
      // console.log('quart', quart?.quart + moment(quart.debut_quart).format('DDMMYYYY'));
      setQuart(quart?.quart + moment(quart.debut_quart).format('DDMMYYYY'));
      const result = await getAllMachines();
      const result2 = await getAllMapping();
      console.log('hello ', result);
      setMachines([...result]);
      setRows(getAllRows(result, result2.data.mapping));
      const array = [];
      mapTreeToArray(result2.data.mapping, 1, array);
      setMapping(array);
    })();
  }, []);

  //refreching data every minute
  useEffect(() => {
    (async () => {
      await await prepareMachineStatusData();
    })();
    setTimeout(async () => {
      currentTime = new Date();
      setCurrentTime(currentTime);
    }, 180 * 1000);
  }, [currentTime]);

  //get Machine By Id
  const getUserby = (machines, machineId, quart) => {
    console.log(
      'machineligne',
      machines.find((m) => m.id === machineId)?.userQuart &&
        machines.find((m) => m.id === machineId)?.userQuart === quart
        ? machines.find((m) => m.id === machineId).userId
        : 'nothing',
    );
    return machines.find((m) => m.id === machineId)?.userQuart &&
      machines.find((m) => m.id === machineId)?.userQuart === quart ? (
      machines.find((m) => m.id === machineId).userId
    ) : (
      <span style={{ color: 'red', fontSize: '25px' }}>Pas de Login</span>
    );
  };

  const getMachineById = (machines, machineId) => {
    console.log('machineligne', machines);
    return machines.find((m) => m.machineId === machineId);
  };
  const getTrgColor = (trg, seuil) => {
    return trg > seuil ? '#00CC00' : 'red';
  };
  //bgcolor={/*getBgDependOnStatus(machinesStatus, item.id)*/>}
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="table lignes et machines">
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row}>
              <TableCell align="center">
                <Typography variant="h3">{getRowName(mapping, row)}</Typography>
              </TableCell>
              {getRowMachines(machines, row).map((item, i) => (
                <TableCell style={{ border: '1px solid #eee' }} key={i}>
                  <Typography align="right">
                    <span
                      class="dot"
                      style={{
                        ...dotStyle,
                        width: '30px',
                        height: '30px',
                        backgroundColor: getBgDependOnStatus(machinesStatus, item.id),
                      }}
                    ></span>
                  </Typography>
                  <Typography align="center" style={{ fontSize: '30px' }}>
                    {item.code}
                  </Typography>
                  <Typography align="center">
                    <img width="95" height="95" src={imgUrl} onClick={() => navigate(`/fichesuiveuse/${item.id}`)} />
                  </Typography>
                  <Typography>
                    <span style={{ fontSize: '25px', fontFamily: 'sans-serif' }}>
                      <pre>
                        <span>
                          <span style={{ fontSize: '25px', fontWeight: 'bold' }}>Matricule : </span>
                          {getUserby(machines, item.id, quart) || (
                            <span style={{ color: 'red', fontSize: '25px', fontWeight: 'bold' }}>Pas de Login</span>
                          )}
                        </span>
                        <br />
                        <br />
                        <br />
                        <span style={{ fontSize: '25px', fontWeight: 'bold' }}>TRG : </span>
                        <span
                          style={{
                            fontWeight: 'bold',
                            color: getTrgColor(getMachineById(machinesStatus, item.id)?.trg, item.seuil),
                            fontSize: '25px',
                          }}
                        >
                          {getMachineById(machinesStatus, item.id)?.trg?.toFixed(2)}
                          {getMachineById(machinesStatus, item.id)?.trg >= 0 ? '%' : ''}
                        </span>
                        {getMachineById(machinesStatus, item.id)?.adq > 0 ? (
                          <>
                            <br />
                            <br />
                            <br />
                            {/* <span style={{ fontSize: '25px', fontWeight: 'bold' }}> ADQ :</span> */}
                            <span
                              style={{
                                position: 'relative',
                                fontWeight: 'bold',
                                top: 5,
                                width: '20px',
                                height: '20px',
                                color: getMachineById(machinesStatus, item.id)?.adq > 0 ? 'red' : '#bbb',
                              }}
                            >
                              Pcs Attend décision
                            </span>{' '}
                          </>
                        ) : (
                          ''
                        )}
                      </pre>
                    </span>
                  </Typography>

                  {/* 
                   <hr />
                  <Typography align="center">
                    <Button variant="contained" onClick={() => navigate(`/fichesuiveuse/${item.id}`)}>
                      fiche suiveuse
                    </Button>
                  </Typography>
                   */}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Lignesmachines;
