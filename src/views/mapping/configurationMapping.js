import React, { useEffect, useState } from 'react';
import { Button, IconButton } from '@material-ui/core';
import MainCard from 'ui-component/cards/MainCard';

import { TextField, Stack, Grid } from '@mui/material';

import { toast } from 'react-toastify';

import useMappingService from 'services/mappingService';

import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

// LIST ALL LEVELS
const ListLevels = ({ levels, setLevels }) => {
  // translation
  const { t, i18n } = useTranslation();

  // SWITCH FROM EDIT AND CONFIRM EDIT
  const handleEditToggle = (e, key) => {
    e.preventDefault();
    console.log(e, key, 'myArray');
    const arr = [...levels];
    arr[key].edit = !arr[key].edit;
    setLevels(arr);
  };

  // EDIT NAME ON CHANGE
  const handleEditName = (e, key) => {
    const arr = [...levels];
    arr[key].name = e.target.value;
    console.log(arr);
    setLevels(arr);
  };

  // EDIT DELETE ON CHANGE
  const handleDelete = () => {
    const arr = [...levels];
    arr.pop();
    setLevels(arr);
  };

  return (
    <>
      {levels.map((level, key) => {
        return (
          <Grid container direction="row" alignItems="center" justifyContent="flex-start">
            <Grid item xs={6}>
              <TextField
                value={level.name}
                variant="standard"
                disabled={level.edit}
                onChange={(e) => handleEditName(e, key)}
              />

              {/* can't edit first Item  */}

              {key !== 0 && (
                <IconButton onClick={(e) => handleEditToggle(e, key)}>
                  {level.edit ? <EditIcon /> : <CheckIcon />}
                </IconButton>
              )}

              {/* delete last Item  */}

              {key === levels.length - 1 && key !== 0 && (
                <IconButton onClick={(e) => handleDelete(e, key)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Grid>
            <Grid item xs={4}>
              <h4>{key}</h4>
            </Grid>
          </Grid>
        );
      })}
    </>
  );
};

// ALL LEVELS
// ALL LEVELS
// ALL LEVELS
// ALL LEVELS

const ConfigurationMapping = () => {
  const { getAllMapping, postMappingConfig } = useMappingService();
  const [levels, setLevels] = useState([]);
  const [relod, setRelod] = useState(false);

  // GET ALL LEVELS
  const fetchMapping = async () => {
    const response = await getAllMapping();
    if (response?.data && response.data.niveau) {
      response.data.niveau.unshift('STELIA');
      const arr = response.data.niveau.map((item) => {
        return { name: item, edit: true };
      });
      setLevels(arr);
    }
  };

  useEffect(() => {
    fetchMapping();
  }, []);

  // ON RELOD FETCH MAPPING
  useEffect(() => {
    if (relod) fetchMapping();
    return () => setRelod(false);
  }, [relod]);

  useEffect(() => {
    setNewLevel('');
  }, [levels]);

  const [newLevel, setNewLevel] = useState('');

  // ON ADD VERIFY DATA AND PUSH TO THE ARRAY
  const handleAdd = (e) => {
    e.preventDefault();
    if (!newLevel || newLevel.length < 3 || newLevel.length > 15) {
      toast.error('La designation doit être entre 3 et 15 caractères');
      return;
    }
    if (newLevel.length === 0) return;
    const arr = [...levels];
    arr.push({ name: newLevel, edit: true });
    setLevels(arr);
  };

  // SEND DATA TO BACKEND
  const confirmData = () => {
    let goodData = true;
    const arr = levels.map((item) => {
      console.log(item.name);
      if (item.name.length < 3 || item.name.length > 15) {
        item.name !== 'STELIA' ? (goodData = false) : console.log('STELIA');
      }
      return item.name;
    });
    ///verifie data before edit
    if (goodData) {
      // REQUEST
      postMappingConfig(arr.slice(1)).then((res) => {
        if (res) toast.success('Ajouté avec succées');
        else {
          toast.error('Mapping existe dans le niveau');
          setRelod(true);
        }
      });
    } else {
      toast.error('La designation doit être entre 3 et 15 caractères');
    }
  };

  return (
    <MainCard title="Configuration Mapping" style={{ height: '570px' }}>
      <Stack spacing={2}>
        <Grid container direction="row" alignItems="center" justifyContent="flex-start">
          <Grid item xs={6}>
            <h3>Designation</h3>
          </Grid>
          <Grid item xs={4}>
            <h3>Niveau</h3>
          </Grid>
        </Grid>

        {levels !== [] && <ListLevels levels={levels} setLevels={setLevels} />}

        <Grid container direction="row" alignItems="center" justifyContent="flex-start">
          <TextField
            label="Designation"
            variant="outlined"
            value={newLevel}
            onChange={(e) => {
              console.log(newLevel);
              setNewLevel(e.target.value);
            }}
          />
          <Button
            onClick={(e) => {
              handleAdd(e);
            }}
          >
            Ajouter
          </Button>
        </Grid>

        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          spacing={2}
          style={{ marginTop: '0.5px' }}
        >
          <Grid item>
            <h4> Les changements n'auront pas lieu qu'après la confirmation </h4>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          spacing={2}
          style={{ marginTop: '1px' }}
        >
          <Grid item>
            <Button color="primary" variant="contained" onClick={() => confirmData()}>
              Confirmer
            </Button>
          </Grid>
          <Grid item>
            <Button color="error" variant="contained" onClick={() => setRelod(true)}>
              Annuler
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </MainCard>
  );
};

export default ConfigurationMapping;
