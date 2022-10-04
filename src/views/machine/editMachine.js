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
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
} from '@material-ui/core';
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
const EditMachineForm = ({ existMachine, callback }) => {
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
  let [attributes, setAtrributes] = useState(existMachine.attributes);
  const [local, setLocal] = useState(0);
  const [localPath, setLocalPath] = useState();
  const { t, i18n } = useTranslation();
  const [processTypeData, setProcessTypedata] = useState([]);
  const [machineCycleData, setMachineCycleData] = useState([]);
  const [machineModelData, setMachineModelData] = useState([]);
  const [displayTree, setDisplayTree] = useState(false);
  const [mapping, setMapping] = useState([]);
  const [open, setOpen] = useState(false);

  const [processData, setProcessData] = useState();
  const scriptedRef = useScriptRef();
  //get data///////////
  async function getData() {
    const mappingData = await getAllMapping();
    setMapping(mappingData);
    const processTypeData = await getAllProcessTypes();
    setProcessTypedata(processTypeData);
    const cycleMachineData = await getAllCycle();
    setMachineCycleData(cycleMachineData.data);
    const modelData = await getModelsMachine();
    // console.log(await getModelsMachine());
    setMachineModelData(modelData);
    console.log('map', mapping);
    setLocalPath(existMachine ? getpath(mappingData.data.mapping, existMachine.local) : 'merci de choisi le local');
    console.log('local', existMachine.local, getpath(mappingData.data.mapping, existMachine.local));
  }
  //////////////////////////////////////
  ////////////// use effect section/////
  useEffect(() => {
    console.log(existMachine);
    setLocal(existMachine.local);
    getData();
  }, []);
  useEffect(() => {
    // console.log(getpath(mapping, local));
    console.log(mapping);
  }, [local]);

  return (
    <>
      <Box
        sx={{
          ...style,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center" margin={1}>
          <h2 variant="subtitle1">{t('MACHINE.EDIT_MACHINE')}</h2>
        </Stack>
        <Formik
          initialValues={{
            id: existMachine.id,
            code: existMachine.code,
            id_processType: existMachine.id_processType,
            id_model: String(existMachine.id_model),
            id_cycle: existMachine.id_cycle,
            status: existMachine.status,
            workStation: existMachine.workStation,
            local: existMachine.local,
            attributes: existMachine.attributes,
            detail: existMachine.detail,
            seuil: existMachine.seuil,
            position: existMachine.position ? existMachine.position : 0,
          }}
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
                    value={String(values.id_processType)}
                    onChange={(e) => {
                      values.id_processType = e.target.value;
                      // call the built-in handleBur
                      setProcessData(processTypeData.filter((p) => p.code_processType === e.target.value));
                      //TODO set id of edit machine

                      console.log('attributes', processData);
                      if (processData) {
                        console.log('attributes child', processData[0].attributes);
                        values.attributes = processData.attributes;
                        console.log(processData.attributes);
                      }
                    }}
                  >
                    {processTypeData?.map((row) => (
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
                  {machineModelData ? (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="id_model"
                      value={values.id_model}
                      onChange={handleChange}
                    >
                      {machineModelData.map((row) => (
                        <MenuItem value={row.id}>{row.name}</MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="id_model"
                      value={values.id_model}
                      onChange={handleChange}
                    >
                      <MenuItem value={0}>Il n'existe pas des modèles de machines</MenuItem>
                    </Select>
                  )}
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
                    {machineCycleData.map((row) => (
                      <MenuItem value={row.id}>{row.codeCycle}</MenuItem>
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
                    onChange={handleChange}
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
                    <InputLabel htmlFor="outlined-adornment-pdt" shrink={true}>
                      Local
                    </InputLabel>
                    <OutlinedInput
                      disabled
                      type="text"
                      name="local"
                      label="Local"
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
                          {attributes.map((data, index) => (
                            <TableRow>
                              <TableCell component="th" scope="row">
                                {Object.keys(data)}
                              </TableCell>
                              <TableCell>
                                <OutlinedInput
                                  id={Object.keys(data)}
                                  type="text"
                                  autoFocus
                                  name="attributes"
                                  label="Seuil"
                                  value={Object.values(attributes[index])}
                                  onChange={(e) => {
                                    console.log(e.target.value);
                                    existMachine.attributes[index] = {
                                      [e.target.id]: e.target.value,
                                    };
                                    console.log(existMachine.attributes);
                                    attributes = existMachine.attributes;
                                    setAtrributes([...attributes]);
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

              <Stack direction="row" alignItems="start" justifyContent="center" margin={2}>
                <FormControl fullWidth>
                  <FormControlLabel
                    control={
                      <Switch checked={values.status} onChange={handleChange} value={values.status} id="status" />
                    }
                    label={t('GENERAL.ACTIVATED')}
                  />
                </FormControl>
              </Stack>

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
                  //   type="submit"
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    console.log(mapping);
                    values.local = local;
                    let goodAttributes = true;
                    attributes.forEach((machineAttribute) => {
                      if (Object.values(machineAttribute)[0].length === 0) goodAttributes = false;
                    });
                    console.log('edit', values);
                    if (
                      values.id_processType &&
                      values.id_model &&
                      values.id_cycle &&
                      values.local &&
                      values.seuil &&
                      goodAttributes
                    ) {
                      const resp = await editMachine(values);
                      console.log(resp.data.status);
                      if (resp.data.status === 201) {
                        toast.success('Machine Modifié !!');
                        callback();
                      } else if (resp.data.status === 400) {
                        toast.error(resp.data.error);
                      } else {
                        toast.error(resp.data.error);
                      }
                    } else {
                      toast.error('Merci de remplir tous le champs!');
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
            console.log('sss', local);
          }}
        >
          <MachineTree setLocal={setLocal} setOpen={setOpen} setLocalPath={setLocalPath} />
        </Modal>
      </Box>
    </>
  );
};
export default EditMachineForm;
