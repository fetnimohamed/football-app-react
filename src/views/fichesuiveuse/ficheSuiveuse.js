import React, { useEffect, useContext, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Chip, Stack } from '@material-ui/core';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import CreateIcon from '@mui/icons-material/Create';
import { styled, alpha } from '@mui/material/styles';
import { Box, Menu } from '@material-ui/core';
import EditOf from '../OF-State/editOf';
import Modal from '@mui/material/Modal';

import { useParams } from 'react-router-dom';

//import icons
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import TimeLine from '../../ui-component/TimeLine';
import { ConfigsContext } from 'context/ConfigsContext';
import { set, setQuarter } from 'date-fns';

import {
  remove,
  isExist,
  handleOpenConfig,
  getHours,
  getMinutes,
  concatTabs,
  getHoursMunites,
  getPerteintervals,
  getCategoryintervals,
  getCauseintervals,
  calculateTime,
  setduration,
  setdurationquart,
} from './utils';
import useFicheSuiveuseService from 'services/ficheSuiveuseService';
import { toast } from 'react-toastify';
import TestIncoherence from './testIncoherence';
import useMachineService from 'services/machineService';
import moment from 'moment';
import useOfService from 'services/ofService';
import { DataGrid } from '@material-ui/data-grid';

const iconStyle = {
  position: 'relative',
  height: 15,
  top: '3px',
  margin: 0,
};
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const tableCellStyle = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  cursor: 'default',
};

const now = new Date();

const tomorrow = new Date(now);

tomorrow.setDate(tomorrow.getDate() + 1);

const getTodayAtSpecificHour = (hour = 8, minutes = 0) =>
  set(now, { hours: hour, minutes: minutes, seconds: 0, milliseconds: 0 });

