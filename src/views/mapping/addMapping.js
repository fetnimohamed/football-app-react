import { Button, Stack, Grid, TextField, Select, MenuItem } from '@material-ui/core';

import React, { useEffect, useState } from 'react';

import { Box } from '@material-ui/system';

import '@pathofdev/react-tag-input/build/index.css';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const AddMapping = ({ addNodeModal, setAddNodeModal, editMappingNameById, levels, treeData, addMappingToId }) => {
  const [data, setData] = useState({});

  const [treeArray, setTreeArray] = useState([]);
  const { t, i18n } = useTranslation();
  // NODE DATA FROM PROPS

  useEffect(() => {
    addNodeModal.name = '';
    addNodeModal.designation = '';
    addNodeModal.objectif = '';
    setData(addNodeModal);
  }, []);

  const mapTreeToArray = (treeData, i, arr) => {
    if (treeData)
      treeData.map((item) => {
        arr.push({
          niveau: i,
          name: item.name,
          id: item.id,
        });
        mapTreeToArray(item.value, i + 1, arr);
      });
  };

  // GET ALL LEVELS FROM THE TREE
  useEffect(() => {
    const arr = [];

    mapTreeToArray(treeData?.value, 1, arr);

    arr.sort((a, b) => (a.niveau > b.niveau ? 1 : -1));

    arr.unshift({
      id: 'root',
      name: 'STELIA',
      niveau: '0',
    });
    console.log(arr);
    setTreeArray(arr);
  }, []);

  return (
    <>
      <Box
        sx={{
          ...style,
          width: 500,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center" margin={1}>
          <h2 variant="subtitle1">
            {t('MAPPING.ADD_NEW')} {data.i}
          </h2>
        </Stack>

        <Grid container direction="column" spacing={2}>
          <Grid item container direction="row" spacing={2} style={{ marginTop: '5px' }}>
            <Grid item xs={4}>
              <h4 variant="text">{t('MAPPING.CHOOSE_PARENT')}</h4>
            </Grid>

            <Grid item>
              <Select
                value={`${data?.id}`}
                label={'parent'}
                onChange={(e) => {
                  const obj = Object.assign({}, data, { id: e.target.value });
                  setData(obj);
                }}
              >
                {treeArray &&
                  treeArray.map((item) => (
                    <MenuItem value={item.id}>{item.name + ' dans le niveau ' + item.niveau}</MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>

          <Grid item container direction="row" spacing={2}>
            <Grid item xs={4}>
              <h4 variant="text">{t('GENERAL.CODE')}</h4>
            </Grid>

            <Grid item>
              <TextField
                color={!data.name ? 'error' : 'primary'}
                value={data.name}
                onChange={(e) => {
                  const obj = Object.assign({}, data, { name: e.target.value });
                  setData(obj);
                }}
              />
            </Grid>
          </Grid>

          <Grid item container direction="row" spacing={2}>
            <Grid item xs={4}>
              <h4 variant="text"> {t('GENERAL.DESIGNATION')} </h4>
            </Grid>

            <Grid item>
              <TextField
                color={!data.designation ? 'error' : 'primary'}
                value={data.designation}
                onChange={(e) => {
                  const obj = Object.assign({}, data, {
                    designation: e.target.value,
                  });
                  setData(obj);
                }}
              />
            </Grid>
          </Grid>

          <Grid item container direction="row" spacing={2}>
            <Grid item xs={4}>
              <h4 variant="text"> Objectif TRG ligne (facultatif)</h4>
            </Grid>

            <Grid item>
              <TextField
                value={data.objectif}
                onChange={(e) => {
                  const obj = Object.assign({}, data, {
                    objectif: e.target.value,
                  });
                  setData(obj);
                }}
              />
            </Grid>
          </Grid>
          <Grid item container direction="row" spacing={2}>
            <Grid item xs={4}>
              <h4 variant="text"> Position dans le dashboard</h4>
            </Grid>

            <Grid item>
              <TextField
                type="number"
                value={data.position}
                inputProps={{ min: 1 }}
                onChange={(e) => {
                  const obj = Object.assign({}, data, {
                    position: e.target.value,
                  });
                  setData(obj);
                }}
              />
            </Grid>
          </Grid>

          <Grid item spacing={2}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                if (!data.designation || !data.name) {
                  toast.error(t('TOAST.INVALID_DATA'));
                  return;
                }
                if (data.name.length > 10 || data.name.length < 3) {
                  toast.error(t('TOAST.VALIDATE_CODE_MAX_10_MIN_3'));
                  return;
                }
                if (data.designation.length > 255 || data.designation.length < 5) {
                  toast.error(t('TOAST.VALIDATE_DESIGNATION_MAX_255_MIN_3'));
                  return;
                }
                if (data.objectif.length !== 0 && isNaN(data.objectif)) {
                  toast.error('valeur objectif invalide');
                  return;
                }
                addMappingToId(data.id, data.name, data.designation, data.objectif, Number(data.position));
                setAddNodeModal(false);
              }}
            >
              {t('GENERAL.ADD')}
            </Button>

            <Button
              style={{ marginLeft: '50px' }}
              color="error"
              variant="contained"
              onClick={() => setAddNodeModal(false)}
            >
              {t('GENERAL.BACK')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default AddMapping;
