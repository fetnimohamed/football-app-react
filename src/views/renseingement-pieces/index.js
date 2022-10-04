import React, { Fragment, useEffect, useState } from 'react';
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TableContainer,
  TextField,
  Modal,
  Card,
  Tab,
  Button,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import useProcessTypeService from 'services/processTypeService';
import useMachineService from '../../services/machineService';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box } from '@material-ui/system';
import DatePicker from 'react-multi-date-picker';
import { DesktopDatePicker, TabContext, TabList, TabPanel } from '@mui/lab';
import DetailedHistory from './detailed-history';
import GeneralizedHistory from './generalized-history';
import { Form, Formik, setNestedObjectValues } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import useImportOrdersService from 'services/importOrdersService';
import { SettingsInputAntenna } from '@material-ui/icons';
import { toast } from 'react-toastify';

const Index = ({ data }) => {
  /////////////// Use state ///////////////
  /////////////////////////////////////////

  const { t, i18n } = useTranslation();
  const [processTypes, setProcessTypes] = useState([]);
  const [machines, setMachines] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [value, setValue] = useState('1');
  const [machine, setMachine] = useState([]);
  const [state, setState] = useState([]);
  const [filter, setfilter] = useState({
    processType: '',
    machine: '',
    date: '',
    quart: '',
  });
  ////////////////// services //////////////
  //////////////////////////////////////////
  const { getAllProcessTypes } = useProcessTypeService();
  const { getAllMachines } = useMachineService();
  const { getOrdersHistory } = useImportOrdersService();

  ////////////// Get all data /////////
  ////////////////////////////////////
  async function getAllData() {
    const processTypesData = await getAllProcessTypes();

    setProcessTypes(processTypesData);
    const machines = await getAllMachines();
    setMachines(machines);
  }
  ///////////////////// use Effect //////////////////
  useEffect(() => {
    (async () => {
      await getAllData();
    })();
  }, []);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Formik
        initialValues={filter}
        validationSchema={yup.object().shape({
          processType: yup.string().required('Ce champs est obligatoire !'),
          machine: yup.string().required(t('TOAST.REQUIRED')),
          date: yup.string().required(t('TOAST.REQUIRED')),
          quart: yup.string().required(t('TOAST.REQUIRD')),
        })}
        onSubmit={async (values) => {
          setState([]);
          const response = await getOrdersHistory(
            filter.machine,
            ''.concat(filter.quart, moment(filter.date).format('DDMMYYYY')),
          );
          if (response.status == 200) {
            setState(response.history);
            // setfilter({
            //   processType: '',
            //   machine: '',
            //   date: '',
            //   quart: '',
            // });
          } else if (response.status == 201) {
            toast.warning('Pas de données ! ');
          }
        }}
      >
        {({ values, errors, isSubmitting, handleChange, handleBlur, touched }) => (
          <Form>
            <Stack direction="row" spacing={1} margin={1}>
              {/* ////////////////////////// BEGIN PROCESS TYPE LIST /////////////////////// */}
              <FormControl style={{ width: '25%' }}>
                <InputLabel id="demo-simple-select-label">{t('PROCESS_TYPE.PROCESS_TYPE')}</InputLabel>
                <Select
                  name="processType"
                  id="demo-simple-select"
                  value={values.processType}
                  onChange={(e) => {
                    values.processType = e.target.value;
                    const machineList = machines.filter((p) => p.id_processType == e.target.value);
                    setDisplayData(machineList);
                    setfilter({ ...filter, processType: e.target.value });
                  }}
                >
                  {processTypes?.map((row) => (
                    <MenuItem value={row.id}>{row.designation}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* ////////////////////////// END PROCESS TYPE LIST /////////////////////// */}
              {/* ////////////////////////// BEGIN MACHINE LIST /////////////////////// */}
              <FormControl style={{ width: '25%' }}>
                <InputLabel id="demo-simple-select-label">{t('GENERAL.MACHINE')}</InputLabel>
                <Select
                  name="machine"
                  id="machine"
                  value={values.machine}
                  onChange={(e) => {
                    values.machine = e.target.value;
                    setMachine(values.machine);
                    console.log(values.machine);
                    setfilter({ ...filter, machine: e.target.value });
                  }}
                >
                  {displayData?.map((row) => (
                    <MenuItem value={row.id}>{row.code}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* ////////////////////////// END MACHINE LIST /////////////////////// */}
              {/* ////////////////////////// BEGIN DATE /////////////////////// */}
              <FormControl sx={{ m: 1, width: '25%' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={3}>
                    <DesktopDatePicker
                      name="date"
                      minDate={new Date('2017-01-01')}
                      inputFormat="dd/MM/yyyy"
                      label="Date"
                      value={filter.date}
                      onChange={(newValue) => {
                        setfilter({ ...filter, ['date']: moment(newValue) });

                        console.log('date date ', newValue);
                        values.date = newValue;
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
              </FormControl>
              {/* ////////////////////////// END DATE /////////////////////// */}
              {/* ////////////////////////// BEGIN quart /////////////////////// */}
              <FormControl style={{ width: '25%' }}>
                <InputLabel id="demo-simple-select-label">Quart</InputLabel>
                <Select
                  name="quart"
                  id="demo-simple-select"
                  value={values.quart}
                  onChange={(e) => {
                    values.quart = e.target.value;
                    setfilter({ ...filter, ['quart']: e.target.value });
                  }}
                >
                  <MenuItem value="matin">Matin</MenuItem>
                  <MenuItem value="midi">Aprés midi</MenuItem>
                  <MenuItem value="nuit">Nuit</MenuItem>
                </Select>
              </FormControl>
              {/* ////////////////////////// END quart /////////////////////// */}
              {/* ////////////////////////// BEGIN BUTTON /////////////////////// */}
              <Button size="sm" type="submit" variant="contained" color="primary">
                Rechercher
              </Button>
              {/* ////////////////////////// END BUTTON /////////////////////// */}
            </Stack>
          </Form>
        )}
      </Formik>
      <Card>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChangeTab}>
                <Tab label="Historique détaillé" value="1" />
                <Tab label="Historique généralisé" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              {state.detailedHistory ? (
                <DetailedHistory data={state.detailedHistory?.docs} />
              ) : (
                <Box>
                  <h3>
                    Veuillez remplir les champs du filtre pour visualiser l'historique des renseignements des pièces
                  </h3>
                </Box>
              )}
            </TabPanel>
            <TabPanel value="2">
              {state.generalizedHistory ? (
                <GeneralizedHistory data={state.generalizedHistory} machine={machine} />
              ) : (
                <Box>
                  <h3>
                    Veuillez remplir les champs du filtre pour visualiser l'historique des renseignements des pièces
                  </h3>
                </Box>
              )}
            </TabPanel>
          </TabContext>
        </Box>
      </Card>
    </>
  );
};

export default Index;
