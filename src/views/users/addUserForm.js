import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@material-ui/core';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme } from '@mui/material/styles';
import { ConfigsContext } from 'context/ConfigsContext';
import useHttpClient from 'hooks/useHttpClient';
import useConfigsService from 'services/configsService';
import { toast } from 'react-toastify';
import useUserService from 'services/usersService';
import { Box } from '@material-ui/system';
import moment from 'moment';
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function AddUserForm({ readOnly, editUserData, closeModal, refreshData }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { configs, processTypes } = useContext(ConfigsContext);
  const { createUser, editUser } = useUserService();

  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    matricule: '',
    profileId: 'COMP',
    processType: '',
    permissionLevel: 1,
    createDate: '',
    updateDate: '',
  });

  const [processType, setProcessType] = useState(null);

  useEffect(() => {
    if (editUserData !== null) {
      setValue('firstName', editUserData.firstName);
      setValue('lastName', editUserData.lastName);
      setValue('matricule', editUserData.matricule);
      setValue('processType', editUserData.processType);
      setValue('createDate', editUserData.createDate);
      setValue('updateDate', editUserData.updateDate);
      setProcessType(editUserData.processType);
    }
  }, [editUserData]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormState({ ...formState, processType: value });
    setProcessType(value);
  };

  const onSubmit = async (data) => {
    console.log(editUserData);
    if (!processType) return toast.error('Type de process obligatoire');
    if (editUserData?.id)
      return await editUser(
        {
          ...editUserData,
          ...data,
          permissionLevel: 1,
          _id: editUserData.id,
          processType: processType,
        },
        1,
        closeModal,

      );
    refreshData()

    await createUser(
      {
        ...data,
        profileId: 'COMP',
        processType: processType,
        permissionLevel: 1,
        status: 1,
      },

      closeModal,
    );
    refreshData()
  };
  return (
    //title={userData ? "Modifier un compagnon" : "Ajouter un compagnon"}
    <Box
      sx={{
        ...style,
        width: 500,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="center" margin={1}>
        <h2 variant="subtitle1">{editUserData?.id ? 'Modifier un compagnon' : 'Ajouter un compagnon'}</h2>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 5 }}>
        <FormGroup>
          <TextField
            fullWidth
            disabled={readOnly}
            sx={{ my: 1, width: '100%' }}
            label="Matricule "
            {...register('matricule', {
              required: true,
              maxLength: 12,
              minLength: 5,
            })}
            id="fullWidth"
          />
          {errors.matricule && (
            <span style={{ textAlign: 'center', color: 'red' }}>Matricule doit être entre 5 et 12 caractères</span>
          )}
        </FormGroup>

        <FormGroup>
          <TextField
            fullWidth
            disabled={readOnly}
            sx={{ my: 1, width: '100%' }}
            label="Nom "
            {...register('firstName', {
              required: true,
              setValueAs: (v) => v.toUpperCase(),
              onChange: (e) => {
                setValue('firstName', e.target.value);
              },
            })}
            id="fullWidth"
          />
          {errors.firstName && (
            <span style={{ textAlign: 'center', color: 'red' }}>Le champs nom est obligatoire !</span>
          )}
        </FormGroup>

        <FormGroup>
          <TextField
            fullWidth
            disabled={readOnly}
            sx={{ my: 1, width: '100%' }}
            label="Prénom "
            {...register('lastName', {
              required: true,
              setValueAs: (v) => v.toUpperCase(),
              onChange: (e) => {
                setValue('lastName', e.target.value);
              },
            })}
            id="fullWidth"
          />
          {errors.lastNae && (
            <span style={{ textAlign: 'center', color: 'red' }}>Le champs prénom est obligatoire !</span>
          )}
        </FormGroup>

        {editUserData && <InputLabel id="demo-multiple-name-label">Type de process</InputLabel>}
        <FormControl sx={{ my: 1, width: '100%' }}>
          {!editUserData && <InputLabel id="demo-multiple-name-label">Type de process</InputLabel>}
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple={false}
            value={processType}
            onChange={handleChange}
            input={<OutlinedInput label="Type de process" />}
            disabled={readOnly}
            MenuProps={MenuProps}
            fullWidth
          >
            {processTypes.map((c) => (
              <MenuItem key={c.id} value={c.id} selected={c.id === processType}>
                {c.designation}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {editUserData?.id != null ? (
          <>
            <FormGroup>
              <TextField
                fullWidth
                disabled={true}
                sx={{ my: 1, width: '100%' }}
                label="Date de création"
                id="fullWidth"
                {...register('createDate', {
                  setValueAs: (v) => moment(v).format('YYYY-MM-DD'),
                })}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                fullWidth
                disabled={true}
                sx={{ my: 1, width: '100%' }}
                label="Date de création"
                id="fullWidth"
                {...register('createDate', {
                  setValueAs: (v) => moment(v).format('YYYY-MM-DD'),
                })}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                fullWidth
                disabled={true}
                sx={{ my: 1, width: '100%' }}
                label="Date de modification"
                id="fullWidth"
                {...register('updateDate', {
                  setValueAs: (v) => moment(v).format('YYYY-MM-DD'),
                })}
              />
            </FormGroup>
          </>
        ) : (
          ''
        )}
        <Stack direction="row" spacing={2} margin={2} justifyContent="center">
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              closeModal();
            }}
          >
            {' '}
            Annuler{' '}
          </Button>
          <Button type="submit" variant="contained" style={{ display: !readOnly ? '' : 'none' }}>
            {' '}
            {editUserData?.id ? 'Editer' : 'Ajouter'}{' '}
          </Button>{' '}
        </Stack>
      </form>
    </Box>
  );
}

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}
