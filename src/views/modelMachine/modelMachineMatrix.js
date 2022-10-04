import React, { useContext, useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import useConfigsService from '../../services/configsService';
import { ConfigsContext } from 'context/ConfigsContext';
import useProcessTypeService from 'services/processTypeService';
import { TableContainer } from '@material-ui/core';
import Stack from '@mui/material/Stack';

import useModelsMachineService from 'services/modelsMachineService';
import Checkbox from '@mui/material/Checkbox';

import { IconPlus, IconPencil, IconTrash } from '@tabler/icons';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Box } from '@material-ui/system';

export default function ListUserComponent({ data, models, setModels, openDeleteModal }) {
  const { getAllProcessTypes } = useProcessTypeService();
  const { createModelMachine, editModelMachine, getModelsMachine } = useModelsMachineService();

  const [processTypeList, setProcessTypeList] = useState([]);

  const [addColumn, setAddColumn] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const { t, i18n } = useTranslation();
  const [newModelData, setNewModelData] = useState({
    name: '',
    processtypeId: '',
    causes: [],
  });

  const [processType, setProcessType] = useState('');

  useEffect(async () => {
    const res = await getAllProcessTypes();
    setProcessTypeList(res);
  }, []);

  const checkIn = (table, item) => {
    const c = table.find((t) => t === item);
    if (c) return true;
    else return false;
  };

  const addRemoveCheck = (item) => {
    if (checkIn(newModelData.causes, item)) {
      const newCauses = newModelData.causes.filter((c) => c !== item);
      setNewModelData({ ...newModelData, causes: newCauses });
      return;
    }

    setNewModelData({
      ...newModelData,
      causes: [...newModelData.causes, item],
    });
    console.log(newModelData.causes);
  };

  const addRemoveCheckModel = (model, item, index) => {
    if (editRow !== models[index].id) return;
    if (checkIn(models[index].causes, item)) {
      const newCauses = models[index].causes.filter((c) => c !== item);
      models[index].causes = newCauses;
      setModels([...models]);
      return;
    }
    models[index].causes.push(item);
    setModels([...models]);
  };

  const addModel = async () => {
    if (!newModelData.name) return alert('Saisir le nom de modèle');
    if (!newModelData.processtypeId) return alert(t('MACHINE_MODEL.TOAST.CHOOSE_TYPE_PROCESS'));
    await createModelMachine(newModelData, () => {
      setAddColumn(false);
      setNewModelData({
        name: '',
        processtypeId: '',
        causes: [],
      });
    });
  };

  const editModel = async () => {
    await editModelMachine(models, () => {
      setEditRow(false);
    });
  };

  return (
    <div>
      <Stack direction="row" alignItems="end" justifyContent="end" marginRight={18} padding={2}>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: 5, float: 'right' }}
          onClick={() => setAddColumn(true)}
        >
          {t('MACHINE_MODEL.ADD_MACHINE_MODEL')}
        </Button>
      </Stack>

      <TableContainer
        style={{ width: '80%', margin: 'auto', backgroundColor: 'white', height: '450px', marginTop: '20px' }}
      >
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell
                rowspan="2"
                style={{
                  position: 'sticky',
                  left: 0,
                  backgroundColor: 'white',
                  width: '200px',
                }}
              >
                {t('GENERAL.DESIGNATION')}
              </TableCell>
              <TableCell
                rowspan="2"
                style={{
                  position: 'sticky',
                  left: 213,
                  backgroundColor: 'white',
                }}
              >
                <span stayle={{ margin: 5, textAlign: 'center' }}>{t('PROCESS_TYPE.PROCESS_TYPE')} </span>
                <select name="processTypes" style={{ padding: '7px' }} onChange={(e) => setProcessType(e.target.value)}>
                  <option value=""> {t('GENERAL.ALL')} </option>
                  {processTypeList?.map((p) => (
                    <option value={p.id}>{p.designation}</option>
                  ))}
                </select>
              </TableCell>

              {data?.map((config) => (
                <TableCell colspan={config?.causes?.length} style={{ width: '10%' }}>
                  {config.designation}
                </TableCell>
              ))}

              <TableCell
                rowspan="2"
                style={{
                  position: 'sticky',
                  right: -1,
                  backgroundColor: 'white',
                }}
              >
                {t('GENERAL.ACTIONS')}
              </TableCell>
            </TableRow>
            <TableRow>
              {data?.map((config) => config.causes?.map((cause) => <TableCell>{cause.designation}</TableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {models
              ?.filter((m) => (processType ? m.processtypeId === processType : m))
              .map((model, index) => {
                return (
                  <TableRow keu={index}>
                    <TableCell
                      style={{
                        position: 'sticky',
                        left: 0,
                        background: 'white',
                        zIndex: 100,
                      }}
                    >
                      {editRow && editRow === model.id ? (
                        <input
                          type="text"
                          style={{
                            padding: '7px',
                            borderRadius: 5,
                            width: '200px',
                          }}
                          value={model.name}
                          onChange={(e) => {
                            models[index].name = e.target.value;
                            setModels([...models]);
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            padding: '7px',
                            borderRadius: 5,
                            width: '200px',
                          }}
                        >
                          {model.name}
                        </div>
                      )}
                    </TableCell>

                    <TableCell
                      style={{
                        position: 'sticky',
                        left: 213,
                        backgroundColor: 'white',
                        zIndex: 100,
                      }}
                    >
                      <select
                        name="processTypes"
                        style={{ padding: '7px' }}
                        disabled={editRow !== model.id}
                        onChange={(e) => {
                          models[index].processtypeId = e.target.value;
                          setModels([...models]);
                        }}
                      >
                        <option value="">{t('PROCESS_TYPE.PROCESS_TYPE')}</option>
                        {processTypeList.map((p) => (
                          <option value={p.id} selected={p.id === model.processtypeId}>
                            {p.designation}
                          </option>
                        ))}
                      </select>
                    </TableCell>

                    {data?.map((config) =>
                      config.causes?.map((cause) => (
                        <TableCell style={{ width: '10%' }}>
                          <Checkbox
                            checked={checkIn(models[index].causes, cause.id)}
                            onClick={() => addRemoveCheckModel(model, cause.id, index)}
                          />
                        </TableCell>
                      )),
                    )}

                    <TableCell
                      style={{
                        position: 'sticky',
                        right: -1,
                        backgroundColor: 'white',
                        padding: 5,
                        zIndex: 100,
                      }}
                    >
                      {addColumn || editRow ? (
                        ''
                      ) : (
                        <div>
                          <IconPencil onClick={() => setEditRow(model.id)} />{' '}
                          <IconTrash onClick={() => openDeleteModal(model.id)} />
                        </div>
                      )}
                      {editRow === model.id && (
                        <Box sx={{ '& button': { m: 1 }, display: 'flex', justifyContent: 'end' }}>
                          <Button
                            size="sm"
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              if (!models[index].name) return toast.error(t('TOAST.REQUIRED_DESIGNATION'));
                              const exist = models.filter((m) => m.name == models[index].name);
                              if (exist.length > 1) return toast.error(t('TOAST.DUPLICATE_DESIGNATION'));
                              editModel();
                            }}
                          >
                            {t('GENERAL.SUBMIT')}
                          </Button>{' '}
                          <Button
                            size="sm"
                            variant="contained"
                            color="error"
                            onClick={() => {
                              getModelsMachine();
                              setEditRow(false);
                            }}
                          >
                            {t('GENERAL.BACK')}
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

            {addColumn && (
              <TableRow>
                <TableCell
                  style={{
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'white',
                    zIndex: 1000,
                  }}
                >
                  <input
                    type="text"
                    style={{ padding: '7px', width: '200px', borderRadius: 5 }}
                    value={newModelData.name}
                    onChange={(e) => setNewModelData({ ...newModelData, name: e.target.value })}
                  />
                </TableCell>
                <TableCell
                  style={{
                    position: 'sticky',
                    left: 213,
                    backgroundColor: 'white',
                    zIndex: 1000,
                  }}
                >
                  <select
                    name="processTypes"
                    style={{ padding: '7px', width: '100%' }}
                    onChange={(e) =>
                      setNewModelData({
                        ...newModelData,
                        processtypeId: e.target.value,
                      })
                    }
                  >
                    <option value="">Type de process </option>
                    {processTypeList.map((p) => (
                      <option value={p.id}>{p.designation}</option>
                    ))}
                  </select>
                </TableCell>

                {data?.map((config) =>
                  config.causes?.map((cause) => (
                    <TableCell>
                      <Checkbox
                        checked={checkIn(newModelData.causes, cause.id)}
                        onClick={() => addRemoveCheck(cause.id)}
                      />
                    </TableCell>
                  )),
                )}

                <TableCell
                  style={{
                    position: 'sticky',
                    right: 0,
                    backgroundColor: 'white',
                    padding: 5,
                    zIndex: 1000,
                  }}
                >
                  <Button
                    variant="contained"
                    style={{ margin: 2 }}
                    size="small"
                    onClick={() => {
                      if (!newModelData.name) return toast.error(' Le champ designation est vide');
                      if (!newModelData.processtypeId) return toast.error('Choisir type de process');
                      const exist = models.filter((m) => m.name === newModelData.name);
                      if (exist.length > 0) return toast.error('Designation est deje existe');
                      addModel();
                    }}
                  >
                    Enregistrer
                  </Button>{' '}
                  <Button
                    variant="contained"
                    style={{ margin: 2 }}
                    size="small"
                    color="error"
                    onClick={() => {
                      setAddColumn(false);
                      setNewModelData({
                        name: '',
                        processtypeId: '',
                        causes: [],
                      });
                    }}
                  >
                    Annuler
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

const style = {
  display: 'flex',
  justifyContent: 'center',
};
