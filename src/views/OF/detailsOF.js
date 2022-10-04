import { Button, Chip, Grid, InputLabel, Stack } from '@material-ui/core';
import { Box } from '@material-ui/system';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useProcessTypeService from 'services/processTypeService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 7,
  width: '70%',
  maxWidth: '100vw',
  maxHeight: '85%',
  pt: 1,
  px: 4,
  pb: 2,
};
const DetailsOF = ({ data, callback }) => {
  ///////////////////////////// services /////////////////////////////
  ////////////////////////////////////////////////////////////////////
  const { getAllProcessTypes } = useProcessTypeService();

  ///////////////////////////// use state /////////////////////////////
  ////////////////////////////////////////////////////////////////////
  const { t, i18n } = useTranslation();
  const [processTypeData, setProcessTypedata] = useState([]);

  async function getAllData() {
    const processTypeData = await getAllProcessTypes();
    setProcessTypedata(processTypeData);
  }

  useEffect(() => {
    getAllData();
  }, []);
  return (
    <>
      <Box
        sx={{
          ...style,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center" margin={1}>
          <h3>{t('OF.OF_DETAILS')}</h3>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="center">
          <Grid container spacing={2} lg={12}>
            <Grid item lg={6}>
              <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('OF.OF')} : </InputLabel>
            </Grid>

            <Grid item lg={6}>
              <InputLabel>{data.of}</InputLabel>
            </Grid>

            <Grid item lg={6}>
              <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('PROCESS_TYPE.PROCESS_TYPE')} :</InputLabel>
            </Grid>

            <Grid item lg={6}>
              <InputLabel>
                {processTypeData ? processTypeData?.find((p) => p.id === data.processTypeId)?.designation : ''}
              </InputLabel>
            </Grid>

            <Grid item lg={6}>
              <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('OF.ARTICLE_CODE')} :</InputLabel>
            </Grid>

            <Grid item lg={6}>
              <InputLabel>{data.articleCode}</InputLabel>
            </Grid>
            <Grid item lg={6}>
              <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('OF.DESIGNATION_ARTICLE')} :</InputLabel>
            </Grid>
            <Grid item lg={6}>
              <InputLabel>{data.designation}</InputLabel>
            </Grid>

            <Grid item lg={6}>
              <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('GENERAL.MACHINE')} :</InputLabel>
            </Grid>
            <Grid item lg={6}>
              <InputLabel>{data.machine}</InputLabel>
            </Grid>

            <Grid item lg={6}>
              <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('OF.DURATION_OF')} :</InputLabel>
            </Grid>
            <Grid item lg={6}>
              <InputLabel>{data.duration} H</InputLabel>
            </Grid>

            <Grid item lg={6}>
              <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('OF.QUANTITY')} :</InputLabel>
            </Grid>
            <Grid item lg={6}>
              <InputLabel>{data.quantity} PCS</InputLabel>
            </Grid>

            <Grid item lg={6}>
              <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('GENERAL.STATUS')} :</InputLabel>
            </Grid>
            <Grid item lg={6}>
              {data.status === 3 ? (
                <Chip label="A faire" color="secondary" />
              ) : data.status === 1 ? (
                <Chip label="Terminé" color="success" />
              ) : data.status === 4 ? (
                <Chip label="Bloqué" color="error" />
              ) : (
                <Chip label="En cours" color="warning" />
              )}
            </Grid>

            <Grid item lg={12}>
              <Box sx={{ '& button': { m: 1 }, display: 'flex', justifyContent: 'end' }}>
                <Button variant="contained" color="error" size="medium" margin={1} onClick={() => callback()}>
                  {t('GENERAL.BACK')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
};

export default DetailsOF;
