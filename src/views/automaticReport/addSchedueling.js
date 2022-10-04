import React, { useContext, useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TimePicker from '@mui/lab/TimePicker';
import { MenuItem, InputLabel, Select, Grid, Switch, Card } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import useScheduleExtractionService from '../../services/scheduelingService';
import useProcessTypeService from 'services/processTypeService';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import ImportOF from './importOF';
import { Alert } from '@material-ui/core';

export default function AddReportSchedueling() {
  const { getAllProcessTypes } = useProcessTypeService();
  const { addSchedule, editSchedule, getSchedulebyprocessType } = useScheduleExtractionService();
  const [processTypeList, setProcessTypeList] = useState([]);
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [processType, setProcessType] = useState('');
  const [time, setTime] = useState(null);
  const [output, setOutput] = useState('');
  const [scriptPath, setScriptPath] = useState('');
  const [editButton, setEditButton] = useState(false);
  const [toggle, setToggle] = useState(false);

  const getProcess = async () => {
    /** Set pending State */
    setProcessTypeList([{ id: 'pending', designation: 'Pending ...' }]);
    setProcessType('pending');
    const res = await getAllProcessTypes();
    console.log(res);
    setProcessTypeList(res);
    res.length && (res[0] || {}).id && updateSchedule((res[0] || {}).id);
  };

  const setPendingState = async () => {
    setTime(null);
    setScriptPath('Loading ....');
    setOutput('Loading ....');
  };

  const updateSchedule = async (processType) => {
    setPendingState();
    const res = await getSchedulebyprocessType(processType);
    const data = res.data.schedule || {
      processType,
      scriptPath: '',
      outputPath: '',
      activated: false,
      launchDate: null,
    };
    /** Update differnet form fields */
    setProcessType(data.processType);
    setScriptPath(data.scriptPath);
    setOutput(data.outputPath);
    setToggle(Boolean(data.activated));
    setTime(data.launchDate);
    /** Update data */
    setData(data);
  };

  const getSchedule = async (processtype) => {
    const res = await getSchedulebyprocessType(processtype);
    if (res.data.schedule) {
      setScriptPath(res.data.schedule.scriptPath);
      setOutput(res.data.schedule.outputPath);
      setToggle(Boolean(res.data.schedule.activated));
      setTime(res.data.schedule.launchDate);
      setData(res.data.schedule);
    } else {
      setTime(null);
      setScriptPath('');
      setOutput('');
    }
  };

  useEffect(() => {
    getProcess();
  }, []);

  const handleExtract = async () => {
    console.log(data);
    if (!data.outputPath) {
      toast.error('veuillez séléctionner le chemin de sortie');
      return;
    } else if (!data.processType) {
      toast.error('veuillez séléctionner le type de processus');
      return;
    } else if (!data.scriptPath) {
      toast.error('veuillez séléctionner le chemin script à exécuter ');
      return;
    } else if (!data.launchDate) {
      toast.error("veuillez séléctionner le temps d'execution de l'extraction ");
      return;
    }
    console.log(data);
    await addSchedule(data);
    handleAnnuler();
    toast.success('script planifié avec succès');
  };
  const handleEdit = () => {
    setEditButton(true);
  };
  const handleRunNow = async () => {
    alert('data :' + scriptPath + 'output : ' + output + 'LaunbchTime :' + time + 'processType :' + processType);
  };
  const handleAnnuler = async () => {
    await updateSchedule(processType);
    setEditButton(false);
  };

  return (
    <div>
      <Card style={{ padding: 20, height: '550px' }} direction="row" spacing={2}>
        <Grid container direction="column" spacing={2} marginLeft="200px">
          <Grid container direction="row">
            <Grid item padding={2}>
              <Typography variant="h4" fontFamily="arial" marginTop="5px">
                {t('PROCESS_TYPE.PROCESS_TYPE')}
              </Typography>
            </Grid>

            <Select
              required
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{ margin: 10, width: '13%' }}
              //autoWidth
              value={processType}
              onChange={(e) => {
                // setProcessType(e.target.value);
                // console.log(e.target.value);
                // setData({
                //   ...(data || {}),
                //   processType: e.target.value,
                // });
                // REVIEW to be removed
                // handleAnnuler();
                updateSchedule(e.target.value);
                // getSchedule(e.target.value);
              }}
            >
              {processTypeList?.map((row, key) => (
                <MenuItem value={row.id} key={key}>
                  {row.designation}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid container direction="row">
            <Grid item marginTop="27px">
              <Typography variant="h3" fontFamily="arial" marginRight="20px" marginLeft="0px">
                Manuel
              </Typography>
            </Grid>
            <ImportOF processTypeId={processType} />
          </Grid>
          <Grid container direction="column">
            <Grid item>
              <Typography variant="h3" fontFamily="arial" marginTop="20px" marginBottom="20px">
                Automatique
              </Typography>
            </Grid>
            <Grid container direction="row">
              <Grid item padding={2}>
                <Typography variant="h4" fontFamily="arial" marginTop="5px">
                  Chemin De Script
                </Typography>
              </Grid>

              <TextField
                required
                disabled //disabled={!editButton}
                value={scriptPath}
                style={{
                  marginLeft: '10px',
                  marginBottom: '10px',
                  width: '20%',
                }}
                size="medium"
                onChange={(e) => {
                  setScriptPath(e.target.value);
                  const obj = Object.assign({}, data, {
                    scriptPath: e.target.value,
                  });
                  setData(obj);
                }}
              />
            </Grid>
            <Grid container direction="row">
              <Grid item padding={2}>
                <Typography variant="h4" fontFamily="arial" marginTop="5px">
                  Output De Script
                </Typography>
              </Grid>

              <TextField
                disabled //disabled={!editButton}
                value={output}
                onChange={(e) => {
                  setOutput(e.target.value);
                  const obj = Object.assign({}, data, {
                    outputPath: e.target.value,
                  });
                  setData(obj);
                }}
                style={{
                  marginLeft: '15px',
                  marginBottom: '20px',
                  width: '20%',
                }}
                size="medium"
              />
            </Grid>
            <Grid container direction="row">
              <Grid item padding={2}>
                <Typography variant="h4" fontFamily="arial" marginTop="10px">
                  Temps d'éxecution
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Time"
                    value={time}
                    disabled //disabled={!editButton}
                    onChange={(newValue) => {
                      setTime(newValue);
                      const obj = Object.assign({}, data, {
                        launchDate: newValue,
                      });
                      setData(obj);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    style={{
                      marginRight: '10px',
                      marginTop: '10px',
                      width: '30%',
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid container direction="row">
              <Grid item xs={2}>
                <Typography variant="h4" fontFamily="arial" marginTop="10px" marginLeft="15px">
                  Activation
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Switch
                  justifyContent="center"
                  checked={toggle}
                  onClick={() => {
                    setToggle(toggle ? false : true);
                    const obj = Object.assign({}, data, {
                      activated: !toggle ? 1 : 0,
                    });
                    setData(obj);
                    console.log(obj);
                  }}
                  disabled // disabled={!editButton}
                ></Switch>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="column">
          {!editButton && (
            <Grid container direction="row" alignItems="end" justifyContent="end" marginRight={0} padding={1}>
              <Stack direction="row" alignItems="end" justifyContent="end" marginRight={0} padding={2}>
                <Button
                  variant="contained"
                  disableRipple
                  disabled
                  color="primary"
                  style={{ margin: 5, float: 'right' }}
                  onClick={handleRunNow}
                >
                  Executer maintenant
                </Button>
                <Button
                  variant="contained"
                  disableRipple
                  disabled
                  color="primary"
                  style={{ margin: 5, float: 'right' }}
                  onClick={handleEdit}
                >
                  editer
                </Button>
              </Stack>
            </Grid>
          )}
          {editButton && (
            <Grid container direction="row" alignItems="end" justifyContent="end" marginRight={0}>
              <Stack direction="row" alignItems="end" justifyContent="end" marginRight={0} padding={2}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: 5, float: 'right' }}
                  onClick={handleRunNow}
                >
                  simuler
                </Button>
                <Button
                  variant="contained"
                  disableRipple
                  color="success"
                  style={{ margin: 5, float: 'right' }}
                  onClick={handleExtract}
                >
                  sauvgarder
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  disableRipple
                  style={{ margin: 5, float: 'right' }}
                  onClick={handleAnnuler}
                >
                  annuler
                </Button>
              </Stack>
            </Grid>
          )}
        </Grid>
      </Card>
    </div>
  );
}

const style = {
  display: 'flex',
  justifyContent: 'center',
};
