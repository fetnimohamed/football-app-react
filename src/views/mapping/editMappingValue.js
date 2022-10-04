import {
  Button,
  Stack,
  Grid,
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from '@material-ui/core';

import React, { useEffect, useState } from 'react';

import { Box } from '@material-ui/system';

import '@pathofdev/react-tag-input/build/index.css';

import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';

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

const EditMappingValue = ({ editNodeModal, setEditNodeModal, editMappingNameById }) => {
  const [data, setData] = useState({});
  const { t, i18n } = useTranslation();
  ///////////////// Formik ///////////////////
  const validationSchema = yup.object({
    name: yup
      .string()
      .min(3, t('TOAST.VALIDATE_CODE_MAX_6_MIN_3'))
      .max(6, t('TOAST.VALIDATE_CODE_MAX_6_MIN_3'))
      .required('Ce champs est obligatoire !'),
    designation: yup
      .string()
      .min(5, t('TOAST.VALIDATE_DESIGNATION_MAX_255_MIN_3'))
      .max(255, t('TOAST.VALIDATE_DESIGNATION_MAX_255_MIN_3'))
      .required('Ce champs est obligatoire !'),
  });
  const editMapping = useFormik({
    initialValues: {
      id: editNodeModal ? editNodeModal.id : '',
      name: editNodeModal ? editNodeModal.name : '',
      designation: editNodeModal ? editNodeModal.designation : '',
      objectif: editNodeModal ? editNodeModal.objectif : '',
      position: editNodeModal ? editNodeModal.position : 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      editMappingNameById(values.id, values.name, values.designation, values.objectif, values.position);
      setEditNodeModal(false);
    },
  });
  // GET SELECTED DATA FROM PROPS
  useEffect(() => {
    setData(editNodeModal);
  }, []);

  return (
    <>
      <Box
        sx={{
          ...style,
          width: 500,
        }}
      >
        <form onSubmit={editMapping.handleSubmit}>
          <Stack direction="row" alignItems="center" justifyContent="center" margin={1}>
            <h2 variant="subtitle1">{t('MAPPING.EDIT_SITE')}</h2>
          </Stack>

          <Stack direction="row" alignItems="start" justifyContent="start" margin={2}>
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-code">{t('GENERAL.CODE')}</InputLabel>
              <OutlinedInput
                id="outlined-adornment-code"
                type="text"
                name="name"
                label="Code"
                value={editMapping.values.name}
                onChange={editMapping.handleChange}
              />
              {editMapping.touched.name && editMapping.errors.name && (
                <FormHelperText error id="standard-weight-helper-text-code">
                  {' '}
                  {editMapping.errors.name}{' '}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>

          <Stack direction="row" alignItems="start" justifyContent="start" margin={2}>
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-code">{t('GENERAL.DESIGNATION')}</InputLabel>
              <OutlinedInput
                id="outlined-adornment-code"
                type="text"
                name="designation"
                label="Designation"
                value={editMapping.values.designation}
                onChange={editMapping.handleChange}
              />
              {editMapping.touched.designation && editMapping.errors.designation && (
                <FormHelperText error id="standard-weight-helper-text-code">
                  {' '}
                  {editMapping.errors.designation}{' '}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>

          <Stack direction="row" alignItems="start" justifyContent="start" margin={2}>
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-code">{t('GENERAL.OBJECTIF')} (facultatif) :</InputLabel>
              <OutlinedInput
                id="outlined-adornment-code"
                type="text"
                name="objectif"
                label="Objetif"
                value={editMapping.values.objectif}
                onChange={editMapping.handleChange}
              />
              {editMapping.touched.objectif && editMapping.errors.objectif && (
                <FormHelperText error id="standard-weight-helper-text-code">
                  {' '}
                  {editMapping.errors.objectif}{' '}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>
          <Stack direction="row" alignItems="start" justifyContent="start" margin={2}>
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-code">Position</InputLabel>
              <OutlinedInput
                id="outlined-adornment-code"
                type="text"
                name="position"
                label="position"
                value={editMapping.values.position}
                onChange={editMapping.handleChange}
              />
              {editMapping.touched.position && editMapping.errors.position && (
                <FormHelperText error id="standard-weight-helper-text-code">
                  {' '}
                  {editMapping.errors.position}{' '}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>

          <Box
            sx={{
              '& button': { m: 1 },
              display: 'flex',
              justifyContent: 'end',
            }}
          >
            <Button size="sm" variant="contained" color="error" onClick={() => setEditNodeModal(false)}>
              {t('GENERAL.CANCEL')}
            </Button>
            <Button size="sm" type="submit" variant="contained" color="primary">
              {t('GENERAL.SUBMIT')}
            </Button>{' '}
          </Box>
        </form>
      </Box>
    </>
  );
};
export default EditMappingValue;
