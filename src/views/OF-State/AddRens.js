import { Button, OutlinedInput, Paper, Typography } from '@material-ui/core';
import { Box } from '@material-ui/system';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Stack, TextField, Modal } from '@material-ui/core';
import useProcessTypeService from 'services/processTypeService';
import useMachineService from '../../services/machineService';
import useOfService from 'services/ofService';

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DesktopDatePicker } from '@mui/lab';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import moment from 'moment';
import { toast } from 'react-toastify';
import jwtDecode from 'jwt-decode';
import { ArrowForwardIosTwoTone } from '@mui/icons-material';
export default function ADDRENS({ data }) {
  ///getting data
  const { getAllProcessTypes } = useProcessTypeService();
  const { getAllMachines } = useMachineService();
  const { getCorrectionData, editOF, getOFById, getAllOfByMachine } = useOfService();

  async function getAllData() {
    const processTypesData = await getAllProcessTypes();

    setProcessTypes(processTypesData);
    const machines = await getAllMachines();
    setMachines(machines);
  }
  //styled
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
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        },
      },
    },
    focused: {},
    notchedOutline: {},
  }));
  //use effect
  useEffect(async () => {
    const token = JSON.parse(localStorage.getItem('userData')).token;
    console.log('token', token);
    setUser(jwtDecode(token));
    await getAllData();
  }, []);
  //styling
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const { t, i18n } = useTranslation();
  ///use state
  const [anchorEl4, setAnchorEl4] = React.useState(null);
  const openEditValue = Boolean(anchorEl4);
  const [user, setUser] = useState({});
  const [openModal, setOpenModal] = useState(false);
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
  const openEdit = (event) => {
    setAnchorEl4(event.currentTarget);
  };
  const closeEdit = () => {
    setAnchorEl4(null);
  };
  return (
    <>
      <Button
        disableElevation
        size="small"
        type="submit"
        variant="contained"
        color="primary"
        onClick={(e) => {
          //  setOpenModal(true)
          openEdit(e);
        }}
      >
        Ajouter renseignement
      </Button>
      <StyledMenu anchorEl={anchorEl4} open={openEditValue} onClose={closeEdit}>
        <Formik
          initialValues={filter}
          validationSchema={yup.object().shape({
            processType: yup.string().required('Ce champs est obligatoire !'),
            machine: yup.string().required(t('TOAST.REQUIRED')),
            date: yup.string().required(t('TOAST.REQUIRED')),
            quart: yup.string().required(t('TOAST.REQUIRD')),
          })}
        >
          {({ values, errors, isSubmitting, handleChange, handleBlur, touched }) => (
            <Form>
              <Stack direction="row" spacing={1} margin={1}>
                {/* ////////////////////////// BEGIN PROCESS TYPE LIST /////////////////////// */}
                <FormControl style={{ width: 250 }}>
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
                <FormControl style={{ width: 250 }}>
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
                <FormControl sx={{ m: 1, width: 250 }}>
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
                <FormControl style={{ width: 250 }}>
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
                {/* ///////////////////////////////quantity////////////////////////////// */}
                <FormControl style={{ width: 250 }}>
                  <InputLabel id="demo-simple-select-label">type de renseignement</InputLabel>
                  <Select
                    name="code"
                    id="demo-simple-select"
                    value={values.code}
                    onChange={(e) => {
                      values.code = e.target.value;
                      setfilter({ ...filter, ['code']: e.target.value });
                    }}
                  >
                    {/* // 1 => pBonnes , 2 => pRetouches, 3 => prebutes, 4 => pattenteDQ */}
                    <MenuItem value="1">Bonne</MenuItem>
                    <MenuItem value="2">Retouche</MenuItem>
                    <MenuItem value="3">rebutes</MenuItem>
                    {/* <MenuItem value="4">Nuit</MenuItem> */}
                  </Select>
                </FormControl>
                {/* ///////////////////////////////quantity////////////////////////////// */}
                <FormControl style={{ width: 250 }}>
                  <InputLabel id="quantity">Quantité</InputLabel>
                  <OutlinedInput
                    id="quantity"
                    name="quantity"
                    type="number"
                    // label="Quantité"
                    value={values.quantity}
                    onChange={(e) => {
                      values.quantity = e.target.value;
                      setfilter({ ...filter, ['quantity']: Number(e.target.value) });
                    }}
                  />
                </FormControl>
                {/* ////////////////////////// BEGIN BUTTON /////////////////////// */}
                <Button
                  onClick={async () => {
                    console.log(filter);
                    console.log('user', data);
                    const quartCode = filter.quart + moment(filter.date).format('DDMMYYYY');

                    //check taille de lot
                    const response = await editOF(
                      {
                        code: filter.code,
                        quantity: filter.quantity,
                        editTime: Date.now(),
                        of: data[0].of,
                        matricule: user.matricule,
                        articleCode: data[0].articleCode,
                        quartCode: quartCode,
                      },
                      filter.machine,
                    );
                    console.log('response', response.data.status);
                    if (response.data.status === 201) closeEdit();
                  }}
                  variant="contained"
                  color="primary"
                >
                  Ajouter
                </Button>
                {/* ////////////////////////// END BUTTON /////////////////////// */}
              </Stack>
            </Form>
          )}
        </Formik>
      </StyledMenu>
    </>
  );
}
