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
import { config } from 'react-spring';

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

export default function AddCategoryForm({ pId, closeModal, editCategoryData }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { configs } = useContext(ConfigsContext);
  const { createCategory, editCategory } = useConfigsService();

  const [formState, setFormState] = useState({
    code: '',
    designation: '',
    isActive: false,
    perteId: '',
  });

  const [perteId, setPerteId] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [passage, setPassage] = useState(false);
  const [causes, setCauses] = useState([]);

  useEffect(() => {
    if (pId) setPerteId(pId);
    if (editCategoryData) {
      setValue('code', editCategoryData.code);
      setValue('designation', editCategoryData.designation);
      setValue('Index_Of_Sap', editCategoryData.Index_Of_Sap);
      setValue('id', editCategoryData.id);
      setValue('isActive', editCategoryData.isActive);
      setValue('isSelected', editCategoryData.isSelected);
      setValue('passage', editCategoryData.passage);
      setIsActive(editCategoryData.isActive);
      setIsSelected(editCategoryData.isSelected);
      setPassage(editCategoryData.passage);
      setCauses(editCategoryData.causes);
      // alert(editCategoryData.id)
    }
  }, [pId, editCategoryData]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormState({ ...formState, perteId: value });
    setPerteId(value);
  };

  const onSubmit = async (data) => {
    let exist = false;
    if (editCategoryData) {
      // verifying that code category not existent (insert without duplication)
      let filtredConfigs = [...configs]
      if(pId === 2)
      filtredConfigs[3].categories = filtredConfigs[pId -1].categories.filter(category => category.specificCode !== editCategoryData.specificCode)
      if(pId === 4)
      filtredConfigs[1].categories = filtredConfigs[pId -1].categories.filter(category => category.specificCode !== editCategoryData.specificCode)
      
      filtredConfigs.forEach((element) => {
        const index = element.categories.findIndex(
          (category) => {
            return category.code === data.code && category.id !== data.id
          }
        );
        if (index !== -1) {
          toast.error('Code déja existe');
          exist = true;
          return;
        }
      });
      if (exist) return;
      return await editCategory({ ...data, pId,specificCode :editCategoryData.specificCode, causes }, closeModal);
    } else {
      // verifying that code category not existent (insert without duplication)
      configs.forEach((element) => {
        const index = element.categories.findIndex((category) => category.code === data.code);
        if (index !== -1) {
          toast.error('Code déja existe');
          exist = true;
          return;
        }
      });
      if (exist) return;
      // verifying ended  quit if exist
      await createCategory({ ...data, pId, isActive, isSelected, passage }, closeModal);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 5 }}>
      <FormControl sx={{ my: 1, width: '100%' }}>
        <InputLabel id="demo-multiple-name-label">Niveau de Perte</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          value={pId}
          onChange={handleChange}
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple={false}
          value={pId}
          onChange={handleChange}
          input={<OutlinedInput label="Type de Perte" />}
          MenuProps={MenuProps}
          fullWidth
          disabled={true}
        >
          {configs.map((c) => (
            <MenuItem key={c.id} value={c.id} selected={c.id == pId}>
              {c.label}
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
            setValueAs: (v) => v.toUpperCase(),
            onChange: (e) => {
              setValue('code', e.target.value.toUpperCase());
            },
          })}
          id="fullWidth"
        />
        {errors.code && <span style={{ textAlign: 'center', color: 'red' }}>code obligatoire</span>}
      </FormGroup>
      <FormGroup>
        <TextField
          fullWidth
          className="marginX"
          label="Designation"
          {...register('designation', {
            required: true,
          })}
          id="fullWidth"
        />
        {errors.designation && <span style={{ textAlign: 'center', color: 'red' }}>designation obligatoire</span>}
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={isActive} {...register('isActive')} onClick={() => setIsActive((c) => !c)} />}
          label="Activé"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={isSelected} {...register('isSelected')} onClick={() => setIsSelected((c) => !c)} />}
          label="Sélectionnable"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={passage} {...register('passage')} onClick={() => setPassage((c) => !c)} />}
          label="Passage d'état"
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
