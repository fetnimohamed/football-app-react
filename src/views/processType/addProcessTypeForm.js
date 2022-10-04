import {
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItem,
  OutlinedInput,
  Paper,
  Stack,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Box } from '@material-ui/system';
import useScriptRef from 'hooks/useScriptRef';
import ReactDOM from 'react-dom';
import ReactTagInput from '@pathofdev/react-tag-input';
import '@pathofdev/react-tag-input/build/index.css';
import useProcessTypeService from 'services/processTypeService';
import { toast } from 'react-toastify';
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

const AddProcessType = ({ existProcessType, callback, refreshData }) => {
  const scriptedRef = useScriptRef();
  const [tags, setTags] = useState([]);
  const { addProcessType, editProcessType, getAllProcessTypes } = useProcessTypeService();
  const [state, setState] = useState({ id: '', designation: '', code_processType: '', attributes: [tags] });
  const [title, setTitle] = useState('');
  const { t, i18n } = useTranslation();
  const [processTypeList, setProcessTypesList] = useState([]);

  async function getData() {
    const data = await getAllProcessTypes();
    setProcessTypesList(data);
  }
  useEffect(() => {
    getData();
    if (existProcessType) {
      console.log('existProcessType', existProcessType);
      setTags(existProcessType.attributes);
      setTitle(t('PROCESS_TYPE.EDIT_PROCESS_TYPE'));
      // state.id = existProcessType.id
      //state.designation = existProcessType.designation
      //state.code_processType = existProcessType.code_processType
      //setState(state)
    } else {
      setTitle(t('PROCESS_TYPE.ADD_PROCESS_TYPE_TITLE'));
    }
  }, [existProcessType]);
  const history = useHistory();
  return (
    <>
      <Box
        sx={{
          ...style,
          width: 500,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="center" margin={1}>
          <h2 variant="subtitle1">{title}</h2>
        </Stack>
        <Formik
          initialValues={{
            id: existProcessType ? existProcessType.id : '',
            designation: existProcessType ? existProcessType.designation : '',
            code_processType: existProcessType ? existProcessType.code_processType : '',
            attributes: tags,
          }}
          validationSchema={yup.object().shape({
            designation: yup
              .string()
              .max(255, t('TOAST.VALIDATE_MAX_255'))
              .matches(/^[A-Za-z0-9\s]/, t('TOAST.VALIDATE_ALPHANUMERIC'))
              .required(t('PROCESS_TYPE.TOAST.REQUIRED_PROCESS_TYPE_DESIGNATION')),
            code_processType: yup
              .string()
              .max(4, t('TOAST.VALIDATE_MAX_4'))
              .required(t('PROCESS_TYPE.TOAST.REQUIRED_PROCESS_TYPE_CODE')),
          })}
          handleChange={async (values) => setState({ ...values })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                if (!existProcessType) {
                  values.attributes = tags;
                  values.code_processType = values.code_processType.toUpperCase();
                  addProcessType(values).then((res) => {
                    console.log(res);
                    if (res.status === 200) {
                      toast.success(t('PROCESS_TYPE.TOAST.SUCCESS_ADD'));
                      callback();
                    } else if (res.status === 201) {
                      callback();
                      toast.warning(t('PROCESS_TYPE.TOAST.DUPLICATE_CODE'));
                    } else {
                      callback();
                      toast.error(t('PROCESS_TYPE.TOAST.ERROR_ADD'));
                    }
                  });
                } else if (existProcessType.id != null) {
                  const index = processTypeList
                    .filter((p) => p.id !== existProcessType.id)
                    .findIndex((p) => p.code_processType === values.code_processType);
                  if (index !== -1) {
                    toast.warning(t('PROCESS_TYPE.TOAST.DUPLICATE_CODE'));
                  } else {
                    values.attributes = tags;
                    console.log('values', values);
                    editProcessType(values).then((res) => {
                      if (res.status === 201) {
                        toast.success(t('PROCESS_TYPE.TOAST.SUCCESS_UPDATE'));
                        callback();
                        //  window.location.reload(false);
                      } else {
                        callback();
                        toast.error(t('PROCESS_TYPE.TOAST.ERROR_EDIT'));
                      }
                    });
                  }
                }
              }
            } catch (err) {
              console.error(err);
              if (scriptedRef.current) {
                console.log('error');
              }
            }
          }}
        >
          {({ values, errors, isSubmitting, handleChange, touched }) => (
            <Form>
              <Stack direction="row" alignItems="center" justifyContent="center" margin={2}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-code-process">{t('GENERAL.CODE')}</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-code-process"
                    type="text"
                    name="code_processType"
                    label="Code de process"
                    value={values.code_processType}
                    onChange={(event) => {
                      values.code_processType = event.target.value.toUpperCase();
                      setState({ ...values, code_processType: event.target.value.toUpperCase() });
                    }}
                  />
                  <FormHelperText>*Ce champs doit être en majuscule</FormHelperText>
                  {touched.code_processType && errors.code_processType && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {errors.code_processType}{' '}
                    </FormHelperText>
                  )}{' '}
                </FormControl>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="center" margin={2}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-designation">{t('GENERAL.DESIGNATION')}</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-designation"
                    type="text"
                    name="designation"
                    label="Désignation"
                    value={values.designation}
                    onChange={handleChange}
                  />{' '}
                  {touched.designation && errors.designation && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {errors.designation}{' '}
                    </FormHelperText>
                  )}{' '}
                </FormControl>
              </Stack>
              <Stack direction="row" alignItems="start" justifyContent="start" margin={2}>
                <InputLabel>{t('GENERAL.ATTRIBUTES')}</InputLabel>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="center" margin={2}>
                <ReactTagInput
                  tags={tags}
                  placeholder={'Tapez et appuyez sur Entrée'}
                  onChange={(newTags) => setTags([...newTags])}
                />
              </Stack>
              <Box sx={{ '& button': { m: 1 }, display: 'flex', justifyContent: 'end' }}>
                <Button
                  size="sm"
                  variant="contained"
                  color="error"
                  onClick={() => {
                    callback();
                  }}
                >
                  {t('GENERAL.CANCEL')}
                </Button>
                <Button size="sm" type="submit" variant="contained" color="primary">
                  {t('GENERAL.SUBMIT')}
                </Button>
                <Button onClick={() => callback()}>Go Back</Button>
                {t('GENERAL.CANCEL')}
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};
export default AddProcessType;
