import {
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
} from '@material-ui/core';
import TableCell from '@mui/material/TableCell';
import { Box } from '@material-ui/system';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useMachineCycleService from 'services/machineCycle';
import useProcessTypeService from 'services/processTypeService';
import * as yup from 'yup';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Modal from 'ui-component/modal/modal';
import MachineTree from './machineTree';
import useMachineService from 'services/machineService';
import { toast } from 'react-toastify';
import useScriptRef from 'hooks/useScriptRef';
import { TreeItem, TreeView } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useModelsMachineService from 'services/modelsMachineService';
import getpath from './getpath';
import useMappingService from 'services/mappingService';
const style = {
  margin: '15px',
  position: 'absolute',
  overflowY: 'auto',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  maxWidth: '100vw',
  maxHeight: '85%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const AddMachineForm = ({ existMachine, callback }) => {
  //////////////////////////////////////////////
  ////////////////// services //////////////////
  const { getAllProcessTypes } = useProcessTypeService();
  const { getAllCycle } = useMachineCycleService();
  const { addMachine, editMachine } = useMachineService();
  const { getModelsMachine } = useModelsMachineService();
  const { getAllMapping } = useMappingService();
  /////////////////////////////////////////
  /////  state management section ////////
  const [data, setData] = useState({});
  const [attributes, setAtrributes] = useState([]);
  const [local, setLocal] = useState(0);
  const [localPath, setLocalPath] = useState();
  const { t, i18n } = useTranslation();
  const [processTypeData, setProcessTypedata] = useState([]);
  const [machineCycleData, setMachineCycleData] = useState([]);
  const [machineModelData, setMachineModelData] = useState([]);
  const [displayAttr, setDisplayAttr] = useState([]); //temp attributes state
  const [mapping, setMapping] = useState([]);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    id: '',
    code: '',
    id_processType: '',
    id_model: '',
    id_cycle: '',
    status: true,
    workStation: '',
    local: '',
    attributes: '',
    detail: '',
    seuil: '',
    position: 0,
    // attribute: "",
  });
  const [processData, setProcessData] = useState();
  const scriptedRef = useScriptRef();

  //get data///////////
  async function getData() {
    const processTypeData = await getAllProcessTypes();
    console.log('pdata', processTypeData);
    setProcessTypedata(processTypeData);
    const cycleMachineData = await getAllCycle();
    console.log('machCy', cycleMachineData.data);
    setMachineCycleData(cycleMachineData.data);
    const modelData = await getModelsMachine();
    console.log('model', modelData);
    // console.log(await getModelsMachine());
    setMachineModelData(modelData);
    const mappingData = await getAllMapping();
    setMapping(mappingData.data.mappping);
  }
  //////////////////////////////////////
  ////////////// use effect section/////
  useEffect(() => {
    getData();
    setLocalPath('merci de choisi le local');
  }, []);

  return (
    <>
      <Box
        sx={{
          ...style,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center" margin={1}>
          <h2 variant="subtitle1">{t('MACHINE.ADD_NEW_MACHINE')}</h2>
        </Stack>
        <Formik
          initialValues={state}
          validationSchema={yup.object().shape({
            code: yup.string().max(10, t('TOAST.VALIDATE_MAX_10')).required(t('TOAST.REQUIRED')),
            id_processType: yup.string().required(t('TOAST.REQUIRED')),
            id_model: yup.string().required(t('TOAST.REQUIRED')),
            id_cycle: yup.string().required(t('TOAST.REQUIRED')),
            status: yup.boolean().required(t('TOAST.REQUIRED')),
            workStation: yup.string().required(t('TOAST.REQUIRED')),
            local: yup.string().required(t('TOAST.REQUIRED')),
            // attribute: yup.string().required(t("TOAST.REQUIRED")),
            attributes: yup.array().required(t('TOAST.REQUIRED')),

            detail: yup.string().max(300, t('TOAST.VALIDATE_MAX_300')),
            seuil: yup.number().required(t('TOAST.REQUIRED')),
          })}
        >
          {({ values, errors, isSubmitting, handleChange, handleBlur, touched }) => (
            <Form>
              {/* ///////////////////////////// Process type //////////////////// */}
              <Stack direction="row" alignItems="center" justifyContent="center" margin={2}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">{t('PROCESS_TYPE.PROCESS_TYPE')}</InputLabel>

                  <Select
                    name="id_processType"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.id_processType}
                    onChange={(e) => {
                      values.id_processType = e.target.value;

                      values.attributes = processTypeData.filter((p) => p.id === e.target.value)[0].attributes;
                      setAtrributes(values.attributes);
                    }}
                  >
                    {processTypeData.map((row) => (
                      <MenuItem value={row.id}>{row.designation}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              {/* ///////////////////////////// Process type //////////////////// */}

              {/* ///////////////////////////// Modèle //////////////////// */}

              <Stack direction="row" alignItems="center" justifyContent="center" margin={2}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-model">{t('GENERAL.MODEL')}</InputLabel>
                  {
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="id_model"
                      value={values.id_model}
                      onChange={handleChange}
                    >
                      {machineModelData
                        .filter((model) => model.processtypeId === values.id_processType)
                        .map((row) => (
                          <MenuItem value={row.id}>{row.name}</MenuItem>
                        ))}
                    </Select>
                  }
                </FormControl>
              </Stack>

              {/* ///////////////////////////// Modèle //////////////////// */}

              {/* ///////////////////////////// Cycle //////////////////// */}
              <Stack direction="row" alignItems="center" justifyContent="center" margin={2}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-cycle">{t('GENERAL.CYCLE')}</InputLabel>
                  <Select
                    labelId="id_cycle"
                    id="id_cycle"
                    name="id_cycle"
                    value={values.id_cycle}
                    onChange={handleChange}
                  >
                    {machineCycleData
                      .filter((cycle) => cycle.processTypeId === values.id_processType)
                      .map((row) => (
                        <MenuItem value={row.id}>{row.designation}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Stack>
              {/* ///////////////////////////// Cycle //////////////////// */}

              {/* ///////////////////////////// Code //////////////////// */}
              <Stack direction="row" alignItems="start" justifyContent="start" margin={2}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-code">{t('GENERAL.CODE')}</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-code"
                    type="text"
                    name="code"
                    label="Code"
                    value={values.code}
                    onChange={(event) => {
                      values.code = event.target.value.toUpperCase();
                      setState({ ...values, code: event.target.value.toUpperCase() });
                    }}
                  />
                  {touched.code && errors.code && (
                    <FormHelperText error id="standard-weight-helper-text-code">
                      {' '}
                      {errors.code}{' '}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
              {/* ///////////////////////////// Code //////////////////// */}

              {/* ///////////////////////////// workStation //////////////////// */}
              {/* <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                margin={2}
              >
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-pdt">
                    {t("GENERAL.PDT")}
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-pdt"
                    type="text"
                    name="workStation"
                    label="Pdt"
                    value={values.workStation}
                    onChange={handleChange}
                  />
                  {touched.workStation && errors.workStation && (
                    <FormHelperText error id="standard-weight-helper-text-code">
                      {" "}
                      {errors.workStation}{" "}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack> */}
              {/* ///////////////////////////// workStation //////////////////// */}

              {/* ///////////////////////////// LOCAL //////////////////// */}

              <Stack direction="row" alignItems="start" justifyContent="center" margin={2}>
                <Box sx={{ borderRadius: 2, bgcolor: '#e6e9ec', width: 1 }}>
                  <FormControl sx={{ width: '90%' }}>
                    <InputLabel htmlFor="outlined-adornment-pdt">{t('GENERAL.LOCAL')}</InputLabel>
                    <OutlinedInput
                      type="text"
                      name="local"
                      label="Local"
                      disabled="true"
                      value={localPath}
                      onChange={handleChange}
                      inputProps={{ 'aria-label': 'search google maps' }}
                    />{' '}
                  </FormControl>
                  <IconButton
                    aria-label="search"
                    sx={{ width: '10%' }}
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    <AccountTreeIcon />
                  </IconButton>
                </Box>
              </Stack>

              {/* ///////////////////////////// LOCAL //////////////////// */}

              {/* ///////////////////////////// SEUIL TRG //////////////////// */}
              <Stack direction="row" alignItems="start" justifyContent="start" margin={2}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-seuil">{t('MACHINE.MAXIMUM')}</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-seuil"
                    type="number"
                    name="seuil"
                    label="Seuil"
                    value={values.seuil}
                    onChange={handleChange}
                  />
                  {touched.seuil && errors.seuil && (
                    <FormHelperText error id="standard-weight-helper-text-seuil">
                      {' '}
                      {errors.seuil}{' '}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
              {/*///////////////////////////// SEUIL TRG //////////////////// */}
              {/* ///////////////////////////// position //////////////////// */}
              <Stack direction="row" alignItems="start" justifyContent="start" margin={2}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-seuil">Position</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-seuil"
                    type="number"
                    name="position"
                    label="position"
                    value={values.position}
                    onChange={handleChange}
                  />
                  {touched.seuil && errors.seuil && (
                    <FormHelperText error id="standard-weight-helper-text-seuil">
                      {' '}
                      {errors.seuil}{' '}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
              {/*///////////////////////////// position //////////////////// */}

              {/* ///////////////////////////// ATTRIBUTS //////////////////// */}
              <Stack direction="row" alignItems="start" justifyContent="start" margin={2}>
                {
                  <List component={Paper} sx={{ width: 1 }}>
                    <Box
                      sx={{
                        display: 'grid',
                        columnGap: 2,
                        rowGap: 2,
                        gridTemplateColumns: 'repeat(1, 1fr)',
                      }}
                    >
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Attributs</TableCell>
                              <TableCell>Valeurs</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {attributes.map((row, index) => (
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  {row}
                                </TableCell>
                                <TableCell>
                                  <OutlinedInput
                                    id={row}
                                    type="text"
                                    // required
                                    autoFocus
                                    onChange={(e) => {
                                      console.log(e.target.value, index, row, attributes[index]);
                                      let arrayData = displayAttr;
                                      arrayData[index] = {
                                        [row]: e.target.value,
                                      };
                                      console.log(arrayData);
                                      setDisplayAttr(arrayData);
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </List>
                }
              </Stack>
              {/* ///////////////////////////// ATTRIBUTS //////////////////// */}

              {/* ///////////////////////////// DETAILS //////////////////// */}
              <Stack direction="row" alignItems="start" justifyContent="start" margin={2}>
                <FormControl fullWidth>
                  <TextField
                    id="detail"
                    label={t('GENERAL.DETAILS')}
                    value={values.detail}
                    onChange={handleChange}
                    multiline
                    rows={4}
                  />
                  {touched.detail && errors.detail && (
                    <FormHelperText error id="standard-weight-helper-text-detail">
                      {' '}
                      {errors.detail}{' '}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
              {/* ///////////////////////////// DETAILS //////////////////// */}

              {/* ///////////////////////////// STATUS //////////////////// */}

              {/* <Stack
                direction="row"
                alignItems="start"
                justifyContent="center"
                margin={2}
              >
                <FormControl fullWidth>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.status}
                        onChange={handleChange}
                        value={values.status}
                        id="status"
                      />
                    }
                    label={t("GENERAL.ACTIVATED")}
                  />
                </FormControl>
              </Stack> */}

              {/* ///////////////////////////// STATUS //////////////////// */}
              <Box
                sx={{
                  '& button': { m: 1 },
                  display: 'flex',
                  justifyContent: 'end',
                }}
              >
                <Button
                  size="sm"
                  variant="contained"
                  color="error"
                  onClick={() => {
                    callback();
                  }}
                >
                  {t('GENERAL.CANCEL')}
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    values.local = local;
                    values.attributes = displayAttr;
                    let goodAttributes = true;
                    attributes.forEach((machineAttribute) => {
                      if (Object.values(machineAttribute)[0].length === 0) goodAttributes = false;
                    });
                    console.log(values);
                    if (
                      values.id_processType &&
                      values.id_model &&
                      values.id_cycle &&
                      //values.workStation &&
                      values.local &&
                      values.seuil &&
                      goodAttributes &&
                      values.position
                    ) {
                      const resp = await addMachine(values);
                      if (resp.data.id) {
                        toast.success('Machine ajouté !!');
                        callback();
                      } else {
                        toast.error(resp.data.error);
                      }
                    } else {
                      toast.error('Merci de remplir toute les champs !');
                    }
                  }}
                >
                  {t('GENERAL.SUBMIT')}
                </Button>{' '}
              </Box>
            </Form>
          )}
        </Formik>

        <Modal
          open={open}
          close={() => {
            setOpen(false);
            console.log(local);
          }}
        >
          <MachineTree setLocal={setLocal} setOpen={setOpen} setLocalPath={setLocalPath} />
        </Modal>
      </Box>
    </>
  );
};
export default AddMachineForm;
