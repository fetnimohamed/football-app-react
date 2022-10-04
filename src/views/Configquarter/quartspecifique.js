import { Grid, Stack } from '@material-ui/core';
import React from 'react';
import { useState, useEffect } from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import useQuartService from '../../services/quart.service';
import useProcessService from '../../services/processTypeService';
const Quartspecifique = () => {
  const [ProcessType, setProcessType] = useState([]);
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

  const { addquart } = useQuartService();
  const { getAllProcessTypes } = useProcessService();
  useEffect(async () => {
    const res = await getAllProcessTypes();
    setProcessType(res);
  }, []);

  const handleChangeprosess = (event) => {
    setquartdata({ ...quartdata, ['Process_type_id']: event.target.value });
    console.log(quartdata);
  };
  return (
    <Grid container spacing={5}>
      <Stack direction="row" spacing={2}>
        <FormControl sx={{ m: 1, minWidth: 100 }}>
          <InputLabel id="demo-simple-select-helper-label">Type de prosess</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            label="Age"
            onChange={handleChangeprosess}
          >
            <MenuItem value=""></MenuItem>
            {ProcessType?.map((prosess) => (
              <MenuItem value={prosess.id}>{prosess.designation}</MenuItem>
            ))}
          </Select>
          <FormHelperText>Ajouter type process</FormHelperText>
        </FormControl>
      </Stack>
    </Grid>
  );
};

export default Quartspecifique;
