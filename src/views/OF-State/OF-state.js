import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  Stack,
  TextField,
} from '@material-ui/core';
import { Box } from '@material-ui/system';
import { DesktopDateRangePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { useFormik } from 'formik';
import * as yup from 'yup';
import OFStateList from './OF-stateList';
import useOfService from 'services/ofService';
import useProcessTypeService from 'services/processTypeService';
import { toast } from 'react-toastify';

const OfState = () => {
  //////////////////////// use State //////////////////
  const [value, setValue] = useState([null, null]);
  const [state, setState] = useState([]);
  const [displayTable, setDisplayTable] = useState(false);
  const [processTypes, setProcessTypes] = useState([]);
  const [filter, setFilter] = useState({
    processType: '',
    dateArticle: [null, null],
    dateStatus: [null, null],
    article: '',
    state: '',
    of: '',
  });
  const [displayFilter, setDisplayFilter] = useState('');
  const [selectedValue, setSelectedValue] = React.useState('a');

  const handleChange = (event) => {
    console.log(event.target.value);
    setSelectedValue(event.target.value);
  };
  /////////////////////// services  //////////////////
  const { getOFByState } = useOfService();
  const { getAllProcessTypes } = useProcessTypeService();
  ////////////////////// get Data ////////////////////
  const getData = async () => {
    const data = await getAllProcessTypes();
    setProcessTypes(data);
  };
  ////////////////////// useEffect ////////////////////
  useEffect(() => {
    getData();
  }, []);

  //////////////////// search Data //////////////////
  const searchData = async () => {
    // search Data

    //////////// validate filter
    if (selectedValue == '1' && filter.of == '') {
      // filter par OF
      toast.error('Le champ OF est obligatoire !');
      return;
    } else if (
      selectedValue == '2' &&
      (filter.article == '' || filter.dateArticle[1] == null || filter.dateArticle[0] == null)
    ) {
      toast.error('Les champs du filtre sont obligatoires !');
      return;
    } else if (
      selectedValue == '3' &&
      (filter.state == '' || filter.dateStatus[1] == null || filter.dateStatus[0] == null)
    ) {
      toast.error('Les champs du filtre sont obligatoires !');
      return;
    } else if (selectedValue == '') {
      toast.error('Veuillez remplir les champs du filtre pour visualiser les états des OFs');
    }
    /////////// get data
    else {
      filter.selectedValue = selectedValue;
      const data = await getOFByState(filter);
      console.log('dataaaaa STATE', data);
      if (data.data.status == 201) {
        if (data.data.ofState.globalOFState && data.data.ofState.globalOFState.length > 0) {
          setState(data.data.ofState);
          setDisplayTable(true);
        } else {
          toast.warning('Pas de données');
        }
      } else {
        toast.error('Error lors du chargement des données');
      }
    }
  };
  return (
    <>
      {/* /////////////////////////////// Begin Filter ////////////////////   */}
      <Box
        sx={{
          width: '100%',
          bgcolor: 'white',
          boxShadow: 3,
          borderRadius: 3,
          padding: '20px',
          marginBottom: 5,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} margin={1}>
          <FormControl style={{ width: '30%' }}>
            <InputLabel id="demo-simple-select-label">Type de process</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              onChange={(e) => {
                setFilter({ ...filter, processType: e.target.value });
              }}
            >
              {processTypes.map((processType) => (
                <MenuItem value={processType.id}>{processType.designation}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={1} margin={2}>
          <Radio
            checked={selectedValue == '1'}
            onChange={handleChange}
            value={1}
            name="radio-buttons"
            inputProps={{ 'aria-label': 'A' }}
          />
          <FormControl style={{ width: '25%' }}>
            <InputLabel htmlFor="outlined-adornment-code-process">OF</InputLabel>
            <OutlinedInput
              id="outlined-adornment-code-process"
              type="text"
              name="of"
              label="OF"
              disabled={selectedValue !== '1' ? true : false}
              value={filter.of}
              onChange={(event) => {
                setFilter({ ...filter, of: event.target.value });
              }}
            />
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={1} margin={2}>
          <Radio
            checked={selectedValue == '2'}
            onChange={handleChange}
            value={2}
            name="radio-buttons"
            inputProps={{ 'aria-label': 'A' }}
          />
          <FormControl style={{ width: '30%' }}>
            <InputLabel htmlFor="outlined-adornment-code-process">Article</InputLabel>
            <OutlinedInput
              id="article"
              type="text"
              name="article"
              label="Article"
              disabled={selectedValue !== '2' ? true : false}
              value={filter.article}
              onChange={(event) => {
                setFilter({ ...filter, article: event.target.value });
              }}
            />
          </FormControl>

          <FormControl style={{ width: '50%' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={1}>
                <DesktopDateRangePicker
                  startText="Période de"
                  inputFormat="dd/MM/yyyy"
                  endText="à"
                  id="value"
                  name="value"
                  disabled={selectedValue !== '2' ? true : false}
                  value={filter.dateArticle}
                  onChange={(event) => {
                    setFilter({ ...filter, dateArticle: event });
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
              </Stack>
            </LocalizationProvider>
          </FormControl>
          {/* ////////////////////////// BEGIN BUTTON /////////////////////// */}

          {/* ////////////////////////// END BUTTON /////////////////////// */}
        </Stack>

        <Stack direction="row" spacing={1} margin={2}>
          <Radio
            checked={selectedValue == '3'}
            onChange={handleChange}
            value={3}
            name="radio-buttons"
            inputProps={{ 'aria-label': 'A' }}
          />
          <FormControl style={{ width: '30%' }}>
            <InputLabel id="demo-simple-select-label">Etat</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="state"
              label="Etat"
              name="state"
              disabled={selectedValue !== '3' ? true : false}
              value={filter.state}
              onChange={(event) => {
                setFilter({ ...filter, state: event.target.value });
              }}
            >
              <MenuItem value={3}>Non Traité</MenuItem>
              <MenuItem value={2}>En cours</MenuItem>
              <MenuItem value={4}>Bloqué</MenuItem>
              <MenuItem value={1}>Cloturé</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={{ height: 'auto', width: '50%' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={1}>
                <DesktopDateRangePicker
                  startText="Période de"
                  inputFormat="dd/MM/yyyy"
                  endText="à"
                  id="value"
                  name="value"
                  disabled={selectedValue !== '3' ? true : false}
                  value={filter.dateStatus}
                  onChange={(newValue) => {
                    console.log('event', newValue);
                    setFilter({ ...filter, dateStatus: newValue });
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
              </Stack>
            </LocalizationProvider>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={1} margin={1} justifyContent="end">
          <Button size="sm" type="submit" variant="contained" color="primary" onClick={searchData}>
            <SearchIcon />
            Rechercher
          </Button>
        </Stack>
      </Box>
      {/* ///////////////////////////// End Filter /////////////////////// */}

      {/* Begin List */}
      <OFStateList state={state} displayTable={displayTable} getData={searchData} />
      {/* End List */}
    </>
  );
};

export default OfState;
