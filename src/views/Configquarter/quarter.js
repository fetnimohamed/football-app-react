import * as React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import TimePicker from '@mui/lab/TimePicker';
import Avatar from '@mui/material/Avatar';
import DateFNSUtils from '@mui/lab/AdapterDateFns';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import MultipleDatePicker from 'react-multiple-datepicker';
import Switch from '@mui/material/Switch';
import moment from 'moment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';

import MenuItem from '@mui/material/MenuItem';
import DateRangePicker from '@mui/lab/DateRangePicker';
import DataTablequart from './tablequarts';
import DataTablequartspec from './tableQuartSpec';

import useQuartService from '../../services/quart.service';
import useProcessService from '../../services/processTypeService';
import useMachineService from '../../services/machineService';
import useMappingService from '../../services/mappingService';
import LoadingButton from '@mui/lab/LoadingButton';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';

import Button from '@material-ui/core/Button';
import useModelsMachineService from 'services/modelsMachineService';
import { compareAsc } from 'date-fns';
import { ConfigsContext } from 'context/ConfigsContext';

import DatePicker, { DateObject } from 'react-multi-date-picker';

export default function Quarter() {
  const [ouvrable, setouvrable] = useState([]);
  const [nonouvrable, setnonouvrable] = useState([]);
  //check
  const check = () => {
    alert(ouvrable);
  };

  const [ProcessTypeList, setProcessTypeList] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [Range, setRange] = React.useState([null, null]);

  const [quartSpecdata, setquartSpecdata] = useState({
    designation: '',
    date_quart: Range,
    date_fin_quart: '',
    quart_debut: '',
    quart_fin: '',
    Process_type_id: '',
    Machines: [[], [], [], []],
    lignes: '',
    Famille: '',
    details_quarter: {
      debut_matin: new Date(),
      fin_matin: new Date(),
      debut_midi: new Date(),
      fin_midi: new Date(),
      debut_nuit: new Date(),
      fin_nuit: new Date(),
      debut_q4: new Date(),
      fin_q4: new Date(),
      activation_matin: false,
      activation_midi: false,
      activation_nuit: false,
      activation_q4: false,
    },
    jours_ouvrable: [],
    jours_non_ouvrable: [],
    createDate: '',
    createDatesystem: '',
    updateDate: '',
  });
  const [quartdata, setquartdata] = useState({
    designation: '',
    debut_quart: '',
    Process_type_id: '',
    details_quarter: {
      debut_matin: new Date(),
      fin_matin: new Date(),
      debut_midi: new Date(),
      fin_midi: new Date(),
      debut_nuit: new Date(),
      fin_nuit: new Date(),
      debut_q4: new Date(),
      fin_q4: new Date(),
    },
    detail_semaine: {
      l: { q1: false, q2: false, q3: false, q4: false, machines: [[], [], [], []] },
      m: { q1: false, q2: false, q3: false, q4: false, machines: [[], [], [], []] },
      me: { q1: false, q2: false, q3: false, q4: false, machines: [[], [], [], []] },
      j: { q1: false, q2: false, q3: false, q4: false, machines: [[], [], [], []] },
      v: { q1: false, q2: false, q3: false, q4: false, machines: [[], [], [], []] },
      s: { q1: false, q2: false, q3: false, q4: false, machines: [[], [], [], []] },
      d: { q1: false, q2: false, q3: false, q4: false, machines: [[], [], [], []] },
    },
    createDate: new Date(),
    createDatesystem: '',
    updateDate: '',
  });

  //ov machines
  const [qrts, setQrts] = useState([]);
  const [specQ, setSpecQ] = useState([]);
  const [pType, setPType] = useState();
  const [name, setName] = useState('');
  const [oldData, setOldData] = useState([]);

  const { addquart, addquartspec, compare_dates, getallquarts, getallquartsspec, editquartspec } = useQuartService();
  const { getAllProcessTypes } = useProcessService();
  const { getAllMachines } = useMachineService();
  const { getAllMapping } = useMappingService();
  const { editOVMachines, editOVMachinesSpec } = useModelsMachineService();

  useEffect(async () => {
    const res = await getAllProcessTypes();
    setProcessTypeList(res);

    const res1 = await getallquarts();
    if (res1.models) {
      setQrts(res1.models);
    }

    const res2 = await getallquartsspec();
    console.log(res2);
    if (res2.models) {
      setSpecQ([...res2.models]);
      setOldData([...res2.models]);
      console.log(specQ);
    }
  }, []);

  const editData = async (data) => {
    await editOVMachines(data);
  };

  const editData2 = async (data) => {
    await editquartspec(data);
  };
  const [OpenOuvrable, setOpenOuvrable] = React.useState(false);
  const [test, setTest] = React.useState(false);

  const [value, setValue] = React.useState('1');

  const [datedebut, setdatedebut] = React.useState(new Date());
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const compareDates = async (dates) => {
    if (Range[0] == null || Range[1] == null) {
      toast.info('veuillez inserer  la période du quart quart');
    } else {
      const res = await compare_dates(dates);
      if (res.data.message == 1) {
        setTest(!test);
        toast.success('période validée');
      } else {
        toast.error('chevauchement avec ' + res.data.message);
      }
    }
  };

  /**
   *
   * @param {moment} date
   * @returns {{ hours: number, minutes: number, prefix: 'AM' | 'PM' }}
   */

  function formatTimeStruct(date) {
    const [digits, prefix] = moment(date).format('LT').split(' ');
    const [hour, minute] = digits.split(':');
    return {
      prefix,
      hours: parseInt(hour),
      minutes: parseInt(minute),
    };
  }

  /**
   * @param {moment} date1
   * @param {moment} date2
   * @returns {'='| '<' | '>'}
   */
  function CompareTimeStruct(date1, date2) {
    const time1 = formatTimeStruct(date1),
      time2 = formatTimeStruct(date2);
    const hoursR = time1.hours < time2.hours ? '<' : time1.hours > time2.hours ? '>' : '=';
    const minutesR = time1.minutes < time2.minutes ? '<' : time1.minutes > time2.minutes ? '>' : '=';
    const prefixR = time1.prefix === time2.prefix ? '=' : time1.prefix === 'AM' && time2.prefix === 'PM' ? '<' : '>';
    return prefixR !== '=' ? prefixR : hoursR !== '=' ? hoursR : minutesR;
  }

  function initShiftValidator() {
    const errors = [];
    const ctrl = {
      errors,
      validateShiftIntegrity: (shift, time1, condition, time2) =>
        CompareTimeStruct(time1, time2) !== condition &&
        errors.push(`L'heure de début doit être inférieur du l'heure du fin pour "${shift}"`),
      assertTime: (shift, label, time) =>
        (!time || time == '') && errors.push(`veuillez inserer l'heure du ${label} de ${shift}`),
      validateShiftsConflict: ([shift1, label1, time1], [shift2, label2, time2]) =>
        CompareTimeStruct(time1, time2) === '>' &&
        errors.push(`L'heure du ${label1} de ${shift1} doit être < ou = de l'heure du ${label2} de ${shift2}`),
      checkShift: (shift) => {
        const a = ctrl.assertTime(shift, 'début', quartdata.details_quarter[`debut_${shift}`]);
        const b = ctrl.assertTime(shift, 'fin', quartdata.details_quarter[`fin_${shift}`]);
        return (
          !a &&
          !b &&
          ctrl.validateShiftIntegrity(
            shift,
            quartdata.details_quarter[`debut_${shift}`],
            '<',
            quartdata.details_quarter[`fin_${shift}`],
          )
        );
      },
      displayErrors: () => ctrl.errors.forEach((er) => toast.info(er)),
    };
    return ctrl;
  }
  function initShiftValidatorspec() {
    const errors = [];
    const ctrl = {
      errors,
      validateShiftIntegrity: (shift, time1, condition, time2) =>
        CompareTimeStruct(time1, time2) !== condition &&
        errors.push(`L'heure de début doit être inférieur du l'heure du fin pour "${shift}"`),
      assertTime: (shift, label, time) =>
        (!time || time == '') && errors.push(`veuillez inserer l'heure du ${label} de ${shift}`),
      validateShiftsConflict: ([shift1, label1, time1], [shift2, label2, time2]) =>
        CompareTimeStruct(time1, time2) === '>' &&
        errors.push(`L'heure du ${label1} de ${shift1} doit être < ou = de l'heure du ${label2} de ${shift2}`),
      checkShift: (shift) => {
        const a = ctrl.assertTime(shift, 'début', quartSpecdata.details_quarter[`debut_${shift}`]);
        const b = ctrl.assertTime(shift, 'fin', quartSpecdata.details_quarter[`fin_${shift}`]);
        return (
          !a &&
          !b &&
          ctrl.validateShiftIntegrity(
            shift,
            quartSpecdata.details_quarter[`debut_${shift}`],
            '<',
            quartSpecdata.details_quarter[`fin_${shift}`],
          )
        );
      },
      displayErrors: () => ctrl.errors.forEach((er) => toast.info(er)),
    };
    return ctrl;
  }
  const savedata = async () => {
    const shiftValidator = initShiftValidator();
    quartdata.Process_type_id == '' && shiftValidator.errors.push('veuillez inserer le type de process');
    quartdata.debut_quart == '' && shiftValidator.errors.push('veuillez inserer le début de quart');
    quartdata.createDate == '' && shiftValidator.errors.push('veuillez inserer la date intitial');
    if (shiftValidator.errors.length) {
      shiftValidator.displayErrors();
      return;
    }
    shiftValidator.checkShift('matin');
    shiftValidator.checkShift('midi');
    //shiftValidator.checkShift('nuit');
    if (shiftValidator.errors.length) {
      shiftValidator.displayErrors();
      return;
    }
    /*  shiftValidator.validateShiftsConflict(
      ['matin', 'fin', quartdata.details_quarter.fin_matin],
      ['midi', 'debut', quartdata.details_quarter.debut_midi],
    );
    shiftValidator.validateShiftsConflict(
      ['midi', 'fin', quartdata.details_quarter.fin_midi],
      ['nuit', 'debut', quartdata.details_quarter.debut_nuit],
    );
    shiftValidator.validateShiftsConflict(
      ['nuit', 'fin', quartdata.details_quarter.fin_nuit],
      ['matin', 'debut', quartdata.details_quarter.debut_matin],
    ); */
    //shiftValidator.validateShiftsConflict(['matin', 'debut', quartdata.details_quarter.debut_matin], ['nuit', 'fin', quartdata.details_quarter.fin_nuit]);
    if (shiftValidator.errors.length) {
      shiftValidator.displayErrors();
      return;
    }
    const data = await addquart(quartdata);
    if (data.status == 400) {
      toast.error('erreur d insertion ');
    } else {
      console.log(data.status);
      toast.success('période  ajoutée avec succes ');
      window.location.reload(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangedebutmatin = (newValue) => {
    setquartdata({ ...quartdata, details_quarter: { ...quartdata.details_quarter, debut_matin: newValue } });
  };
  const handleChangefinmatin = (newValue) => {
    setquartdata({ ...quartdata, details_quarter: { ...quartdata.details_quarter, fin_matin: newValue } });
  };
  const handleChangedebutmidi = (newValue) => {
    setquartdata({ ...quartdata, details_quarter: { ...quartdata.details_quarter, debut_midi: newValue } });
  };
  const handleChangefinmidi = (newValue) => {
    setquartdata({ ...quartdata, details_quarter: { ...quartdata.details_quarter, fin_midi: newValue } });
  };
  const handleChangedebutnuit = (newValue) => {
    setquartdata({ ...quartdata, details_quarter: { ...quartdata.details_quarter, debut_nuit: newValue } });
  };
  const handleChangefinnuit = (newValue) => {
    setquartdata({ ...quartdata, details_quarter: { ...quartdata.details_quarter, fin_nuit: newValue } });
  };
  const handleChangedebutq4 = (newValue) => {
    setquartdata({ ...quartdata, details_quarter: { ...quartdata.details_quarter, debut_q4: newValue } });
  };
  const handleChangefinq4 = (newValue) => {
    setquartdata({ ...quartdata, details_quarter: { ...quartdata.details_quarter, fin_q4: newValue } });
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeprosess = (event) => {
    setquartdata({ ...quartdata, ['Process_type_id']: event.target.value });
    console.log(quartdata);
  };
  const handleChangedate = (newValue) => {
    setquartdata({ ...quartdata, ['createDate']: newValue });
  };
  const handleChangequart = (event) => {
    setquartdata({ ...quartdata, ['debut_quart']: event.target.value });
  };
  ////////handle changes specific
  const spechandleChangeligne = (newValue) => {
    setquartSpecdata({ ...quartSpecdata, ['lignes']: newValue });
  };
  const spechandleChangefamille = (newValue) => {
    setquartSpecdata({ ...quartSpecdata, ['Famille']: newValue });
  };
  const spechandleChangemachines = (newValue) => {
    setquartSpecdata({ ...quartSpecdata, ['Machines']: newValue });
  };
  const spechandleChangequartdeut = (event) => {
    setquartSpecdata({ ...quartSpecdata, ['quart_debut']: event.target.value });
  };
  const spechandleChangequartfin = (event) => {
    setquartSpecdata({ ...quartSpecdata, ['quart_fin']: event.target.value });
  };
  const spechandleChangedesignation = (e) => {
    setquartSpecdata({ ...quartSpecdata, ['designation']: e.target.value });
  };
  const spechandleChangeprosess = (event) => {
    setquartSpecdata({ ...quartSpecdata, ['Process_type_id']: event.target.value });
  };
  const spechandleChangedebutmatin = (newValue) => {
    setquartSpecdata({
      ...quartSpecdata,
      details_quarter: { ...quartSpecdata.details_quarter, debut_matin: newValue },
    });
  };
  const spechandleChangefinmatin = (newValue) => {
    setquartSpecdata({ ...quartSpecdata, details_quarter: { ...quartSpecdata.details_quarter, fin_matin: newValue } });
  };
  const spechandleChangedebutmidi = (newValue) => {
    setquartSpecdata({ ...quartSpecdata, details_quarter: { ...quartSpecdata.details_quarter, debut_midi: newValue } });
  };
  const spechandleChangefinmidi = (newValue) => {
    setquartSpecdata({ ...quartSpecdata, details_quarter: { ...quartSpecdata.details_quarter, fin_midi: newValue } });
  };
  const spechandleChangedebutnuit = (newValue) => {
    setquartSpecdata({ ...quartSpecdata, details_quarter: { ...quartSpecdata.details_quarter, debut_nuit: newValue } });
  };
  const spechandleChangefinnuit = (newValue) => {
    setquartSpecdata({ ...quartSpecdata, details_quarter: { ...quartSpecdata.details_quarter, fin_nuit: newValue } });
  };
  const spechandleChangedebutq4 = (newValue) => {
    setquartSpecdata({ ...quartSpecdata, details_quarter: { ...quartSpecdata.details_quarter, debut_q4: newValue } });
  };
  const spechandleChangefinq4 = (newValue) => {
    setquartSpecdata({ ...quartSpecdata, details_quarter: { ...quartSpecdata.details_quarter, fin_q4: newValue } });
  };
  const add_dates = () => {
    const o = [];
    const n = [];
    nonouvrable.map((x) => {
      n.push(String(x));
    });
    ouvrable.map((x) => {
      o.push(String(x));
    });
    quartSpecdata.jours_ouvrable = o;
    quartSpecdata.jours_non_ouvrable = n;
    setquartSpecdata({ ...quartSpecdata });
  };
  const savedataspec = async () => {
    add_dates();
    const shiftValidator = initShiftValidatorspec();

    quartSpecdata.designation == '' &&
      shiftValidator.errors.push('veuillez inserer la désignation sous 10 caractérers');
    quartSpecdata.Process_type_id == '' && shiftValidator.errors.push('veuillez inserer le type de process');
    //else if (quartSpecdata.Machines.length==0){toast.info('veuillez inserer les machines') }
    //quartSpecdata.lignes.length == 0 && shiftValidator.errors.push('veuillez inserer les lignes')
    //quartSpecdata.Famille.length == 0 && shiftValidator.errors.push('veuillez inserer la famille')

    quartSpecdata.quart_debut == '' && shiftValidator.errors.push('veuillez inserer quart intitial');
    quartSpecdata.quart_fin == '' && shiftValidator.errors.push('veuillez inserer  quart final');
    if (Range[0] == null || Range[1] == null) {
      toast.info('veuillez inserer  la période du quart quart');
    }

    if (shiftValidator.errors.length) {
      shiftValidator.displayErrors();
      return;
    }
    shiftValidator.checkShift('matin');
    shiftValidator.checkShift('midi');
    //shiftValidator.checkShift('nuit');
    //shiftValidator.checkShift('q4');

    if (shiftValidator.errors.length) {
      shiftValidator.displayErrors();
      return;
    }
    /*     shiftValidator.validateShiftsConflict(
      ['matin', 'fin', quartSpecdata.details_quarter.fin_matin],
      ['midi', 'debut', quartSpecdata.details_quarter.debut_midi],
    );
    shiftValidator.validateShiftsConflict(
      ['midi', 'fin', quartSpecdata.details_quarter.fin_midi],
      ['nuit', 'debut', quartSpecdata.details_quarter.debut_nuit],
    );
    shiftValidator.validateShiftsConflict(
      ['nuit', 'fin', quartSpecdata.details_quarter.fin_nuit],
      ['matin', 'debut', quartSpecdata.details_quarter.debut_matin],
    ); */
    //shiftValidator.validateShiftsConflict(['matin', 'debut', quartSpecdata.details_quarter.debut_matin], ['nuit', 'fin', quartSpecdata.details_quarter.fin_nuit]);
    if (shiftValidator.errors.length) {
      shiftValidator.displayErrors();
      return;
    }
    if (test) {
      const data = await addquartspec(quartSpecdata);
      if (data.status == 400) {
        toast.error('erreur d insertion ');
      } else {
        console.log(data.status);
        toast.success('période ajoutée avec succes');
        window.location.reload(false);
      }
    } else {
      toast.info('Merci de tester la période ');
    }
  };
  return (
    <Card>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="période Standard" value="1" />
              <Tab label="Période Spécifique" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Grid container spacing={5}>
              <Grid item xs={6}>
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <InputLabel id="demo-simple-select-helper-label">Type de prosess</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={quartdata.Process_type_id}
                    label="Age"
                    onChange={handleChangeprosess}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {ProcessTypeList.map((prosess) => (
                      <MenuItem value={prosess.id}>{prosess.designation}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Ajouter le type de process</FormHelperText>
                </FormControl>

                <FormControl sx={{ m: 1, maxWidth: 130 }}>
                  <LocalizationProvider dateAdapter={DateFNSUtils}>
                    <Stack spacing={3}>
                      <DesktopDatePicker
                        label="A partir "
                        inputFormat="dd/MM/yyyy"
                        value={quartdata.createDate}
                        onChange={handleChangedate}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Stack>
                  </LocalizationProvider>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <InputLabel id="demo-simple-select-helper-label">quart de début</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    label="quart de début"
                    onChange={handleChangequart}
                  >
                    <MenuItem value={'matin'}>matin</MenuItem>
                    <MenuItem value={'midi'}> Aprés midi</MenuItem>
                    <MenuItem value={'nuit'}>nuit</MenuItem>
                  </Select>
                  <FormHelperText>Ajouter le quart de début</FormHelperText>
                </FormControl>
                <Stack direction="column" spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <LocalizationProvider dateAdapter={DateFNSUtils}>
                      <TimePicker
                        label=" horaire Début Matin "
                        onChange={handleChangedebutmatin}
                        value={quartdata.details_quarter.debut_matin}
                        renderInput={(params) => <TextField {...params} />}
                      />

                      <TimePicker
                        label="horaire fin matin "
                        value={quartdata.details_quarter.fin_matin}
                        onChange={handleChangefinmatin}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <LocalizationProvider dateAdapter={DateFNSUtils}>
                      <TimePicker
                        label="horaire Début Aprés midi"
                        value={quartdata.details_quarter.debut_midi}
                        onChange={handleChangedebutmidi}
                        renderInput={(params) => <TextField {...params} />}
                      />

                      <TimePicker
                        label="horaire fin  Aprés midi"
                        value={quartdata.details_quarter.fin_midi}
                        onChange={handleChangefinmidi}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <LocalizationProvider dateAdapter={DateFNSUtils}>
                      <TimePicker
                        label="horaire Début Nuit"
                        value={quartdata.details_quarter.debut_nuit}
                        onChange={handleChangedebutnuit}
                        renderInput={(params) => <TextField {...params} />}
                      />

                      <TimePicker
                        label=" horaire fin  Nuit"
                        value={quartdata.details_quarter.fin_nuit}
                        onChange={handleChangefinnuit}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <LocalizationProvider dateAdapter={DateFNSUtils}>
                      <TimePicker
                        label="horaire Début 4 éme quart"
                        value={quartdata.details_quarter.debut_q4}
                        onChange={handleChangedebutq4}
                        renderInput={(params) => <TextField {...params} />}
                      />

                      <TimePicker
                        label=" horaire fin 4 éme quart"
                        value={quartdata.details_quarter.fin_q4}
                        onChange={handleChangefinq4}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Stack>
                <Stack style={{ margin: 5 }}></Stack>
                <div style={{ 'margin-top': 60 }}>
                  <Stack direction="row" spacing={1}>
                    <div className="lundi">
                      <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>L</Avatar>
                      <Stack direction="column" spacing={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.l.q1}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    l: { ...quartdata.detail_semaine.l, q1: !quartdata.detail_semaine.l.q1 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Matin"
                          style={{ marginLeft: 0 }}
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.l.q2}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    l: { ...quartdata.detail_semaine.l, q2: !quartdata.detail_semaine.l.q2 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Aprés midi"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.l.q3}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    l: { ...quartdata.detail_semaine.l, q3: !quartdata.detail_semaine.l.q3 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Nuit"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.l.q4}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    l: { ...quartdata.detail_semaine.l, q4: !quartdata.detail_semaine.l.q4 },
                                  },
                                });
                              }}
                            />
                          }
                          label="4 eme quart"
                        />
                      </Stack>
                    </div>
                    <div className="Mardi">
                      <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>M</Avatar>
                      <Stack direction="column" spacing={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.m.q1}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    m: { ...quartdata.detail_semaine.m, q1: !quartdata.detail_semaine.m.q1 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Matin"
                          style={{ marginLeft: 0 }}
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.m.q2}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    m: { ...quartdata.detail_semaine.m, q2: !quartdata.detail_semaine.m.q2 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Aprés midi"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.m.q3}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    m: { ...quartdata.detail_semaine.m, q3: !quartdata.detail_semaine.m.q3 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Nuit"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.m.q4}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    m: { ...quartdata.detail_semaine.m, q4: !quartdata.detail_semaine.m.q4 },
                                  },
                                });
                              }}
                            />
                          }
                          label="4 eme quart"
                        />
                      </Stack>
                    </div>
                    <div className="mercredi">
                      <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>Me</Avatar>
                      <Stack direction="column" spacing={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.me.q1}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    me: { ...quartdata.detail_semaine.me, q1: !quartdata.detail_semaine.me.q1 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Matin"
                          style={{ marginLeft: 0 }}
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.me.q2}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    me: { ...quartdata.detail_semaine.me, q2: !quartdata.detail_semaine.me.q2 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Aprés midi"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.me.q3}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    me: { ...quartdata.detail_semaine.me, q3: !quartdata.detail_semaine.me.q3 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Nuit"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.me.q4}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    me: { ...quartdata.detail_semaine.me, q4: !quartdata.detail_semaine.me.q4 },
                                  },
                                });
                              }}
                            />
                          }
                          label="4 eme quart"
                        />
                      </Stack>
                    </div>
                    <div className="jeudi">
                      <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>J</Avatar>
                      <Stack direction="column" spacing={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.j.q1}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    j: { ...quartdata.detail_semaine.j, q1: !quartdata.detail_semaine.j.q1 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Matin"
                          style={{ marginLeft: 0 }}
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.j.q2}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    j: { ...quartdata.detail_semaine.j, q2: !quartdata.detail_semaine.j.q2 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Aprés midi"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.j.q3}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    j: { ...quartdata.detail_semaine.j, q3: !quartdata.detail_semaine.j.q3 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Nuit"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.j.q4}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    j: { ...quartdata.detail_semaine.j, q4: !quartdata.detail_semaine.j.q4 },
                                  },
                                });
                              }}
                            />
                          }
                          label="4 eme quart"
                        />
                      </Stack>
                    </div>
                    <div className="vendredi">
                      <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>V</Avatar>
                      <Stack direction="column" spacing={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.v.q1}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    v: { ...quartdata.detail_semaine.v, q1: !quartdata.detail_semaine.v.q1 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Matin"
                          style={{ marginLeft: 0 }}
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.v.q2}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    v: { ...quartdata.detail_semaine.v, q2: !quartdata.detail_semaine.v.q2 },
                                  },
                                });
                              }}
                            />
                          }
                          label="MiAprés mididi"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.v.q3}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    v: { ...quartdata.detail_semaine.v, q3: !quartdata.detail_semaine.v.q3 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Nuit"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.v.q4}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    v: { ...quartdata.detail_semaine.v, q4: !quartdata.detail_semaine.v.q4 },
                                  },
                                });
                              }}
                            />
                          }
                          label="4 eme quart"
                        />
                      </Stack>
                    </div>
                    <div className="samedi">
                      <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>S</Avatar>
                      <Stack direction="column" spacing={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.s.q1}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    s: { ...quartdata.detail_semaine.s, q1: !quartdata.detail_semaine.s.q1 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Matin"
                          style={{ marginLeft: 0 }}
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.s.q2}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    s: { ...quartdata.detail_semaine.s, q2: !quartdata.detail_semaine.s.q2 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Aprés midi"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.s.q3}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    s: { ...quartdata.detail_semaine.s, q3: !quartdata.detail_semaine.s.q3 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Nuit"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.s.q4}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    s: { ...quartdata.detail_semaine.s, q4: !quartdata.detail_semaine.s.q4 },
                                  },
                                });
                              }}
                            />
                          }
                          label="4 eme quart"
                        />
                      </Stack>
                    </div>
                    <div className="dimanche">
                      <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>D</Avatar>
                      <Stack direction="column" spacing={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.d.q1}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    d: { ...quartdata.detail_semaine.d, q1: !quartdata.detail_semaine.d.q1 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Matin"
                          style={{ marginLeft: 0 }}
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.d.q2}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    d: { ...quartdata.detail_semaine.d, q2: !quartdata.detail_semaine.d.q2 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Aprés midi"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.d.q3}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    d: { ...quartdata.detail_semaine.d, q3: !quartdata.detail_semaine.d.q3 },
                                  },
                                });
                              }}
                            />
                          }
                          label="Nuit"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={quartdata.detail_semaine.d.q4}
                              onChange={() => {
                                setquartdata({
                                  ...quartdata,
                                  detail_semaine: {
                                    ...quartdata.detail_semaine,
                                    d: { ...quartdata.detail_semaine.d, q4: !quartdata.detail_semaine.d.q4 },
                                  },
                                });
                              }}
                            />
                          }
                          label="4 eme quart"
                        />
                      </Stack>
                    </div>
                  </Stack>
                </div>
              </Grid>

              <Grid item xs={6}>
                <DataTablequart />
              </Grid>
              <Button variant="contained" color="primary" style={{ margin: 30 }} onClick={() => savedata(true)}>
                Ajouter une Configuration Standard
              </Button>
            </Grid>
          </TabPanel>
          <TabPanel value="2">
            <Grid container spacing={5}>
              <Grid item xs={6}>
                <Stack direction="column">
                  <Stack direction="row">
                    <TextField id="outlined-uncontrolled" label="Désignation" onChange={spechandleChangedesignation} />
                  </Stack>
                  <Stack style={{ margin: 5 }}></Stack>

                  <Stack direction="row">
                    <FormControl sx={{ m: 1, minWidth: 100 }}>
                      <InputLabel id="demo-simple-select-helper-label">Type de prosess</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={quartSpecdata.Process_type_id}
                        label="Age"
                        onChange={spechandleChangeprosess}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {ProcessTypeList.map((prosess) => (
                          <MenuItem value={prosess.id}>{prosess.designation}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>Ajouter process</FormHelperText>
                    </FormControl>
                  </Stack>
                  <Stack direction="row">
                    <FormControl sx={{ m: 1, minWidth: 100 }}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateRangePicker
                          startText="Date début"
                          endText="Date fin"
                          value={Range}
                          inputFormat="dd/MM/yyyy"
                          onChange={(newValue) => {
                            setRange(newValue);
                            setquartSpecdata({ ...quartSpecdata, ['date_quart']: newValue });
                            setTest(false);
                          }}
                          renderInput={(startProps, endProps) => (
                            <React.Fragment>
                              <TextField {...startProps} />
                              <Box sx={{ mx: 2 }}> to </Box>
                              <TextField {...endProps} />
                            </React.Fragment>
                          )}
                        />
                      </LocalizationProvider>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 100 }}>
                      <LoadingButton
                        //onClick={handleClick}
                        loading={loading}
                        variant="outlined"
                        loadingIndicator="en cours..."
                        onClick={() => {
                          compareDates(Range);
                        }}
                        //disabled
                      >
                        Test de chevauchement
                      </LoadingButton>
                    </FormControl>
                  </Stack>
                  <Stack direction="row">
                    <FormControl sx={{ m: 5, minWidth: 100 }}>
                      <InputLabel id="demo-simple-select-helper-label">quart de début</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="quart de début"
                        onChange={spechandleChangequartdeut}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={'matin'}>matin</MenuItem>
                        <MenuItem value={'midi'}>Aprés midi</MenuItem>
                        <MenuItem value={'nuit'}>nuit</MenuItem>
                        <MenuItem value={'q4'}>4eme quart</MenuItem>
                      </Select>
                      <FormHelperText>Ajouter le quart de début</FormHelperText>
                    </FormControl>
                    <FormControl sx={{ m: 5, minWidth: 100 }}>
                      <InputLabel id="demo-simple-select-helper-label">quart de fin</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="quart de fin"
                        onChange={spechandleChangequartfin}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={'matin'}>matin</MenuItem>
                        <MenuItem value={'midi'}>Aprés midi</MenuItem>
                        <MenuItem value={'nuit'}>nuit</MenuItem>
                        <MenuItem value={'q4'}>4eme quart</MenuItem>
                      </Select>
                      <FormHelperText>Ajouter quart de fin</FormHelperText>
                    </FormControl>
                  </Stack>
                  <Stack direction="row">
                    <div class="ouvrable">
                      <Button onClick={() => setOpenOuvrable(!OpenOuvrable)}>choisir les jours ouvrables</Button>
                      <DatePicker
                        minDate={Range[0]}
                        maxDate={Range[1]}
                        multiple
                        value={ouvrable}
                        onChange={setouvrable}
                      />
                    </div>
                    <div class="Non-ouvrable">
                      <Button onClick={() => setOpenOuvrable(!OpenOuvrable)}>choisir les jours Non ouvrables</Button>
                      <DatePicker
                        minDate={Range[0]}
                        maxDate={Range[1]}
                        multiple
                        value={nonouvrable}
                        onChange={setnonouvrable}
                        mapDays={({ date }) => {
                          let props = {};
                          ouvrable?.map((x) => {
                            console.log(String(x));
                            if (String(x).includes(date)) props.hidden = true;
                          });

                          return props;
                        }}
                      />
                    </div>
                  </Stack>
                  <Stack style={{ margin: 15 }}></Stack>

                  <Stack style={{ margin: 15 }}></Stack>
                  <Stack direction="column" spacing={2}>
                    <Stack direction="row" spacing={2}>
                      <LocalizationProvider dateAdapter={DateFNSUtils}>
                        <TimePicker
                          label="horaire Début Matin "
                          value={quartSpecdata.details_quarter.debut_matin}
                          onChange={spechandleChangedebutmatin}
                          renderInput={(params) => <TextField {...params} />}
                        />

                        <TimePicker
                          label="horaire fin matin "
                          value={quartSpecdata.details_quarter.fin_matin}
                          onChange={spechandleChangefinmatin}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                      <Switch
                        checked={quartSpecdata.details_quarter.activation_matin}
                        onChange={() => {
                          setquartSpecdata({
                            ...quartSpecdata,
                            details_quarter: {
                              ...quartSpecdata.details_quarter,
                              activation_matin: !quartSpecdata.details_quarter.activation_matin,
                            },
                          });
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <LocalizationProvider dateAdapter={DateFNSUtils}>
                        <TimePicker
                          label="horaire Début Aprés midi"
                          value={quartSpecdata.details_quarter.debut_midi}
                          onChange={spechandleChangedebutmidi}
                          renderInput={(params) => <TextField {...params} />}
                        />

                        <TimePicker
                          label="horaire fin Aprés midi"
                          value={quartSpecdata.details_quarter.fin_midi}
                          onChange={spechandleChangefinmidi}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                      <Switch
                        checked={quartSpecdata.details_quarter.activation_midi}
                        onChange={() => {
                          setquartSpecdata({
                            ...quartSpecdata,
                            details_quarter: {
                              ...quartSpecdata.details_quarter,
                              activation_midi: !quartSpecdata.details_quarter.activation_midi,
                            },
                          });
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <LocalizationProvider dateAdapter={DateFNSUtils}>
                        <TimePicker
                          label="horaire Début Nuit"
                          value={quartSpecdata.details_quarter.debut_nuit}
                          onChange={spechandleChangedebutnuit}
                          renderInput={(params) => <TextField {...params} />}
                        />

                        <TimePicker
                          label=" horaire fin Nuit"
                          value={quartSpecdata.details_quarter.fin_nuit}
                          onChange={spechandleChangefinnuit}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                      <Switch
                        checked={quartSpecdata.details_quarter.activation_nuit}
                        onChange={() => {
                          setquartSpecdata({
                            ...quartSpecdata,
                            details_quarter: {
                              ...quartSpecdata.details_quarter,
                              activation_nuit: !quartSpecdata.details_quarter.activation_nuit,
                            },
                          });
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <LocalizationProvider dateAdapter={DateFNSUtils}>
                        <TimePicker
                          label="horaire Début 4 éme quart"
                          value={quartSpecdata.details_quarter.debut_q4}
                          onChange={spechandleChangedebutq4}
                          renderInput={(params) => <TextField {...params} />}
                        />

                        <TimePicker
                          label="horaire fin 4 éme quart"
                          value={quartSpecdata.details_quarter.fin_q4}
                          onChange={spechandleChangefinq4}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                      <Switch
                        checked={quartSpecdata.details_quarter.activation_q4}
                        onChange={() => {
                          setquartSpecdata({
                            ...quartSpecdata,
                            details_quarter: {
                              ...quartSpecdata.details_quarter,
                              activation_q4: !quartSpecdata.details_quarter.activation_q4,
                            },
                          });
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                  </Stack>
                </Stack>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: 10, float: 'right' }}
                  onClick={() => savedataspec()}
                >
                  Ajouter une nouvelle Configuration Spécifique
                </Button>
                <Stack style={{ margin: 5 }}></Stack>
              </Grid>

              <Grid item xs={6}>
                <DataTablequartspec />
              </Grid>
            </Grid>
          </TabPanel>
        </TabContext>
      </Box>
    </Card>
  );
}
