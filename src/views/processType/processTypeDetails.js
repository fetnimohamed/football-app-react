import { Button, Chip, Grid, InputLabel, ListItem, Paper, Stack } from '@material-ui/core';
import { Box } from '@material-ui/system';
import MuiTypography from '@material-ui/core/Typography';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 7,
  width: '40%',
  maxWidth: '100vw',
  pt: 1,
  px: 4,
  pb: 2,
};

const ProcessTypeDetails = ({ data, callback }) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Box
        sx={{
          ...style,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center" margin={1}>
          <h3>{t('PROCESS_TYPE.PROCESS_TYPE_DETAILS')}</h3>
        </Stack>
        <Grid container spacing={2} lg={12}>
          <Grid item lg={4}>
            <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('GENERAL.CODE')} : </InputLabel>
          </Grid>
          <Grid item lg={8}>
            <InputLabel>{data.code_processType}</InputLabel>
          </Grid>

          <Grid item lg={4}>
            <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('GENERAL.DESIGNATION')} : </InputLabel>
          </Grid>
          <Grid item lg={8}>
            <InputLabel>{data.designation}</InputLabel>
          </Grid>

          <Grid item lg={4}>
            <InputLabel sx={{ fontWeight: 500, color: '#616161' }}>{t('PROCESS_TYPE.ATTRIBUTES_LISTE')} : </InputLabel>
          </Grid>
          <Grid item lg={8}>
            {data.attributes.map((data) => (
              <listItem>
                <Chip sx={{ margin: 0.5 }} label={data} />
              </listItem>
            ))}
          </Grid>
        </Grid>

        <Box sx={{ '& button': { m: 1 }, display: 'flex', justifyContent: 'end' }}>
          <Button variant="contained" color="error" size="small" margin={1} onClick={() => callback()}>
            {t('GENERAL.BACK')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ProcessTypeDetails;
