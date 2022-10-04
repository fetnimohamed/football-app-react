import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { Button } from '@material-ui/core';
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

export default function AddCauseForm({ pId, cId, closeModal, editCauseData }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { configs } = useContext(ConfigsContext);
  const { createCause, editCause } = useConfigsService();

  const [formState, setFormState] = useState({
    code: '',
    designation: '',
    isActive: false,
    perteId: '',
  });

  const [perteId, setPerteId] = useState();

  const [isGeneric, setIsGeneric] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // alert(JSON.stringify(configs[pId-1].categories))
    if (pId) setPerteId(pId);
    if (editCauseData) {
      setValue('code', editCauseData.code);
      setValue('designation', editCauseData.designation);
      setValue('Index_Of_Sap', editCauseData.Index_Of_Sap);
      setValue('id', editCauseData.id);
      setIsActive(editCauseData.isActive);
      setIsGeneric(editCauseData.isGeneric);
    }
  }, [pId, editCauseData]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormState({ ...formState, perteId: value });
    setPerteId(value);
  };

  const onSubmit = async (data) => {
    let exist = false;
    if (editCauseData) {
      let filtredConfigs = [...configs]
      if(pId === 2){
        const specifiCodeCtegory = filtredConfigs[1].categories
                                                    .find(category => category.id === editCauseData.cId).specificCode
        filtredConfigs[3].categories
                        .find(category => category.specificCode === specifiCodeCtegory).causes = filtredConfigs[3].categories
                        .find(category => category.specificCode === specifiCodeCtegory).causes
                        .filter(cause => cause.specificCode !== editCauseData.specificCode)
      }

      if(pId === 4){
        const specifiCodeCtegory = filtredConfigs[3].categories
                                                    .find(category => category.id === editCauseData.cId).specificCode
        filtredConfigs[1].categories
                         .find(category => category.specificCode === specifiCodeCtegory).causes = filtredConfigs[1].categories
                         .find(category => category.specificCode === specifiCodeCtegory).causes
                         .filter(cause => cause.specificCode !== editCauseData.specificCode)
      }
     
      
      filtredConfigs.forEach((element) => {
        element.categories.forEach((category) => {
          const index = category.causes.findIndex((cause) => cause.code === data.code && cause.id !== data.id);
          if (index !== -1) {
            toast.error('Code déja existe');
            exist = true;
            return;
          }
        });
      });
      if (exist) return;
      return await editCause({ ...data, pId, cId, isActive, isGeneric, specificCode : editCauseData.specificCode }, closeModal);
    } else {
      // verifying that code cause not existent (insert without duplication)

      configs.forEach((element) => {
        element.categories.forEach((category) => {
          const index = category.causes.findIndex((cause) => cause.code === data.code);
          if (index !== -1) {
            toast.error('Code déja existe');
            exist = true;
            return;
          }
        });
      });
      if (exist) return;
      // verifying ended  quit if exist
      await createCause({ ...data, pId, cId, isActive, isGeneric }, closeModal);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 5 }}>
      <FormControl sx={{ my: 1, width: '100%' }}>
        <InputLabel id="demo-multiple-name-label">Catégorie</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          value={cId}
          onChange={handleChange}
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple={false}
          value={cId}
          onChange={handleChange}
          input={<OutlinedInput label="Catégorie" />}
          MenuProps={MenuProps}
          fullWidth
          disabled={true}
        >
          {configs[pId - 1]?.categories?.map((c) => (
            <MenuItem
              key={c.id}
              value={c.id}
              //selected={c.id == pId}
            >
              {c.designation}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormGroup>
        <TextField
          fullWidth
          label="Code "
          {...register('code', {
            required: true,
            maxLength: 30,
            setValueAs: (v) => v.toUpperCase(),
            onChange: (e) => {
              setValue('code', e.target.value.toUpperCase());
            },
          })}
          id="fullWidth"
        />
        {errors.code && (
          <span style={{ textAlign: 'center', color: 'red' }}>code obligatoire et ne doit pas passé 30 caractere</span>
        )}
      </FormGroup>
      <FormGroup>
        <TextField
          fullWidth
          className="marginX"
          label="Designation"
          {...register('designation', { required: true })}
          id="fullWidth"
        />
        {errors.designation && <span style={{ textAlign: 'center', color: 'red' }}>designation obligatoire</span>}
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={isGeneric} onClick={() => setIsGeneric((g) => !g)} />}
          label="Générique"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={isActive} {...register('isActive')} onClick={() => setIsActive((c) => !c)} />}
          label="Activé"
        />
      </FormGroup>
      <Button type="submit" variant="contained">
        {' '}
        Ajouter{' '}
      </Button>{' '}
      <Button variant="contained" color="error" onClick={closeModal}>
        {' '}
        Annuler{' '}
      </Button>
    </form>
  );
}

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}
