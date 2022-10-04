import {
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Typography,
  TextField,
  Checkbox,
  ListItemIcon,
  Grid,
  Divider,
  Paper,
  Alert,
  AlertTitle,
  CircularProgress,
  LinearProgress,
} from '@material-ui/core';
import NonTrgTable from './nonTrg-table';
import { Box } from '@material-ui/system';
import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Tree from './tree';
import * as yup from 'yup';
import Avatar from '@mui/material/Avatar';
import { AuthContext } from 'context/AuthContext';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import moment from 'moment';
import { toast } from 'react-toastify';
import useUserService from 'services/usersService';
import useProcessTypeService from 'services/processTypeService';
import { DesktopDatePicker, DesktopDateRangePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import useMachineService from '../../services/machineService';
import useMappingService from 'services/mappingService';
import useAnalyseService from 'services/analyseService';
import Chart from 'react-apexcharts';
import { ConfigsContext } from 'context/ConfigsContext';
import useConfigsService from 'services/configsService';
import { makeStyles } from '@material-ui/styles';
import MultiSelect from '../overtureMachine/multSelect';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';
////////////////////////// Stepper Configuration ///////////////////
////////////////////////////////////////////////////////////////////
const steps = [
  'Configuration Type de process',
  'Configuration Local et Machines',
  'Configuration période',
  'Confirmation',
];

////////////////// Items Styling /////////////////
/////////////////////////////////////////////////
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'start',
  color: theme.palette.text.secondary,
  width: '30%',
  verticalAlign: 'middle',
}));
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 300,
  },
  indeterminateColor: {
    color: '#f50057',
  },
  selectAllText: {
    fontWeight: 500,
  },
  selectedAll: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
  variant: 'menu',
};

