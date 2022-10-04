import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import useQuartService from '../../services/quart.service';
import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '../../ui-component/modal/modal';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import moment from 'moment';
import Avatar from '@mui/material/Avatar';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import EditModal from '../../ui-component/modal/modal';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import TimePicker from '@mui/lab/TimePicker';
import DateFNSUtils from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import useProcessService from '../../services/processTypeService';
import Button from '@material-ui/core/Button';
import { toast } from 'react-toastify';
import Switch from '@mui/material/Switch';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateRangePicker from '@mui/lab/DateRangePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import MultipleDatePicker from 'react-multiple-datepicker';
import DatePicker, { DateObject } from 'react-multi-date-picker';

export default function DataTablequartspec() {
  const { getAllProcessTypes } = useProcessService();
  const { editquartspec, compare_dates } = useQuartService();
  const [Range, setRange] = React.useState([null, null]);
  const [test, setTest] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [ouvrable, setouvrable] = useState([]);
  const [nonouvrable, setnonouvrable] = useState([]);

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
  const spechandleChangeprosess = (event) => {
    setData({ ...data, Process_type_id: event.target.value });
  };
  const spechandleChangemachines = (event) => {
    setData({ ...data, Machines: event.target.value });
  };
  const spechandleChangeligne = (event) => {
    setData({ ...data, lignes: event.target.value });
  };
  const spechandleChangefamille = (event) => {
    setData({ ...data, Famille: event.target.value });
  };
  //check dates
  const spechandleChangequartdeut = (event) => {
    setData({ ...data, quart_debut: event.target.value });
  };
  const spechandleChangequartfin = (event) => {
    setData({ ...data, quart_fin: event.target.value });
  };
  const spechandleChangedebutmatin = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, debut_matin: newValue } });
  };
  const spechandleChangefinmatin = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, fin_matin: newValue } });
  };
  const spechandleChangedebutmidi = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, debut_midi: newValue } });
  };
  const spechandleChangefinmidi = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, fin_midi: newValue } });
  };
  const spechandleChangedebutnuit = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, debut_nuit: newValue } });
  };
  const spechandleChangefinnuit = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, fin_nuit: newValue } });
  };
  const spechandleChangedebutq4 = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, debut_q4: newValue } });
  };
  const spechandleChangefinq4 = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, fin_q4: newValue } });
  };
  const columns = [
    { field: 'designation', headerName: 'désignation', width: 200 },
    {
      field: 'createDatesystem',
      headerName: 'date  de création ',
      width: 130,
      renderCell: (params) => (
        <div>
          <Chip label={moment(params.row.createDatesystem).format('L')} color="success" variant="outlined" />
        </div>
      ),
    },
    {
      field: 'updateDate',
      headerName: 'date  de modif ',
      width: 130,
      renderCell: (params) => (
        <div>
          <Chip label={moment(params.row.updateDate).format('L')} color="success" variant="outlined" />
        </div>
      ),
    },

    {
      field: 'Action',
      headerName: '',
      width: 130,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            onClick={() => {
              setOpenModal(true);
              setData(params.row);
            }}
          >
            <RemoveRedEyeIcon />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            onClick={() => {
              setopenEditModal(true);
              setData(params.row);
            }}
          >
            <EditIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const { getallquarts, getallquartsspec } = useQuartService();
  const [quarts, setquarts] = useState([]);
  const [ProcessTypeList, setProcessTypeList] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState(null);
  const [quartdata, setquartdata] = useState({
    designation: '',
    debut_quart: '',
    Process_type_id: '',
    details_quarter: {
      debut_matin: '',
      fin_matin: '',
      debut_midi: '',
      fin_midi: '',
      debut_nuit: '',
      fin_nuit: '',
    },
    detail_semaine: {
      l: { q1: false, q2: false, q3: false, q4: false },
      m: { q1: false, q2: false, q3: false, q4: false },
      me: { q1: false, q2: false, q3: false, q4: false },
      j: { q1: false, q2: false, q3: false, q4: false },
      v: { q1: false, q2: false, q3: false, q4: false },
      s: { q1: false, q2: false, q3: false, q4: false },
      d: { q1: false, q2: false, q3: false, q4: false },
    },
    createDate: '',
    createDatesystem: '',
    updateDate: '',
  });

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
        const a = ctrl.assertTime(shift, 'début', data.details_quarter[`debut_${shift}`]);
        const b = ctrl.assertTime(shift, 'fin', data.details_quarter[`fin_${shift}`]);
        return (
          !a &&
          !b &&
          ctrl.validateShiftIntegrity(
            shift,
            data.details_quarter[`debut_${shift}`],
            '<',
            data.details_quarter[`fin_${shift}`],
          )
        );
      },
      displayErrors: () => ctrl.errors.forEach((er) => toast.info(er)),
    };
    return ctrl;
  }

  const add_dates = () => {
    const o = [];
    const n = [];
    nonouvrable.map((x) => {
      n.push(String(x));
    });
    ouvrable.map((x) => {
      o.push(String(x));
    });
    data.jours_ouvrable = o;
    data.jours_non_ouvrable = n;
    setData({ ...data });
  };
  const update = async () => {
    add_dates();

    const shiftValidator = initShiftValidatorspec();

    data.Process_type_id == '' && shiftValidator.errors.push('veuillez inserer le type de process');
    //else if (data.Machines.length==0){toast.info('veuillez inserer les machines') }
    //data.lignes.length == 0 && shiftValidator.errors.push('veuillez inserer les lignes')
    //data.Famille.length == 0 && shiftValidator.errors.push('veuillez inserer la famille')

    data.quart_debut == '' && shiftValidator.errors.push('veuillez inserer quart intitial');
    data.quart_fin == '' && shiftValidator.errors.push('veuillez inserer  quart final');
    if (shiftValidator.errors.length) {
      shiftValidator.displayErrors();
      return;
    }
    shiftValidator.checkShift('matin');
    shiftValidator.checkShift('midi');
    shiftValidator.checkShift('nuit');
    shiftValidator.checkShift('q4');

    if (shiftValidator.errors.length) {
      shiftValidator.displayErrors();
      return;
    }
    /*     shiftValidator.validateShiftsConflict(
      ['matin', 'fin', data.details_quarter.fin_matin],
      ['midi', 'debut', data.details_quarter.debut_midi],
    );
    shiftValidator.validateShiftsConflict(
      ['midi', 'fin', data.details_quarter.fin_midi],
      ['nuit', 'debut', data.details_quarter.debut_nuit],
    );
    shiftValidator.validateShiftsConflict(
      ['matin', 'debut', data.details_quarter.debut_matin],
      ['nuit', 'fin', data.details_quarter.fin_nuit],
    ); */
    if (shiftValidator.errors.length) {
      shiftValidator.displayErrors();
      return;
    } else {
      const res = await editquartspec(data);
      if (res.status == 400) {
        toast.error('erreur d insertion ');
      } else {
        console.log(res.status);
        toast.success('période mofifiée avec succes');
        window.location.reload(false);
      }
    }
  };

  const [openEditModal, setopenEditModal] = useState(false);
  useEffect(async () => {
    const res = await getallquartsspec();
    console.log('resultat********', res);
    if (res.models) {
      setquarts(res.models);
      console.log('***', res);
    } else {
      setquarts([]);
    }
  }, []);

  useEffect(async () => {
    const res = await getAllProcessTypes();
    setProcessTypeList(res);
  }, []);
  const handleChangeprosess = (event) => {
    setData({ ...data, Process_type_id: event.target.value });
    console.log(data);
  };
  const handleChangedate = (newValue) => {
    setData({ ...data, createDate: newValue });
  };
  const handleChangequart = (event) => {
    setData({ ...data, debut_quart: event.target.value });
  };

  const handleChangedebutmatin = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, debut_matin: newValue } });
  };
  const handleChangefinmatin = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, fin_matin: newValue } });
  };
  const handleChangedebutmidi = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, debut_midi: newValue } });
  };
  const handleChangefinmidi = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, fin_midi: newValue } });
  };
  const handleChangedebutnuit = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, debut_nuit: newValue } });
  };
  const handleChangefinnuit = (newValue) => {
    setData({ ...data, details_quarter: { ...data.details_quarter, fin_nuit: newValue } });
  };

  return (
    <div style={{ height: 350, width: '80%' }}>
      <DataGrid rows={quarts} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />

      <Modal
        open={openModal}
        close={() => {
          setOpenModal(false);
          setData(null);
        }}
      >
        <Typography variant="h4" component="h2">
          date de Début : <Chip label={moment(data?.date_quart[0]).format('L')} />
          date de fin : <Chip label={moment(data?.date_quart[1]).format('L')} />
        </Typography>
        <Stack style={{ margin: 5 }}></Stack>

        <Typography variant="h4" component="h2">
          quart de début : <Chip label={data?.quart_debut} />
          quart defin : <Chip label={data?.quart_fin} />
        </Typography>

        <Typography variant="h4" component="h2">
          Désignation : {data?.designation}
        </Typography>
        <Typography variant="h4" component="h2">
          date de création : {moment(data?.createDatesystem).format('L')}
        </Typography>
        <Typography variant="h4" component="h2">
          date de modification :{' '}
          {data?.updateDate ? moment(data?.updateDate).format('L') : 'Pas de date de modification'}
        </Typography>
        <Typography variant="h3" component="h2">
          Détails de quart :
        </Typography>
        <Stack spacing={1} alignItems="center">
          <Stack direction="row" spacing={1}>
            <Typography variant="h5" component="h2">
              {' '}
              horaire du Matin:{' '}
            </Typography>
            <Chip label={moment(data?.details_quarter.debut_matin).format('LTS')} color="primary" />
            <Chip label={moment(data?.details_quarter.fin_matin).format('LTS')} color="primary" />
            <Switch checked={data?.details_quarter.activation_matin} inputProps={{ 'aria-label': 'controlled' }} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="h5" component="h2">
              {' '}
              horaire du Aprés Midi:{' '}
            </Typography>
            <Chip label={moment(data?.details_quarter.debut_midi).format('LTS')} color="primary" />
            <Chip label={moment(data?.details_quarter.fin_midi).format('LTS')} color="primary" />
            <Switch checked={data?.details_quarter.activation_midi} inputProps={{ 'aria-label': 'controlled' }} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="h5" component="h2">
              {' '}
              horaire du Nuit:{' '}
            </Typography>
            <Chip label={moment(data?.details_quarter.debut_nuit).format('LTS')} color="primary" />
            <Chip label={moment(data?.details_quarter.fin_nuit).format('LTS')} color="primary" />
            <Switch checked={data?.details_quarter.activation_nuit} inputProps={{ 'aria-label': 'controlled' }} />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="h5" component="h2">
              {' '}
              horaire 4 eme quart:
            </Typography>
            <Chip label={moment(data?.details_quarter.debut_q4).format('LTS')} color="primary" />
            <Chip label={moment(data?.details_quarter.fin_q4).format('LTS')} color="primary" />
            <Switch checked={data?.details_quarter.activation_q4} inputProps={{ 'aria-label': 'controlled' }} />
          </Stack>
        </Stack>
        <Typography variant="h3" component="h2">
          Détails jours ouvrables :
        </Typography>

        <Stack direction="row" spacing={1}>
          {data?.jours_ouvrable.map((j) => (
            <Chip label={j} />
          ))}
        </Stack>
        <Typography variant="h3" component="h2">
          Détails Non jours ouvrables :
        </Typography>
        <Stack direction="row" spacing={1}>
          {data?.jours_non_ouvrable.map((j) => (
            <Chip label={j} />
          ))}
        </Stack>
      </Modal>

      <EditModal
        open={openEditModal}
        close={() => {
          setopenEditModal(false);
        }}
      >
        <Grid item xs={12}>
          <Stack direction="row">
            <FormControl sx={{ m: 1, minWidth: 100 }}>
              <InputLabel id="demo-simple-select-helper-label">Type de prosess</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={data?.Process_type_id}
                label="Age"
                onChange={spechandleChangeprosess}
              >
                {ProcessTypeList.map((prosess) => (
                  <MenuItem selected={process.id === data?.Process_type_id} value={prosess.id}>
                    {prosess.designation}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Ajouter process</FormHelperText>
            </FormControl>

            {/*                     <FormControl sx={{ m: 1, minWidth: 100 }}>
                        <InputLabel id="demo-simple-select-helper-label">Machine</InputLabel>
                        <Select
                        value={data?.Machines}
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Age"
                        onChange={spechandleChangemachines}
                        >
                        <MenuItem value="m889">m455</MenuItem>
                        <MenuItem value="m55">m55</MenuItem>

                        </Select>
                        <FormHelperText>Ajouter machine</FormHelperText>
                    
                    </FormControl> */}
            {/*                     <FormControl sx={{ m: 1, minWidth: 100 }}>
                        <InputLabel id="demo-simple-select-helper-label">Ligne</InputLabel>
                        <Select
                        value={data?.lignes}
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Age"
                        onChange={spechandleChangeligne}
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                    <MenuItem value="l1">l1</MenuItem>
                    <MenuItem value="l2">l2</MenuItem>


                        </Select>
                        <FormHelperText>Ligne </FormHelperText>
                    
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 100 }}>
                        <InputLabel id="demo-simple-select-helper-label">Famille</InputLabel>
                        <Select
                        value={data?.Famille}
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        label="Age"
                        onChange={spechandleChangefamille}
                        >
                    <MenuItem value="f1">fm2</MenuItem>
                    <MenuItem value="f2">fm3</MenuItem>

                        </Select>
                        <FormHelperText>Ajouter Famille</FormHelperText>
                    </FormControl> */}
          </Stack>

          <Stack direction="row">
            <FormControl sx={{ m: 1, minWidth: 100 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateRangePicker
                  startText="Date début"
                  inputFormat="dd/MM/yyyy"
                  disabled={true}
                  endText="Date fin"
                  value={data?.date_quart}
                  onChange={(newValue) => {
                    setRange(newValue);
                    setData({ ...data, date_quart: newValue });
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
          </Stack>
          <Stack direction="row">
            <FormControl sx={{ m: 5, minWidth: 100 }}>
              <InputLabel id="demo-simple-select-helper-label"> quart de début</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                label="quart de début"
                value={data?.quart_debut}
                onChange={spechandleChangequartdeut}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'matin'}>matin</MenuItem>
                <MenuItem value={'midi'}>Aprés midi</MenuItem>
                <MenuItem value={'nuit'}>nuit</MenuItem>
                <MenuItem value={'q4'}>4 éme quart</MenuItem>
              </Select>
              <FormHelperText>Ajouter le quart de début </FormHelperText>
            </FormControl>
            <FormControl sx={{ m: 5, minWidth: 100 }}>
              <InputLabel id="demo-simple-select-helper-label">quart de fin </InputLabel>
              <Select
                value={data?.quart_fin}
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                label="quart de fin "
                onChange={spechandleChangequartfin}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={'matin'}>matin</MenuItem>
                <MenuItem value={'midi'}>Aprés midi</MenuItem>
                <MenuItem value={'nuit'}>nuit</MenuItem>
                <MenuItem value={'q4'}>4 éme quart</MenuItem>
              </Select>
              <FormHelperText>Ajouter quart de fin</FormHelperText>
            </FormControl>
          </Stack>
          <Stack direction="row">
            <div class="ouvrable">
              <Button>choisir les jours ouvrables</Button>
              <DatePicker
                minDate={data?.date_quart[0]}
                maxDate={data?.date_quart[1]}
                multiple
                value={ouvrable}
                onChange={setouvrable}
              />
            </div>
            <div class="Non-ouvrable">
              <Button>choisir les jours Non ouvrables</Button>
              <DatePicker
                minDate={data?.date_quart[0]}
                maxDate={data?.date_quart[1]}
                inputFormat="dd/MM/yyyy"
                multiple
                value={nonouvrable}
                onChange={setnonouvrable}
                mapDays={({ date }) => {
                  let props = {};
                  ouvrable?.map((x) => {
                    if (String(x).includes(date)) props.hidden = true;
                  });

                  return props;
                }}
              />
            </div>
          </Stack>
          <Stack style={{ margin: 15 }}></Stack>
          <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2}>
              <LocalizationProvider dateAdapter={DateFNSUtils}>
                <TimePicker
                  label="horaire Début Matin"
                  onChange={spechandleChangedebutmatin}
                  value={data?.details_quarter.debut_matin}
                  renderInput={(params) => <TextField {...params} />}
                />

                <TimePicker
                  label="horaire fin matin"
                  value={data?.details_quarter.fin_matin}
                  onChange={spechandleChangefinmatin}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <Switch
                checked={data?.details_quarter.activation_matin}
                onChange={() => {
                  setData({
                    ...data,
                    details_quarter: {
                      ...data?.details_quarter,
                      activation_matin: !data?.details_quarter.activation_matin,
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
                  value={data?.details_quarter.debut_midi}
                  onChange={spechandleChangedebutmidi}
                  renderInput={(params) => <TextField {...params} />}
                />

                <TimePicker
                  label="horaire fin  Aprés midi"
                  value={data?.details_quarter.fin_midi}
                  onChange={spechandleChangefinmidi}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <Switch
                checked={data?.details_quarter.activation_midi}
                onChange={() => {
                  setData({
                    ...data,
                    details_quarter: {
                      ...data?.details_quarter,
                      activation_midi: !data?.details_quarter.activation_midi,
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
                  value={data?.details_quarter.debut_nuit}
                  onChange={spechandleChangedebutnuit}
                  renderInput={(params) => <TextField {...params} />}
                />

                <TimePicker
                  label="horaire fin  Nuit"
                  value={data?.details_quarter.fin_nuit}
                  onChange={spechandleChangefinnuit}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <Switch
                checked={data?.details_quarter.activation_nuit}
                onChange={() => {
                  setData({
                    ...data,
                    details_quarter: {
                      ...data?.details_quarter,
                      activation_nuit: !data?.details_quarter.activation_nuit,
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
                  value={data?.details_quarter.debut_q4}
                  onChange={spechandleChangedebutq4}
                  renderInput={(params) => <TextField {...params} />}
                />

                <TimePicker
                  label="horaire fin 4 éme quart"
                  value={data?.details_quarter.fin_q4}
                  onChange={spechandleChangefinq4}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <Switch
                checked={data?.details_quarter.activation_q4}
                onChange={() => {
                  setData({
                    ...data,
                    details_quarter: { ...data?.details_quarter, activation_q4: !data?.details_quarter.activation_q4 },
                  });
                }}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}></Stack>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: 10 }}
          onClick={() => {
            update();
          }}
        >
          Mettre a jour
        </Button>
      </EditModal>
    </div>
  );
}
