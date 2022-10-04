import {
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItem,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
} from '@material-ui/core';
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
import useMachineCycleService from 'services/machineCycle';

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

const AddCycle = (props) => {
  ///////////////////// services ////////////////////////////////
  ///////////////////////////////////////////////////////////////
  const { getAllProcessTypes } = useProcessTypeService();
  const { addCycle, editCycle } = useMachineCycleService();

  /////////////////// use state ////////////////////////////////
  /////////////////////////////////////////////////////////////
  const { t, i18n } = useTranslation();
  const scriptedRef = useScriptRef();
  const [tags, setTags] = useState([]);
  const [processTypeData, setProcessTypedata] = useState([]);
  const [state, setState] = useState({ id: '', designation: '', processTypeId: '', codeCycle: '', margin: 0 });
  const [title, setTitle] = useState(t('MACHINE.ADD_MACHINE_CYCLE'));
  ////////////////////////////// get All data /////////////////////
  /////////////////////////////////////////////////////////////////

  useEffect(async () => {
    const processTypeData = await getAllProcessTypes();
    setProcessTypedata(processTypeData);
    if (props.cycle) {
      setTitle(t('MACHINE.EDIT_PROCESS_TYPE'));
    }
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
          <h2 variant="subtitle1">{title}</h2>
        </Stack>
        <Formik
          initialValues={{
            id: props.cycle ? props.cycle.id : '',
            designation: props.cycle ? props.cycle.designation : '',
            processTypeId: props.cycle ? props.cycle.processTypeId : '',
            codeCycle: props.cycle ? props.cycle.codeCycle : '',
            margin: props.cycle ? props.cycle.margin : '',
          }}
          validationSchema={yup.object().shape({
            designation: yup
              .string()
              .max(255, t('TOAST.VALIDATE_MAX_255'))
              .matches(/^[A-Za-z0-9\s]/, t('TOAST.VALIDATE_ALPHANUMERIC'))
              .required(t('PROCESS_TYPE.TOAST.REQUIRED_PROCESS_TYPE_DESIGNATION')),
            codeCycle: yup
              .string()
              .max(30, t('TOAST.VALIDATE_MAX_30'))
              .required(t('MACHINE_CYCLE.TOAST.REQUIRED_MACHINE_CYCLE_CODE')),
            processTypeId: yup
              .string()
              .required(t('MACHINE_CYCLE.TOAST.REQUIRED_PROCESS_TYPE')),
            margin: yup
              .number()
              .required(t('MACHINE_CYCLE.TOAST.REQUIRED_MACHINE_MARGIN'))
          })}
          handleChange={async (values) => setState({ ...values })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              if (scriptedRef.current) {
                if (!props.cycle) {
                  values.codeCycle = values.codeCycle.toUpperCase();
                  addCycle(values).then((res) => {
                    if (res.status === 200) {
                      toast.success(t('MACHINE_CYCLE.TOAST.SUCCESS_ADD'));
                      props.handleClose();
                    } else if (res.status === 201) {
                      props.handleClose();
                      toast.warning(t('MACHINE_CYCLE.TOAST.DUPLICATE_CODE'));
                    } else {
                      props.handleClose();
                      toast.error(t('MACHINE_CYCLE.TOAST.ERROR_ADD'));
                    }
                  });
                } else if (props.cycle.id != null) {
                  values.codeCycle = values.codeCycle.toUpperCase();
                  editCycle(values).then((res) => {
                    if (res.status === 200) {
                      toast.success(t('MACHINE_CYCLE.TOAST.SUCCESS_UPDATE'));
                      props.handleClose();
                    } else if (res.status === 201) {
                      toast.warning(t('MACHINE_CYCLE.TOAST.DUPLICATE_CODE'));
                    } else {
                      props.handleClose();
                      toast.error(t('MACHINE_CYCLE.TOAST.ERROR_EDIT'));
                    }
                  });
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
                    name="codeCycle"
                    label="Code de cycle de machine"
                    value={values.codeCycle}
                    onChange={(event) => {
                      values.codeCycle = event.target.value.toUpperCase();
                      setState({ ...values, codeCycle: event.target.value.toUpperCase() });
                    }}
                  />
                  <FormHelperText>*Ce champs doit être en majuscule</FormHelperText>
                  {touched.codeCycle && errors.codeCycle && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {errors.codeCycle}{' '}
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
                <InputLabel>{t('PROCESS_TYPE.PROCESS_TYPE')}</InputLabel>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="center" margin={2}>
                <FormControl fullWidth>
                  <Select
                    name="processTypeId"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.processTypeId}
                    onChange={handleChange}
                  >
                    {processTypeData?.map((row) => (
                      <MenuItem value={row.id}>{row.designation}</MenuItem>
                    ))}
                  </Select>
                  {' '}
                  {touched.processTypeId && errors.processTypeId && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {errors.processTypeId}{' '}
                    </FormHelperText>
                  )}{' '}
                </FormControl>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="center" margin={2}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-designation">{t('MACHINE.MARGIN')} %</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-designation"
                    type="number"
                    name="margin"
                    label="Margin %"
                    value={values.margin}
                    onChange={handleChange}
                  />{' '}
                  {touched.margin && errors.margin && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {' '}
                      {errors.margin}{' '}
                    </FormHelperText>
                  )}{' '}
                </FormControl>
              </Stack>
              <Box sx={{ '& button': { m: 1 }, display: 'flex', justifyContent: 'end' }}>
                <Button
                  size="sm"
                  variant="contained"
                  color="error"
                  onClick={() => {
                    props.handleClose();
                  }}
                >
                  {t('GENERAL.CANCEL')}
                </Button>

                <Button size="sm" type="submit" variant="contained" color="primary">
                  {t('GENERAL.SUBMIT')}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};
export default AddCycle;