const getTomorrowAtSpecificHour = (hour = 8, minutes = 0) =>
  set(tomorrow, { hours: hour, minutes: minutes, seconds: 0, milliseconds: 0 });

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 17,
    marginTop: theme.spacing(1),
    minWidth: 1000,
    height: 200,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
  focused: {},
  notchedOutline: {},
}));
export default function MachineStatusHistory() {
  const [anchorEl4, setAnchorEl4] = useState(null);
  const openEditValue = Boolean(anchorEl4);
  const openEdit = (event) => {
    // console.log(event);
    setAnchorEl4(event.currentTarget);
  };
  const closeEdit = () => {
    setAnchorEl4(null);
    getData();
  };
  const columns = [
    { field: 'articleCode', headerName: 'Code article', width: 150 },
    { field: 'of', headerName: 'OF', width: 150 },
    { field: 'quantity', headerName: 'Quantité', width: 150 },
    { field: 'pbonnes', headerName: 'Bonnes', width: 150 },
    { field: 'prebutes', headerName: 'Rebutés', width: 150 },
    { field: 'pretouche', headerName: 'Retouches', width: 150 },
    { field: 'pattenteDQ', headerName: 'ADQ', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      sortable: false,
      filterable: false,
      hide: false,
      renderCell: (params) => (
        <>
          {params.row.status === 3 ? (
            <Chip
              label="Non-traité"
              color="primary"
              style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}
            />
          ) : params.row.status === 1 ? (
            <Chip label="Cloturé" color="primary" style={{ backgroundColor: 'grey', color: 'white' }} />
          ) : params.row.status === 4 ? (
            <Chip label="Bloqué" color="error" />
          ) : (
            <Chip label="En cours" color="warning" />
          )}
        </>
      ),
    },
    {
      field: 'correction',
      headerName: 'correction',
      width: 150,
      sortable: false,
      filterable: false,
      hide: false,
      renderCell: (params) => (
        <>
          <CreateIcon
            onClick={(e) => {
              params.row.machine = machine;
              setValue([params.row]);
              openEdit(e);
              console.log('quart', params.row);
            }}
          />
        </>
      ),
    },
  ];
  const [value, setValue] = useState([]);

  const { getConfigs, getMachineStatus } = useFicheSuiveuseService();
  const { getAllMachines } = useMachineService();
  const { getAllOfByMachine } = useOfService();
  const { ficheSuiveuseConfigs } = useContext(ConfigsContext);

  // states declaration
  const [openedPertes, setOpenedPertes] = useState([]);
  let [openedCategories, setOpenedCategories] = useState([]);
  const [intervals, setIntervals] = useState([]);
  let [machineStatusHistory, setMachineStatusHistory] = useState({});

  // filter states
  const [quart, setQuart] = useState('last');
  const [day, setDay] = useState('last');
  const [currentQuart, setCurrentCurrent] = useState('');
  const [openSelect, setOpenSelect] = useState(false);
  const [machine, setMachine] = useState({});
  const [filterState, setFilterrState] = useState({
    quartCode: '',
    machine: '',
    matricule: '',
    duration: '',
    quarts: [],
  });
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  let [currentTime, setCurrentTime] = useState(new Date());

  let [timelineInterval, setTimeLineInterval] = useState([]);

  const { machineId } = useParams();

  const manageOpenedConfigs = (id) => {
    if (isExist(openedPertes, id)) {
      ficheSuiveuseConfigs[id - 1].categories.map((category) => {
        if (isExist(openedCategories, category.id)) {
          openedCategories = remove(openedCategories, category.id);
        }
      });
      setOpenedCategories(openedCategories);
    }
    setOpenedPertes([...handleOpenConfig(openedPertes, id)]);
  };

  const getData = async (day = 'last', quart = 'last') => {
    try {
      const res = await getMachineStatus(machineId, day, quart);
      if (res) {
        const machineStatusData = res.machineStatus.map((status, index) => {
          let start = getTodayAtSpecificHour(getHours(status.start), getMinutes(status.start));
          let end = getTodayAtSpecificHour(getHours(status.end), getMinutes(status.end));

          if (getHours(status.end) < getHours(status.start)) {
            end = getTomorrowAtSpecificHour(getHours(status.end), getMinutes(status.end));
          }

          const c1 = new Date(status.start).getMonth() > new Date(res.startQuart).getMonth();
          const c2 = new Date(status.start).getMonth() === new Date(res.startQuart).getMonth();

          const c3 = new Date(status.start).getDate() > new Date(res.startQuart).getDate();

          const c4 = new Date(status.start).getDate() < new Date(res.startQuart).getDate();

          const c5 = new Date(status.start).getFullYear() === new Date(res.startQuart).getFullYear();

          if ((c1 && c4 && c5 && index !== 0) || (c2 && c3 && c5 && index !== 0)) {
            start = getTomorrowAtSpecificHour(getHours(status.start), getMinutes(status.start));
            end = getTomorrowAtSpecificHour(getHours(status.end), getMinutes(status.end));
          }

          return {
            ...status,
            start,
            end,
          };
        });
        setIntervals([...machineStatusData]);
        ///alert(JSON.stringify(res.history.rework))
        machineStatusHistory = res;
        setMachineStatusHistory(machineStatusHistory);
        setFilterrState({
          ...filterState,
          matricule: res.compagnon,
          machine: machineId,
          quartCode: res.quartCode,
          duration: Math.abs(setdurationquart(res.startQuart, res.endQuart)),
          restant: setduration(res.endQuart),
        });
        const response = await getAllOfByMachine(machineId, res.quartCode);
        if (response.status == 201) {
          setRows(response.fabricationOrder);
        }
        // set the time interval
        const start = new Date(res.startQuart);
        const end = new Date(res.endQuart);
        const date1 = getTodayAtSpecificHour(start.getHours(), start.getMinutes());
        const date2 =
          end.getHours() < start.getHours()
            ? getTomorrowAtSpecificHour(end.getHours(), end.getMinutes())
            : getTodayAtSpecificHour(end.getHours(), end.getMinutes());
        setTimeLineInterval([date1, date2]);

        // set the quart data
        setDay(res.date);
        setQuart(res.quart);
      }
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const machines = await getAllMachines();
      setMachine(machines.find((m) => m.id === machineId).id);
      await getConfigs(machines.find((m) => m.id === machineId).id_model);
      await getData(day, quart);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await getData(day, quart);
    })();
    setTimeout(async () => {
      setCurrentTime(new Date());
    }, 60 * 1000);
  }, [currentTime]);

  // handle status change
  const handleStatusChange = async (data) => {
    return;
  };

  // prepare the rework/reject time
  const prepareReworkRejectTimeInterval = (tab) => {
    if (!typeof tab === 'array') return;
    if (tab.length === 0) return [];
    const endHours = getHoursMunites(tab)[0] + getHours(machineStatusHistory.startQuart);
    const endMinutes = getHoursMunites(tab)[1];

    if (endMinutes > 59) {
      endHours = endHours + 1;
      endMinutes = endMinutes - 60;
    }
    return [
      {
        start: getTodayAtSpecificHour(
          getHours(machineStatusHistory?.startQuart),
          getMinutes(machineStatusHistory?.startQuart) - 1,
        ),
        end:
          endHours < getHours(machineStatusHistory?.startQuart)
            ? getTomorrowAtSpecificHour(endHours, endMinutes)
            : getTodayAtSpecificHour(endHours, endMinutes),
      },
    ];
  };

  // handle search functtion
  const serachMachineStatus = async () => {
    if (!day) return toast.info('Choisissez un jour');
    if (!quart) return toast.info('Choisissez un quart');
    // if (new Date(day).getDate() > new Date().getDate()) return toast.info('Date invalide');
    console.log(moment(day).isBefore(moment()), moment(day), moment());
    if (moment(day).isAfter(moment())) return toast.info('Date invalide');
    const result = await getData(day, quart);
    if (!result) {
      return toast.info("Les données n'existent pas pour ce jour");
    }
  };

  if (JSON.stringify(machineStatusHistory) === '{}')
    return (
      <Stack
        direction="row"
        component={Paper}
        spacing={1}
        margin={1}
        style={{ width: '100%', justifyContent: 'center', padding: 20 }}
      >
        {loading ? 'Loading data...' : 'Pas de données pour cette machine'}
      </Stack>
    );
  return (
    <>
      <TestIncoherence data={filterState} />
      <TableContainer component={Paper} style={{ marginTop: 20, marginBottom: 20 }}>
        <Stack direction="row" spacing={1} padding={1} style={{ width: '100%', justifyContent: 'center' }}>
          <FormControl sx={{ m: 1, p: 0, minWidth: 120 }}>
            <InputLabel id="quart">Quart</InputLabel>
            <Select
              labelId="quart"
              id="quartS"
              open={openSelect}
              onClose={() => setOpenSelect(false)}
              onOpen={() => setOpenSelect(true)}
              value={quart}
              label="Quart"
              onChange={(e) => setQuart(e.target.value)}
            >
              <MenuItem value={'matin'}>Matin</MenuItem>
              <MenuItem value={'midi'}>Aprés midi</MenuItem>
              <MenuItem value={'nuit'}>Nuit</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, p: 1, minWidth: 120 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Choisir le jour"
                inputFormat="dd/MM/yyyy"
                value={day}
                onChange={(newValue) => {
                  setDay(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <LoadingButton style={{ marginTop: 17 }} variant="contained" onClick={serachMachineStatus}>
              Rechercher
            </LoadingButton>
          </FormControl>
        </Stack>

        <Table sx={{ minWidth: 1000 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell width="20%" style={{ ...tableCellStyle }}>
                {' '}
                Cycle/Arret
              </TableCell>
              <TableCell width="70%" sx={{ minWidth: 700 }}>
                <TimeLine
                  bg="green"
                  showTicks={true}
                  selectedInterval={[]}
                  timelineInterval={timelineInterval}
                  handleClick={() => null}
                  disabledIntervals={[]}
                />
              </TableCell>
              <TableCell width="10%" align="center">
                <span style={{ margin: 10, fontSize: 15 }}>Total</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Row for standard cycle  */}
            <TableRow>
              <TableCell width="20%" style={tableCellStyle}>
                Cycle Standard
              </TableCell>
              <TableCell width="70%">
                <TimeLine
                  bg="green"
                  showTicks={false}
                  timelineInterval={timelineInterval}
                  handleClick={() =>
                    handleStatusChange({ pId: 0, cId: 0, causeId: 0, start: new Date(), end: new Date() })
                  }
                  disabledIntervals={getPerteintervals(intervals, 0)}
                />
              </TableCell>
              <TableCell width="10%" align="center" style={{ color: 'rgb(0, 223, 7)' }}>
                {calculateTime(getPerteintervals(intervals, 0))}
              </TableCell>
            </TableRow>

            {/* Rows for the 7 configs  */}
            {ficheSuiveuseConfigs.map((row) => (
              <>
                <TableRow key={row.id}>
                  <TableCell
                    width="20%"
                    sx={{ maxWidth: 200 }}
                    height="15px"
                    style={tableCellStyle}
                    onClick={() => manageOpenedConfigs(row.id)}
                  >
                    {!isExist(openedPertes, row.id) ? (
                      <ArrowForwardIosIcon style={iconStyle} fontSize="small" />
                    ) : (
                      <ArrowForwardIosIcon style={{ ...iconStyle, transform: 'rotate(90deg)' }} fontSize="small" />
                    )}
                    <span> {row.label}</span>
                  </TableCell>

                  <TableCell width="70%" sx={{ minWidth: 700 }}>
                    <TimeLine
                      bg={'red'}
                      showTicks={false}
                      timelineInterval={timelineInterval}
                      handleClick={() => null}
                      disabledIntervals={
                        row.id !== 6
                          ? getPerteintervals(intervals, row.id)
                          : prepareReworkRejectTimeInterval(
                              machineStatusHistory?.rework && machineStatusHistory?.reject
                                ? concatTabs(machineStatusHistory.rework, machineStatusHistory.reject)
                                : [],
                            )
                      }
                    />
                  </TableCell>

                  <TableCell
                    width="10%"
                    align="center"
                    style={{ color: calculateTime(getPerteintervals(intervals, row.id)) === '00:00h' ? '' : 'red' }}
                  >
                    {row.id !== 6
                      ? calculateTime(getPerteintervals(intervals, row.id))
                      : calculateTime(
                          prepareReworkRejectTimeInterval(
                            machineStatusHistory?.rework && machineStatusHistory?.reject
                              ? concatTabs(machineStatusHistory.rework, machineStatusHistory.reject)
                              : [],
                          ),
                        )}
                  </TableCell>
                </TableRow>

                {/* display categories*/}
                {isExist(openedPertes, row.id) &&
                  row.categories.map((category) => (
                    <>
                      <TableRow key={category.id} style={{ background: '#eee', cursor: 'default' }}>
                        <TableCell
                          width="20%"
                          sx={{ maxWidth: 200 }}
                          style={tableCellStyle}
                          onClick={() => setOpenedCategories([...handleOpenConfig(openedCategories, category.id)])}
                        >
                          <span style={{ padding: 13, width: '100%', position: 'relative' }}>
                            {!isExist(openedCategories, category.id) ? (
                              <ArrowForwardIosIcon style={iconStyle} fontSize="small" />
                            ) : (
                              <ArrowForwardIosIcon
                                style={{ ...iconStyle, transform: 'rotate(90deg)' }}
                                fontSize="small"
                              />
                            )}
                            {category.designation}
                          </span>
                        </TableCell>

                        <TableCell width="70%" sx={{ maxWidth: 700 }}>
                          <TimeLine
                            bg="red"
                            showTicks={false}
                            timelineInterval={timelineInterval}
                            handleClick={() => {
                              if (category.causes.length === 0) {
                                handleStatusChange({
                                  pId: row.id,
                                  cId: category.id,
                                  causeId: 0,
                                  start: new Date(),
                                  end: new Date(),
                                });
                              }
                            }}
                            disabledIntervals={
                              row.id !== 6
                                ? getCategoryintervals(intervals, category.id)
                                : category.id === 'rework'
                                ? machineStatusHistory?.rework.length > 0
                                  ? prepareReworkRejectTimeInterval(
                                      machineStatusHistory ? [...machineStatusHistory.rework] : [],
                                    )
                                  : []
                                : machineStatusHistory?.reject.length > 0
                                ? prepareReworkRejectTimeInterval(
                                    machineStatusHistory ? [...machineStatusHistory.reject] : [],
                                  )
                                : []
                            }
                          />
                        </TableCell>

                        <TableCell
                          width="10%"
                          align="center"
                          style={{
                            color:
                              calculateTime(getCategoryintervals(intervals, category.id)) === '00:00h' ? '' : 'red',
                          }}
                        >
                          {row.id !== 6
                            ? calculateTime(getCategoryintervals(intervals, category.id))
                            : calculateTime(
                                prepareReworkRejectTimeInterval(
                                  machineStatusHistory ? [...machineStatusHistory[category.id]] : [],
                                ),
                              )}
                        </TableCell>
                      </TableRow>

                      {/* display causes*/}
                      {isExist(openedCategories, category.id) &&
                        category.causes.map((cause) => (
                          <TableRow
                            key={cause.id}
                            style={{ background: '#C8DADA', cursor: 'default', WebkitUserSelect: 'none' }}
                          >
                            <TableCell width="20%" sx={{ maxWidth: 200 }} style={tableCellStyle}>
                              <span style={{ padding: 38 }}>{cause.designation}</span>
                            </TableCell>

                            <TableCell width="70%" sx={{ maxWidth: 700 }}>
                              <TimeLine
                                bg="red"
                                showTicks={false}
                                timelineInterval={timelineInterval}
                                handleClick={() =>
                                  handleStatusChange({
                                    pId: row.id,
                                    cId: category.id,
                                    causeId: cause.id,
                                    start: new Date(),
                                    end: new Date(),
                                  })
                                }
                                disabledIntervals={getCauseintervals(intervals, cause.id)}
                              />
                            </TableCell>

                            <TableCell
                              width="10%"
                              align="center"
                              style={{
                                color: calculateTime(getCauseintervals(intervals, cause.id)) === '00:00h' ? '' : 'red',
                              }}
                            >
                              {calculateTime(getCauseintervals(intervals, cause.id))}
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  ))}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ height: '400px', width: '100%', background: '#fff' }}>
        {rows && rows.length > 0 ? (
          <DataGrid rows={rows} columns={columns} disableColumnMenu={true} pageSize={10} />
        ) : (
          'Pas de données'
        )}
      </div>
      <Modal open={openEditValue} onClose={closeEdit}>
        <Box sx={style}>
          {value.map((element) => {
            console.log('element', element);
            return <EditOf data={element} close={closeEdit} />;
          })}
        </Box>
      </Modal>
    </>
  );
}
