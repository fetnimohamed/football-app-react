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

export default function DataTablequart() {
  const { getAllProcessTypes } = useProcessService();
  const { editquart } = useQuartService();

  const columns = [
    { field: 'designation', headerName: 'designation', width: 130 },
    {
      field: 'createDate',
      headerName: 'date  de création ',
      width: 130,
      renderCell: (params) => (
        <div>
          <Chip label={moment(params.row.createDate).format('L')} color="success" variant="outlined" />
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
          {/*  <IconButton color="primary" aria-label="upload picture" component="span" onClick={()=>{
          setopenEditModal(true)
          setData(params.row)
        }}>
          <EditIcon /> 
        </IconButton> */}
        </div>
      ),
    },
  ];

  const { getallquarts } = useQuartService();
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

  const update = async () => {
    if (data.Process_type_id == '') {
      toast.info('veuillez inserer le type de process');
    } else if (data.debut_quart == '') {
      toast.info('veuillez inserer le déut de quart');
    } else if (data.createDate == '') {
      toast.info('veuillez inserer la date intitial');
    } else if (data.details_quarter.debut_matin == '') {
      toast.info('veuillez inserer l heure debut_matin');
    } else if (data.details_quarter.fin_matin == '') {
      toast.info('veuillez inserer l heure fin matin');
    } else if (data.details_quarter.debut_midi == '') {
      toast.info('veuillez inserer l heure debut Aprés midi');
    } else if (data.details_quarter.fin_midi == '') {
      toast.info('veuillez inserer l heure fin Aprés midi');
    } else if (data.details_quarter.debut_nuit == '') {
      toast.info('veuillez inserer l heure debut nuit ');
    } else if (data.details_quarter.fin_nuit == '') {
      toast.info('veuillez inserer l heure fin nuit');
    } else {
      const dataupdated = await editquart(data);
      if (dataupdated.status == 400) {
        toast.error('erreur d insertion ');
      } else {
        console.log(dataupdated.status);
        toast.success('quart ajouté avec succes');
        window.location.reload(false);
      }
    }
  };
  const [openEditModal, setopenEditModal] = useState(false);
  useEffect(async () => {
    const res = await getallquarts();
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
          Désignation : {data?.designation}
        </Typography>
        <Typography variant="h4" component="h2">
          date de Début : {moment(data?.createDate).format('L')}
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
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="h5" component="h2">
              {' '}
              horaire du Aprés midi:{' '}
            </Typography>
            <Chip label={moment(data?.details_quarter.debut_midi).format('LTS')} color="primary" />
            <Chip label={moment(data?.details_quarter.fin_midi).format('LTS')} color="primary" />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="h5" component="h2">
              {' '}
              horaire du Nuit:{' '}
            </Typography>
            <Chip label={moment(data?.details_quarter.debut_nuit).format('LTS')} color="primary" />
            <Chip label={moment(data?.details_quarter.fin_nuit).format('LTS')} color="primary" />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="h5" component="h2">
              {' '}
              horaire du 4éme quart:{' '}
            </Typography>
            <Chip label={moment(data?.details_quarter.debut_q4).format('LTS')} color="primary" />
            <Chip label={moment(moment(data?.details_quarter.fin_q4)).format('LTS')} color="primary" />
          </Stack>
        </Stack>
        <Typography variant="h3" component="h2">
          Détails jours ouvrables :
        </Typography>
        <Stack direction="row" spacing={1}>
          <div className="lundi">
            <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>L</Avatar>
            <Stack direction="column" spacing={2}>
              <FormControlLabel
                control={<Checkbox checked={data?.detail_semaine.l.q1} />}
                label="Matin"
                style={{ marginLeft: 0 }}
              />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.l.q2} />} label="Aprés midi" />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.l.q3} />} label="Nuit" />
              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.l.q4} />} label="4 eme quart" />
            </Stack>
          </div>
          <div className="mardi">
            <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>M</Avatar>
            <Stack direction="column" spacing={2}>
              <FormControlLabel
                control={<Checkbox checked={data?.detail_semaine.m.q1} />}
                label="Matin"
                style={{ marginLeft: 0 }}
              />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.m.q2} />} label="Aprés midi" />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.m.q3} />} label="Nuit" />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.m.q4} />} label="4 eme quart" />
            </Stack>
          </div>
          <div className="mercredi">
            <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>ME</Avatar>
            <Stack direction="column" spacing={2}>
              <FormControlLabel
                control={<Checkbox checked={data?.detail_semaine.me.q1} />}
                label="Matin"
                style={{ marginLeft: 0 }}
              />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.me.q2} />} label="Aprés midi" />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.me.q3} />} label="Nuit" />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.me.q4} />} label="4 eme quart" />
            </Stack>
          </div>
          <div className="jeudi">
            <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>J</Avatar>
            <Stack direction="column" spacing={2}>
              <FormControlLabel
                control={<Checkbox checked={data?.detail_semaine.j.q1} />}
                label="Matin"
                style={{ marginLeft: 0 }}
              />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.j.q2} />} label="Aprés midi" />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.j.q3} />} label="Nuit" />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.j.q4} />} label="4 eme quart" />
            </Stack>
          </div>
          <div className="vendredi">
            <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>V</Avatar>
            <Stack direction="column" spacing={2}>
              <FormControlLabel
                control={<Checkbox checked={data?.detail_semaine.v.q1} />}
                label="Matin"
                style={{ marginLeft: 0 }}
              />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.v.q2} />} label="Aprés midi" />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.v.q3} />} label="Nuit" />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.v.q4} />} label="4 eme quart" />
            </Stack>
          </div>
          <div className="samedi">
            <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>S</Avatar>
            <Stack direction="column" spacing={2}>
              <FormControlLabel
                control={<Checkbox checked={data?.detail_semaine.s.q1} />}
                label="Matin"
                style={{ marginLeft: 0 }}
              />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.s.q2} />} label="Aprés midi" />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.s.q3} />} label="Nuit" />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.s.q4} />} label="4 eme quart" />
            </Stack>
          </div>
          <div className="dim">
            <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>D</Avatar>
            <Stack direction="column" spacing={2}>
              <FormControlLabel
                control={<Checkbox checked={data?.detail_semaine.d.q1} />}
                label="Matin"
                style={{ marginLeft: 0 }}
              />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.d.q2} />} label="Aprés midi" />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.d.q3} />} label="Nuit" />

              <FormControlLabel control={<Checkbox checked={data?.detail_semaine.d.q4} />} label="4 eme quart" />
            </Stack>
          </div>
        </Stack>
      </Modal>

      <EditModal
        open={openEditModal}
        close={() => {
          setopenEditModal(false);
          setData(null);
        }}
      >
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: 10, float: 'right' }}
            onClick={() => {
              update();
            }}
          >
            Mettre a jour Quart
          </Button>
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ m: 1, minWidth: 100 }}>
              <InputLabel id="demo-simple-select-helper-label">Type de prosess</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={data?.Process_type_id}
                label="Age"
                onChange={handleChangeprosess}
              >
                <MenuItem value=""></MenuItem>
                {ProcessTypeList?.map((prosess) => (
                  <MenuItem selected={process.id === data?.Process_type_id} value={prosess.id}>
                    {prosess.designation}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Ajouter type process</FormHelperText>
            </FormControl>
            <FormControl sx={{ m: 1, maxWidth: 130 }}>
              <LocalizationProvider dateAdapter={DateFNSUtils}>
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label="A partir "
                    inputFormat="dd/dd/yyyy"
                    value={data?.createDate}
                    onChange={handleChangedate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ m: 1, maxWidth: 80 }}>
              <InputLabel id="demo-simple-select-helper-label">{data?.debut_quart}</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                label={data?.debut_quart}
                onChange={handleChangequart}
              >
                <MenuItem value={'q1'}>q1</MenuItem>
                <MenuItem value={'q2'}>q2</MenuItem>
                <MenuItem value={'q3'}>q3</MenuItem>
                <MenuItem value={'q4'}>q4</MenuItem>
              </Select>
              <FormHelperText> quart de début</FormHelperText>
            </FormControl>
          </Stack>

          <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2}>
              <LocalizationProvider dateAdapter={DateFNSUtils}>
                <FormControl sx={{ m: 1, minWidth: 60 }}>
                  <TimePicker
                    label="Matin Début"
                    onChange={handleChangedebutmatin}
                    value={data?.details_quarter.debut_matin}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <TimePicker
                    label="matin fin"
                    value={data?.details_quarter.fin_matin}
                    onChange={handleChangefinmatin}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </FormControl>
              </LocalizationProvider>
            </Stack>
            <Stack direction="row" spacing={2}>
              <LocalizationProvider dateAdapter={DateFNSUtils}>
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <TimePicker
                    label="Début A Aprés midi"
                    value={data?.details_quarter.debut_midi}
                    onChange={handleChangedebutmidi}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <TimePicker
                    label="fin  Aprés midi"
                    value={data?.details_quarter.fin_midi}
                    onChange={handleChangefinmidi}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </FormControl>
              </LocalizationProvider>
            </Stack>
            <Stack direction="row" spacing={2}>
              <LocalizationProvider dateAdapter={DateFNSUtils}>
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <TimePicker
                    label="Début Nuit"
                    value={data?.details_quarter.debut_nuit}
                    onChange={handleChangedebutnuit}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 100 }}>
                  <TimePicker
                    label="fin  Nuit"
                    value={data?.details_quarter.fin_nuit}
                    onChange={handleChangefinnuit}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </FormControl>
              </LocalizationProvider>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <div className="lundi">
              <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>L</Avatar>
              <Stack direction="column" spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data?.detail_semaine.l.q1}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            l: { ...data.detail_semaine.l, q1: !data.detail_semaine.l.q1 },
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
                      checked={data?.detail_semaine.l.q2}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            l: { ...data.detail_semaine.l, q2: !data.detail_semaine.l.q2 },
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
                      checked={data?.detail_semaine.l.q3}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            l: { ...data.detail_semaine.l, q3: !data.detail_semaine.l.q3 },
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
                      checked={data?.detail_semaine.l.q4}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            l: { ...data.detail_semaine.l, q4: !data.detail_semaine.l.q4 },
                          },
                        });
                      }}
                    />
                  }
                  label="4 eme quart"
                />
              </Stack>
            </div>
            <div className="mardi">
              <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>M</Avatar>
              <Stack direction="column" spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data?.detail_semaine.m.q1}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            m: { ...data.detail_semaine.m, q1: !data.detail_semaine.m.q1 },
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
                      checked={data?.detail_semaine.m.q2}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            m: { ...data.detail_semaine.m, q2: !data.detail_semaine.m.q2 },
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
                      checked={data?.detail_semaine.m.q3}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            m: { ...data.detail_semaine.m, q3: !data.detail_semaine.m.q3 },
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
                      checked={data?.detail_semaine.m.q4}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            m: { ...data.detail_semaine.m, q4: !data.detail_semaine.m.q4 },
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
              <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>ME</Avatar>
              <Stack direction="column" spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data?.detail_semaine.me.q1}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            me: { ...data.detail_semaine.me, q1: !data.detail_semaine.me.q1 },
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
                      checked={data?.detail_semaine.me.q2}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            me: { ...data.detail_semaine.me, q2: !data.detail_semaine.me.q2 },
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
                      checked={data?.detail_semaine.me.q3}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            me: { ...data.detail_semaine.me, q3: !data.detail_semaine.me.q3 },
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
                      checked={data?.detail_semaine.me.q4}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            me: { ...data.detail_semaine.me, q4: !data.detail_semaine.me.q4 },
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
                      checked={data?.detail_semaine.j.q1}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            j: { ...data.detail_semaine.j, q1: !data.detail_semaine.j.q1 },
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
                      checked={data?.detail_semaine.j.q2}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            j: { ...data.detail_semaine.j, q2: !data.detail_semaine.j.q2 },
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
                      checked={data?.detail_semaine.j.q3}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            j: { ...data.detail_semaine.j, q3: !data.detail_semaine.j.q3 },
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
                      checked={data?.detail_semaine.j.q4}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            j: { ...data.detail_semaine.j, q4: !data.detail_semaine.j.q4 },
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
                      checked={data?.detail_semaine.v.q1}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            v: { ...data.detail_semaine.v, q1: !data.detail_semaine.v.q1 },
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
                      checked={data?.detail_semaine.v.q2}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            v: { ...data.detail_semaine.v, q2: !data.detail_semaine.v.q2 },
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
                      checked={data?.detail_semaine.v.q3}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            v: { ...data.detail_semaine.v, q3: !data.detail_semaine.v.q3 },
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
                      checked={data?.detail_semaine.v.q4}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            v: { ...data.detail_semaine.v, q4: !data.detail_semaine.v.q4 },
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
                      checked={data?.detail_semaine.s.q1}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            s: { ...data.detail_semaine.s, q1: !data.detail_semaine.s.q1 },
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
                      checked={data?.detail_semaine.s.q2}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            s: { ...data.detail_semaine.s, q2: !data.detail_semaine.s.q2 },
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
                      checked={data?.detail_semaine.s.q3}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            s: { ...data.detail_semaine.s, q3: !data.detail_semaine.s.q3 },
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
                      checked={data?.detail_semaine.s.q4}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            s: { ...data.detail_semaine.s, q4: !data.detail_semaine.s.q4 },
                          },
                        });
                      }}
                    />
                  }
                  label="4 eme quart"
                />
              </Stack>
            </div>
            <div className="dim">
              <Avatar sx={{ bgcolor: '#2196f3', color: 'white' }}>D</Avatar>
              <Stack direction="column" spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data?.detail_semaine.d.q1}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            d: { ...data.detail_semaine.d, q1: !data.detail_semaine.d.q1 },
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
                      checked={data?.detail_semaine.d.q2}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            d: { ...data.detail_semaine.d, q2: !data.detail_semaine.d.q2 },
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
                      checked={data?.detail_semaine.d.q3}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            d: { ...data.detail_semaine.d, q3: !data.detail_semaine.d.q3 },
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
                      checked={data?.detail_semaine.d.q4}
                      onChange={() => {
                        setData({
                          ...data,
                          detail_semaine: {
                            ...data.detail_semaine,
                            d: { ...data.detail_semaine.d, q4: !data.detail_semaine.d.q4 },
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
        </Grid>
      </EditModal>
    </div>
  );
}