const ConfigAnalyse = () => {
  const classes = useStyles();
  ////////////////////////
  const names = [
    {
      id: 1,
      label: 'Pertes',
    },
    {
      id: 2,
      label: 'Catégories',
    },
    {
      id: 3,
      label: 'Causes',
    },
  ];
  ////////////////////////////////////////////////////////
  //////////////////// use state /////////////////////////
  const [activeStep, setActiveStep] = useState(0);
  const [Range, setRange] = useState([null, null]);
  const [skipped, setSkipped] = useState(new Set());
  const [MachinesArray, setMachinesArray] = useState([]);
  const [mapping, setmapping] = useState([]);
  const { configs } = useContext(ConfigsContext);
  const [categories, setCategories] = useState([]);
  const [causes, setCauses] = useState([]);
  const [result, setResult] = useState([]);
  const [resultSecondTable, setResultSecondTable] = useState([]);
  const [displayTable, setDisplayTable] = useState({
    displayFirstTable: 'chart',
    displaySecondTable: 'chart2',
  });
  const [filter, setFilter] = useState({
    processType: '',
    machines: [],
    start_date: Range[0],
    end_date: Range[1],
    days: [],
    quart: '',
    matricules: [],
    type: '',
    viewType: '',
  });
  const [ids, setIds] = useState([]);
  const [lossesFilter, setLossesFilter] = useState({
    typeFirstLevel: '',
    typeSecondLevel: '',
    losses: {
      pertes: [],
      categories: [],
      causes: [],
    },
  });

  const [machineData, setMachineData] = useState([]);
  const [processTypes, setProcessTypes] = useState([]);
  const [value, setValue] = useState('1');
  const [Trg, setTrg] = React.useState('');
  const [display, setDisplay] = useState('');
  const [displayNonTrg, setDisplayNonTrg] = useState('');

  const [displayNonTrgSecondLevel, setDisplayNonTrgSecondLevel] = useState('');

  const [chartStateNonTrgSecondLevel, setChartStateNonTrgSecondLevel] = useState({
    isLoaded: false,
    series: [
      {
        name: 'Non TRG',
        data: [],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },

      noData: {
        text: 'Pas de données',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: '#F44336',
          fontSize: '14px',
        },
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: '%',
        },
      },
      fill: {
        opacity: 1,

        colors: ['#F44336', '#E91E63', '#9C27B0'],
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toFixed(2) + ' %';
          },
        },
      },
    },
  });
  const [chartState, setChartState] = useState({
    isLoaded: false,
    series: [],
    noData: {
      text: 'Pas de données',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: '#F44336',
        fontSize: '14px',
      },
    },
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: '%',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toFixed(2) + ' %';
          },
        },
      },
    },
  });

  const [chartStateNonTrg, setChartStateNonTrg] = useState({
    isLoaded: false,
    series: [
      {
        name: 'Non TRG',
        data: [],
      },
    ],
    noData: {
      text: 'Pas de données',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: '#F44336',
        fontSize: '14px',
      },
    },
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '35%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      toolbar: {
        show: true,
        tools: {
          download: false, // <== line to add
        },
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: '%',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toFixed(2) + ' %';
          },
        },
      },
    },
  });

  ////////////////// services //////////////
  //////////////////////////////////////////
  const {
    generateAnalyse,
    getAllCauses,
    getAllCategories,
    getNonTrgAnalysisFirstLevel,
    getNonTrgAnalysisSecondLevelByLoss,
    getNonTrgAnalysisSecondLevelByCategory,
  } = useAnalyseService();
  const { getAllProcessTypes } = useProcessTypeService();
  const { getAllMachines } = useMachineService();
  const { getAllMapping } = useMappingService();
  const { getAllUsers } = useUserService();
  const { users } = useContext(AuthContext);
  const { getConfigs } = useConfigsService();

  ////////////////// i18n translation //////////////////////////////
  const { t, i18n } = useTranslation();

  /////////////////  Multiple Select Perte ////////////////////////
  const [selected, setSelected] = useState([]);
  const isAllSelected = configs.length > 0 && selected.length === configs.length;

  const handleChange = (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === 'all') {
      setSelected(selected.length === configs.length ? [] : configs);
      return;
    }
    setSelected(value);
  };
  ////////////////////// set Mapping Data //////////////////////////

  const setMappingData = (node) => {
    node?.children.map((n) => {
      n.children = n.value;
      n.label = n.name;
      if (n.children?.length === 0) {
        machineData
          .filter((machine) => machine.local === n.id)
          .map((m) => (n.children = [...n.children, { label: m.code, id: m.id }]));
      } else {
        setMappingData(n);
      }
    });
  };
  ///////////////////////////////////////////////////////////////////
  const controlProps1 = (item) => ({
    checked: displayTable.displayFirstTable === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });
  const controlProps2 = (item) => ({
    checked: displayTable.displaySecondTable === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });
  ///////////////////// BEGIN Stepper Config ////////////////////

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const setdays = (day) => {
    const index = filter.days.indexOf(day);
    if (index > -1) {
      filter.days.splice(index, 1);
      setFilter(filter);
      toast.success('jour retiré');
    } else {
      filter.days.push(day);
      setFilter(filter);
      toast.success('jour ajouté');
    }
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  ///////////////////// END Stepper Config ////////////////////
  //////////////////////////// GET DATA ///////////////////////
  async function getAllData() {
    const processTypesData = await getAllProcessTypes();
    getAllUsers(1);
    setProcessTypes(processTypesData);
    const machines = await getAllMachines();
    setMachineData(machines);
    await getConfigs();
  }
  /////////////////////// useEffect ////////////////////////////
  useEffect(() => {
    getAllData();
  }, []);

  //////////////////////////// Initialize Data //////////////////
  const initializeData = () => {
    // initialize chart State
    setChartState({ ...chartState, showViz: false, series: [] });
    chartState.options.xaxis.categories = [];
    chartStateNonTrg.options.xaxis.categories = [];
    chartStateNonTrgSecondLevel.options.xaxis.categories = [];
    setChartStateNonTrg({
      ...chartStateNonTrg,
      showViz: false,
      series: [
        {
          name: 'Non TRG',
          data: [],
        },
      ],
    });

    setChartStateNonTrgSecondLevel({
      ...chartStateNonTrgSecondLevel,
      showViz: false,
      series: [
        {
          name: 'Non TRG',
          data: [],
        },
      ],
    });

    setDisplayNonTrg(0);
    setDisplayNonTrgSecondLevel('');
    setDisplay('');
  };
  /////////////////////// generate Charts //////////////////////////
  const generatecharts = async () => {
    initializeData();
    const analyseResult = await generateAnalyse(filter);
    if (analyseResult.status !== 201) {
      toast.warning('Pas de données');
    }
    // filter.type == 1 ===> display TRG charts
    if (filter.type == 1 && analyseResult?.data?.state?.length > 0) {
      if (filter.viewType == 1) {
        // display by shift
        setChartState({ ...chartState, showViz: true, series: analyseResult?.data?.state });
        chartState.options.xaxis.categories = await analyseResult?.data?.daysList.map((element) => {
          return moment(element).format('L');
        });
        setDisplay(1);
      } else if (filter.viewType == 2) {
        // display by week
        setChartState({ ...chartState, showViz: true, series: analyseResult?.data?.state });
        chartState.options.xaxis.categories = analyseResult?.data?.weeks;
        setDisplay(1);
      } else if (filter.viewType == 3) {
        // display by months
        setChartState({ ...chartState, showViz: true, series: analyseResult?.data?.state });
        chartState.options.xaxis.categories = analyseResult?.data?.months;
        setDisplay(1);
      } else {
        // display by days
        setChartState({
          ...chartState,
          showViz: true,
          series: [
            {
              name: 'TRG',
              data: analyseResult?.data?.state,
            },
          ],
        });
        chartState.options.xaxis.categories = await analyseResult?.data?.daysList.map((element) => {
          return moment(element).format('L');
        });
        setDisplay(1);
      }
    }
    // filter.type == 2 ===> display NON TRG charts
    else if (filter.type == 2 && analyseResult.data.state.length > 0) {
      if (filter.viewType == 1) {
        // display by shift
        setChartState({ ...chartState, showViz: true, series: analyseResult?.data?.state });
        chartState.options.xaxis.categories = await analyseResult?.data?.days.map((element) => {
          return moment(element).format('L');
        });
        setDisplay(2);
      } else if (filter.viewType == 2) {
        // display by week
        setChartState({ ...chartState, showViz: true, series: analyseResult?.data?.state });
        chartState.options.xaxis.categories = analyseResult?.data?.weeks;
        setDisplay(2);
      } else if (filter.viewType == 3) {
        // display by months
        setChartState({ ...chartState, series: analyseResult?.data?.state });
        chartState.options.xaxis.categories = analyseResult?.data?.months;
        setDisplay(2);
      } else {
        // display by day
        setChartState({
          ...chartState,
          showViz: true,
          series: [
            {
              name: 'TRG',
              data: analyseResult?.data?.state,
            },
          ],
        });
        chartState.options.xaxis.categories = await analyseResult?.data?.daysList.map((element) => {
          return moment(element).format('L');
        });
        setDisplay(2);
      }
    } else {
      toast.error("Une erreur est survenue lors de la génération de l'analyse");
    }
  };

  ///////////////////////////////// get Non trg Analysis first level //////////////////
  const getNonTrgAnalysis = async (type) => {
    const resultAnalyse = await getNonTrgAnalysisFirstLevel({ filter: filter, type: type });
    if (resultAnalyse?.status == 201) {
      setResult(resultAnalyse?.data?.tableOutput);
      chartStateNonTrg.series[0].data = resultAnalyse?.data?.series;
      chartStateNonTrg.options.xaxis.categories = resultAnalyse?.data?.options;
      setDisplayNonTrg(1);
    } else {
      toast.warning('Pas de données');
    }
  };
  ///////////////////////////// get Non trg analysis second level ////////////////////
  const getNonTrgAnalysisSecondLevel = async () => {
    const response = await getNonTrgAnalysisSecondLevelByLoss({ searchData: filter, perteIds: ids });
    console.log('responseee', response);
    if (response?.status == 201) {
      chartStateNonTrgSecondLevel.series[0].data = response?.data?.series;
      chartStateNonTrgSecondLevel.options.xaxis.categories = response?.data?.options;
      setResultSecondTable(response?.data?.tableOutput);
      setDisplayNonTrgSecondLevel(1);
      setIds([]);
    } else {
      toast.warning('Pas de données');
    }
  };
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};

            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>Configuration Analyse</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Annuler</Button>
            </Box>
          </React.Fragment>
        ) : activeStep === 0 ? (
          <React.Fragment>
            <Stack
              direction="row"
              spacing={1}
              margin={1}
              sx={{
                backgroundColor: 'white',
                padding: '15px',
                justifyContent: 'center',
                margin: '15px',
                borderRadius: '15px',
              }}
            >
              {/* Choose process Type */}
              <FormControl sx={{ width: '25%' }}>
                <InputLabel id="demo-simple-select-label">{t('PROCESS_TYPE.PROCESS_TYPE')}</InputLabel>
                <Select
                  name="processType"
                  id="demo-simple-select"
                  value={filter.processType}
                  onChange={(e) => {
                    setFilter({ ...filter, processType: e.target.value });
                  }}
                >
                  {processTypes?.map((row) => (
                    <MenuItem value={row.id}>{row.designation}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Choose process Type */}
            </Stack>

            <Stack direction="row" spacing={1} margin={1}>
              <Button
                color="inherit"
                size="medium"
                variant="contained"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Retour
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />

              <Button
                size="medium"
                type="submit"
                variant="contained"
                color="primary"
                onClick={async () => {
                  if (filter.processType == '') {
                    toast.info('Ajouter le type de process ');
                  } else {
                    const machineList = machineData.filter((machine) => machine.id_processType === filter.processType);
                    setMachineData(machineList);
                    const maps = await getAllMapping();
                    //setmapping(maps.data.mapping)
                    const data1 = {
                      id: 'root',
                      label: 'STELIA',
                      children: maps?.data?.mapping,
                    };
                    setMappingData(data1);
                    setmapping(data1);
                    handleNext();
                  }
                }}
              >
                {activeStep === steps.length - 1 ? 'Confirmer' : 'Suivant'}
              </Button>
            </Stack>
          </React.Fragment>
        ) : activeStep === 1 ? (
          <React.Fragment>
            <Tree machineData={machineData} setMachinesArray={setMachinesArray} machinesArray={MachinesArray} />

            <Stack direction="row" spacing={1} margin={1}>
              <Button
                color="inherit"
                size="medium"
                variant="contained"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Retour
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button
                size="medium"
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => {
                  setFilter({ ...filter, machines: MachinesArray });
                  if (MachinesArray.length == 0) {
                    toast.info('Ajouter Machines');
                  } else {
                    handleNext();
                  }
                }}
              >
                {activeStep === steps.length - 1 ? 'Confirmer' : 'Suivant'}
              </Button>
            </Stack>
          </React.Fragment>
        ) : activeStep === 2 ? (
          <React.Fragment>
            <Box
              sx={{
                backgroundColor: 'white',
                padding: '15px',
                justifyContent: 'center',
                margin: '15px',
                borderRadius: '15px',
              }}
            >
              <Stack direction="row" spacing={2} margin={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDateRangePicker
                    startText="Période de"
                    inputFormat="dd/MM/yyyy"
                    endText="à"
                    value={Range}
                    onChange={(newValue) => {
                      if (!newValue[0] || !newValue[1]) return;
                      setRange(newValue);
                      setFilter({
                        ...filter,
                        start_date: new Date(newValue[0]).toISOString(),
                        end_date: new Date(newValue[1]).toISOString(),
                      });
                    }}
                    renderInput={(startProps, endProps) => (
                      <React.Fragment>
                        <Box sx={{ mx: 2 }}> </Box>
                        <TextField {...startProps} />
                        <Box sx={{ mx: 2 }}> à </Box>
                        <TextField {...endProps} />
                      </React.Fragment>
                    )}
                  />
                </LocalizationProvider>
              </Stack>
              <Stack direction="row" spacing={2} margin={2}>
                <div className="Monday" style={{ margin: 10 }}>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => {
                      setdays('Monday');
                    }}
                  >
                    <Avatar
                      sx={{ bgcolor: filter.days.indexOf('Monday') == -1 ? '#8D969D' : '#2196f3', color: 'white' }}
                    >
                      L
                    </Avatar>
                  </IconButton>
                </div>
                <div className="Tuesday" style={{ margin: 10 }}>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => {
                      setdays('Tuesday');
                    }}
                  >
                    <Avatar
                      sx={{ bgcolor: filter.days.indexOf('Tuesday') == -1 ? '#8D969D' : '#2196f3', color: 'white' }}
                    >
                      M
                    </Avatar>
                  </IconButton>
                </div>
                <div className="Wednesday" style={{ margin: 10 }}>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => {
                      setdays('Wednesday');
                    }}
                  >
                    <Avatar
                      sx={{ bgcolor: filter.days.indexOf('Wednesday') == -1 ? '#8D969D' : '#2196f3', color: 'white' }}
                    >
                      ME
                    </Avatar>
                  </IconButton>
                </div>
                <div className="Thursday" style={{ margin: 10 }}>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => {
                      setdays('Thursday');
                    }}
                  >
                    <Avatar
                      sx={{ bgcolor: filter.days.indexOf('Thursday') == -1 ? '#8D969D' : '#2196f3', color: 'white' }}
                    >
                      J
                    </Avatar>
                  </IconButton>
                </div>
                <div
                  className="Friday"
                  style={{ margin: 10 }}
                  onClick={() => {
                    setdays('Friday');
                  }}
                >
                  <IconButton aria-label="delete" size="small">
                    <Avatar
                      sx={{ bgcolor: filter.days.indexOf('Friday') == -1 ? '#8D969D' : '#2196f3', color: 'white' }}
                    >
                      V
                    </Avatar>
                  </IconButton>
                </div>
                <div className="Saturday" style={{ margin: 10 }}>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => {
                      setdays('Saturday');
                    }}
                  >
                    <Avatar
                      sx={{ bgcolor: filter.days.indexOf('Saturday') == -1 ? '#8D969D' : '#2196f3', color: 'white' }}
                    >
                      S
                    </Avatar>
                  </IconButton>
                </div>
                <div
                  className="dimanche"
                  style={{ margin: 10 }}
                  onClick={() => {
                    setdays('Sunday');
                  }}
                >
                  <IconButton aria-label="delete" size="small">
                    <Avatar
                      sx={{ bgcolor: filter.days.indexOf('Sunday') == -1 ? '#8D969D' : '#2196f3', color: 'white' }}
                    >
                      D
                    </Avatar>
                  </IconButton>
                </div>
              </Stack>
              <Stack direction="row" spacing={2} margin={2}>
                <div style={{ width: '40%', paddingBottom: 5 }}>
                  <FormLabel component="legend"> Liste des compagnons : </FormLabel>
                  <MultiSelect
                    data={users.map((name) => ({
                      value: name.matricule,
                      label: name.firstName + '' + name.lastName,
                      ...names,
                    }))}
                    onChange={(values) => {
                      console.log('matriculess', values);
                      setFilter({ ...filter, matricules: [...filter.matricules, values[values.length - 1].value] });
                    }}
                  />
                </div>
              </Stack>
            </Box>
            <Stack direction="row" spacing={1} margin={1}>
              <Button
                color="inherit"
                size="medium"
                variant="contained"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Retour
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button
                size="medium"
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => {
                  if (filter.start_date == null || filter.end_date == null) {
                    toast.info('Insérer la période');
                  } else if (filter.days.length == 0) {
                    toast.info('Insérer les jours ');
                  } else if (filter.matricules.length == 0) {
                    toast.info('Ajouter un opérateur');
                  } else {
                    handleNext();
                  }
                }}
              >
                {activeStep === steps.length - 1 ? 'Confirmer' : 'Suivant'}
              </Button>
            </Stack>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Box
              sx={{
                backgroundColor: 'white',
                padding: '15px',
                justifyContent: 'center',
                margin: '15px',
                borderRadius: '15px',
              }}
            >
              <Stack direction="row" spacing={1} margin={1}>
                <FormControl component="legend" variant="standard">
                  <FormLabel component="legend">Visualiser par : </FormLabel>
                  <RadioGroup
                    aria-label="quiz"
                    name="quiz"
                    //value={value}
                    onChange={(event) => {
                      setFilter({ ...filter, viewType: event.target.value });
                    }}
                  >
                    <Stack direction="row">
                      <FormControlLabel value={1} control={<Radio />} label="Shift" />
                      <FormControlLabel value={4} control={<Radio />} label="Jour" />
                      <FormControlLabel value={2} control={<Radio />} label="semaine" />
                      <FormControlLabel value={3} control={<Radio />} label="Mois" />
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={1} margin={1}>
                <FormControl component="legend">
                  <FormLabel component="legend">Configuration: </FormLabel>
                  <RadioGroup
                    aria-label="quiz"
                    name="quiz"
                    //value={value}
                    onChange={(event) => {
                      setTrg(event.target.value);
                      setFilter({ ...filter, type: event.target.value });
                    }}
                  >
                    <FormControlLabel value="1" control={<Radio />} label="TRG" />
                    <FormControlLabel value="2" control={<Radio />} label="NON TRG" />
                  </RadioGroup>
                </FormControl>
              </Stack>

              <Stack direction="row" spacing={1} margin={1}>
                <Button
                  color="inherit"
                  size="medium"
                  variant="contained"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Retour
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />

                <Button
                  size="medium"
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (filter.type == '') {
                      toast.info("Veuillez choisir le type d'analyse");
                    } else {
                      generatecharts();
                    }
                  }}
                >
                  {activeStep === steps.length - 1 ? 'Confirmer' : 'Suivant'}
                </Button>
              </Stack>
            </Box>
          </React.Fragment>
        )}
      </Box>

      <Card sx={{ marginTop: '20px' }}>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          {display === 1 ? (
            // if display === 1 => display trg charts
            <React.Fragment>
              {chartState.showViz ? (
                <Chart options={chartState.options} series={chartState.series} type="bar" height={300} />
              ) : (
                <LinearProgress />
              )}
            </React.Fragment>
          ) : display === 2 ? (
            // else display non trg charts
            <React.Fragment>
              <Stack direction="row" spacing={1} margin={1}>
                <FormControl sx={{ width: '25%' }}>
                  <InputLabel id="demo-simple-select-label">Visualiser par :</InputLabel>
                  <Select
                    name="names"
                    id="demo-simple-select"
                    value={lossesFilter.typeFirstLevel}
                    onChange={async (e) => {
                      setDisplayNonTrg(0);
                      lossesFilter.typeFirstLevel = e.target.value;
                      setDisplayNonTrgSecondLevel('');
                      setLossesFilter({ ...lossesFilter, typeFirstLevel: e.target.value });
                      // display charts by pertes
                      if (lossesFilter.typeFirstLevel === 1) {
                        getConfigs();
                        getNonTrgAnalysis(1);

                        // display by category
                      } else if (lossesFilter.typeFirstLevel === 2) {
                        const data = await getAllCategories();
                        setCategories(data);
                        getNonTrgAnalysis(2);
                        setDisplayNonTrgSecondLevel('');
                        // display by causes
                      } else if (lossesFilter.typeFirstLevel === 3) {
                        const data = await getAllCauses();
                        setCauses(data);
                        getNonTrgAnalysis(3);
                        setDisplayNonTrgSecondLevel('');
                      }
                    }}
                  >
                    {names?.map((row) => (
                      <MenuItem value={row.id}>{row.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                margin={1}
                sx={{ width: '100%' }}
                divider={<Divider orientation="vertical" flexItem />}
                justifyContent="center"
                alignItems="center"
              >
                {lossesFilter.typeFirstLevel === 1 ? (
                  <>
                    <Item sx={{ textAlign: 'center' }}>
                      <FormLabel component="legend">Les pertes : </FormLabel>
                    </Item>
                    <Item>
                      <MultiSelect
                        data={configs.map((name) => ({ value: name.id, label: name.label, ...configs }))}
                        onChange={async (values) => {
                          setIds([...ids, values[values.length - 1].value]);
                        }}
                      />
                    </Item>
                    <Item>
                      <Button variant="outlined" startIcon={<CheckCircleIcon />} onClick={getNonTrgAnalysisSecondLevel}>
                        Valider
                      </Button>
                    </Item>
                  </>
                ) : (
                  ''
                )}
                {lossesFilter.typeFirstLevel === 2 ? (
                  <>
                    <Item sx={{ textAlign: 'center' }}>
                      <FormLabel component="legend">Les catégories : </FormLabel>
                    </Item>
                    <Item>
                      <MultiSelect
                        data={categories.map((name) => ({ value: name.id, label: name.designation, ...categories }))}
                        onChange={async (values) => {
                          setIds([...ids, values[values.length - 1].value]);
                        }}
                      />
                    </Item>
                    <Item>
                      <Button
                        variant="outlined"
                        startIcon={<CheckCircleIcon />}
                        onClick={async () => {
                          const response = await getNonTrgAnalysisSecondLevelByCategory({
                            searchData: filter,
                            cetogoIds: ids,
                          });
                          if (response.status == 201) {
                            chartStateNonTrgSecondLevel.series[0].data = response?.data?.series;
                            chartStateNonTrgSecondLevel.options.xaxis.categories = response?.data?.options;
                            setResultSecondTable(response?.data?.tableOutput);
                            setDisplayNonTrgSecondLevel(1);
                          } else {
                            toast.warning('Pas de données !');
                          }
                        }}
                      >
                        Valider
                      </Button>
                    </Item>
                  </>
                ) : (
                  ''
                )}
              </Stack>

              <Chart options={chartState.options} series={chartState.series} type="bar" height={300} />
              {/* : <Alert severity="error">
                  <AlertTitle>Avertissement</AlertTitle>
                  Pas de données — <strong>Veuillez renseigner !</strong>
                </Alert> */}

              {displayNonTrg == 1 ? (
                <>
                  <Stack direction="row" sx={{ width: '100%' }} spacing={1} margin={2}>
                    <Grid container>
                      <Grid item lg={6}>
                        <Item sx={{ width: '100%' }}>
                          <FormControl component="fieldset">
                            <RadioGroup
                              aria-label="gender"
                              value={value}
                              onChange={(event) =>
                                setDisplayTable({ ...displayTable, displayFirstTable: event.target.value })
                              }
                            >
                              <FormControlLabel
                                value="chart"
                                control={<Radio {...controlProps1('chart')} />}
                                label="Chart"
                              />
                              <FormControlLabel
                                value="tab"
                                control={<Radio {...controlProps1('tab')} />}
                                label="Tableau"
                              />
                            </RadioGroup>
                          </FormControl>
                          {displayTable.displayFirstTable == 'tab' ? (
                            <NonTrgTable data={result} />
                          ) : (
                            <Chart
                              options={chartStateNonTrg.options}
                              series={chartStateNonTrg.series}
                              type="bar"
                              height={300}
                            />
                          )}
                        </Item>
                      </Grid>
                      {displayNonTrgSecondLevel === 1 ? (
                        <Grid item lg={6}>
                          <Item sx={{ width: '85%' }}>
                            <FormControl component="fieldset">
                              <RadioGroup
                                aria-label="gender"
                                value={value}
                                onChange={(event) =>
                                  setDisplayTable({ ...displayTable, displaySecondTable: event.target.value })
                                }
                              >
                                <FormControlLabel
                                  value="chart2"
                                  control={<Radio {...controlProps2('chart2')} />}
                                  label="Chart"
                                />
                                <FormControlLabel
                                  value="tab2"
                                  control={<Radio {...controlProps2('tab2')} />}
                                  label="Tableau"
                                />
                              </RadioGroup>
                            </FormControl>
                            {displayTable.displaySecondTable == 'tab2' && resultSecondTable ? (
                              <NonTrgTable data={resultSecondTable} />
                            ) : (
                              <Chart
                                options={chartStateNonTrgSecondLevel.options}
                                series={chartStateNonTrgSecondLevel.series}
                                type="bar"
                                height={300}
                              />
                            )}
                          </Item>
                        </Grid>
                      ) : (
                        <Grid item lg={6}>
                          <Item sx={{ width: '100%' }}></Item>
                        </Grid>
                      )}
                    </Grid>
                  </Stack>

                  {/* <Stack direction="row" sx={{ width: '100%' }}>
                    <NonTrgTable data={result} />
                  </Stack> */}
                </>
              ) : (
                ''
              )}
            </React.Fragment>
          ) : (
            ''
          )}
        </Box>
      </Card>
    </>
  );
};

export default ConfigAnalyse;
