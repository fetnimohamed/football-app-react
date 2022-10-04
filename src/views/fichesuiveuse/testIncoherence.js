import { Button, Grid, Modal, Stack } from '@material-ui/core';
import { Box } from '@material-ui/system';
import React, { useEffect, useContext, useState } from 'react';
import useFicheSuiveuseService from 'services/ficheSuiveuseService';
import { Typography } from '@mui/material';
import moment from 'moment';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'white',
  boxShadow: 24,
  borderRadius: 7,
  width: '30%',
  maxWidth: '100vw',
  pt: 2,
  px: 2,
  pb: 2,
};
const TestIncoherence = ({ data }) => {
  //////////////////////////////// use state ///////////////////////////
  const [openModal, setOpenModal] = useState();
  const [openTRGModal, setOpenTRGModal] = useState();
  const [testIncoherence, setTestIncoherence] = useState();
  const [state, setState] = useState({
    trgValue: 0,
    nonTrgValue: 0,
    margin: 0,
  });
  const { testInCoherence, getTrgValue, getNonTrgValue, getcoherence } = useFicheSuiveuseService();

  ////////////////////////////// test incoherence /////////////////////
  /// return incoherence margin => 100 - ( non trg value + trg value )
  const getTestIncoherence = async () => {
    const testIncoherence = await testInCoherence(data);
    setTestIncoherence(testIncoherence);
  };

  ////////////////////////// get Trg and non trg Value ////////////////

  const getTrgAndNonTrgValues = async () => {
    console.log(data);
    const trgValue = await getTrgValue(data);
    const nonTrgValue = await getNonTrgValue(data);
    const margin = await getcoherence(data.machine);
    setState({ ...state, trgValue: trgValue, nonTrgValue: nonTrgValue, margin: margin });
  };

  useEffect(() => {}, []);
  return (
    <>
      <Stack direction="row" spacing={2} margin={2}>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: 5 }}
          onClick={async () => {
            setOpenModal(true);
            getTrgAndNonTrgValues();
          }}
        >
          TRG-Test incohérence %
        </Button>
      </Stack>
      <Modal open={openModal}>
        <Box
          sx={{
            ...style,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="center" margin={2} spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h4">Temps restant</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4">{data.restant}</Typography>
            </Grid>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="center" margin={2} spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h4">TRG</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4">{state?.trgValue?.toFixed(2)}%</Typography>
            </Grid>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="center" margin={2} spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h4">NON-TRG</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4">{state?.nonTrgValue?.nonTrgGlobalValue?.toFixed(2)}%</Typography>
            </Grid>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="center" margin={2} spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h4">Taux incohérence</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4">
                {(100 - (Number(state?.trgValue) + Number(state?.nonTrgValue?.nonTrgGlobalValue)))?.toFixed(2)}%
              </Typography>
            </Grid>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="center" margin={2} spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h4">Seuil modèle</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4">{state?.margin}%</Typography>
            </Grid>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="center" margin={2} spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h4">Dernière modification</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4">{moment(Date.now()).format('lll')}</Typography>
            </Grid>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="center" margin={2}>
            <Button variant="outlined" color="info" style={{ margin: 5 }} onClick={() => setOpenModal(false)}>
              OK
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={openTRGModal}>
        <Box
          sx={{
            ...style,
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="center" margin={2} spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h4">Temps restant</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4">{data.restant}</Typography>
            </Grid>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="center" margin={2} spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h4">Taux incohérence</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4">
                {(100 - (Number(state?.trgValue) + Number(state?.nonTrgValue?.nonTrgGlobalValue)))?.toFixed(2)}%
              </Typography>
            </Grid>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="center" margin={2}>
            <Grid item xs={6}>
              <Typography variant="h4">Dernière modification</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4">{moment(Date.now()).format('lll')}</Typography>
            </Grid>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="center" margin={2}>
            <Button variant="outlined" color="info" style={{ margin: 5 }} onClick={() => setOpenTRGModal(false)}>
              OK
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default TestIncoherence;
