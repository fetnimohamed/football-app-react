import React, { useState } from 'react';
import moment from 'moment';
import { Table, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { IconPlus, IconPencil, IconTrash } from '@tabler/icons';

import {
  getHours,
  getMinutes,
  checkData,
  getPerte,
  getCategory,
  getCause,
  getFullTime,
  getDiffrenceInHours,
  checkLimit,
} from '../fichesuiveuse/utils';
import { useEffect } from 'react';
import Modal from 'ui-component/modal/modal';
import { toast } from 'react-toastify';

import DatePicker from 'react-datepicker';
import { addDays, setHours, setMinutes } from 'date-fns';

export default function TableMachines({ machineStatusData, configs, setOpenModal, correctionData, limit }) {
  let [data, setData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [position, setPosition] = useState(null);
  const [index, setIndex] = useState(null);
  let [periode, setPeriode] = useState(null);
  const [newPeriode, setNewPeriode] = useState(false);

  const selectStyle = { width: 200, margin: 1 };

  useEffect(() => {
    setData(machineStatusData.machineStatus);
  }, []);

  //check disabled
  const checkDisabled = (propertyName) => {
    if (newPeriode) return false;
    const condition1 = periode?.pId === data[data.length - 1]?.pId;
    const condition2 = periode?.cId === data[data.length - 1]?.cId;
    const condition3 = periode?.causeId === data[data.length - 1]?.causeId;
    if (propertyName === 'end' && condition1 && condition2 && condition3) return true;
    return false;
  };

  //open add modal
  const openAddModal = () => {
    setNewPeriode(true);
    setPeriode({ pId: 0, cId: 0, causeId: 0, start: data[data.length - 1].end, end: data[data.length - 1].end });
    setPosition(0);
    setAddModal(true);
  };

  //close add modal
  const closeAddModal = () => {
    setAddModal(false);
    setPosition(null);
    setPeriode(null);
    setNewPeriode(false);
  };

  //open edit modal
  const openEditModal = (index) => {
    setIndex(index);
    setPeriode(Object.assign({}, data[index]));
    setEditModal(true);
  };
  //close edit modal
  const closeEditModal = (index) => {
    setIndex(null);
    setEditModal(false);
  };

  //open delete modal
  const openDeleteModal = (index) => {
    if (data.length === 1) return;
    setIndex(index);
    setPeriode(Object.assign({}, data[index]));
    setDeleteModal(true);
  };

  //close delete modal
  const closeDeleteModal = () => {
    setIndex(null);
    setDeleteModal(false);
  };

  // handle add periode
  const handleAddPeriode = () => {
    data.splice(position, 0, { ...periode, pId: parseInt(periode.pId) });
    setData([...data]);
    closeAddModal();
  };

  // handle edit periode
  const handleEditPeriode = () => {
    if (!moment(periode.end).isSame(moment(data[index].end))) {
      if (data[index + 1]) data[index + 1].start = periode.end;
    }
    if (!moment(periode.start).isSame(moment(data[index].start))) {
      if (data[index - 1]) data[index - 1].end = periode.start;
    }
    data[index] = { ...periode, pId: parseInt(periode.pId) };
    setData([...data]);
    closeEditModal();
  };

  // handle delete periode
  const handleDeletePeriode = () => {
    console.log('delete ', index, periode, data[index]);
    if (index != 0) {
      data[index - 1].end = data[index].end;
    } else {
      data[index + 1].start = data[index].start;
    }
    data = data.filter((d, i) => i !== index);
    setData([...data]);
    closeDeleteModal();
  };

  const handleGlobalChange = (index, propertyName, value) => {
    if (propertyName === 'pId') {
      periode[propertyName] = value;
      periode.cId = 0;
      periode.causeId = 0;
    }
    periode[propertyName] = value;
    periode = { ...periode };
    setPeriode(periode);
  };

  const handleChangeHours = (propertyName, value) => {
    let date = new Date(periode[propertyName]).setHours(parseInt(value));
    let start = getHours(machineStatusData.startQuart);
    let end = getHours(machineStatusData.endQuart);
    if (end < start) {
      if (getHours(periode.start) > getHours(periode.end) && end >= getHours(periode.end)) {
        date = new Date(date).setDate(new Date(date).getDate() + 1);
      }
    }
    periode[propertyName] = new Date(date);
    setPeriode({ ...periode });
  };

  const handleChangeMinutes = (propertyName, value) => {
    periode[propertyName] = new Date(new Date(periode[propertyName]).setMinutes(value));
    setPeriode({ ...periode });
  };

  const pertesSelect = (pId, index) => {
    return (
      <select onChange={(e) => handleGlobalChange(index, 'pId', e.target.value)} style={selectStyle}>
        <option value={0} selected={pId === 0}>
          Cycle Standard
        </option>
        {configs
          .filter((config) => config.id !== 6 && config.id !== 7)
          .map((config) => (
            <option value={config.id} selected={config.id === pId}>
              {config.label}
            </option>
          ))}
      </select>
    );
  };

  const categoriesSelect = (pId, cId, index) => {
    if (pId === 0) return '';
    return (
      <select onChange={(e) => handleGlobalChange(index, 'cId', e.target.value)} style={selectStyle}>
        <option value={0} selected={cId === 0}>
          Choisir une catégorie
        </option>

        {configs[pId - 1]?.categories?.map((category) => (
          <option value={category.id} selected={category.id === cId}>
            {category.designation}
          </option>
        ))}
      </select>
    );
  };

  const causesSelect = (pId, cId, causeId, index) => {
    if (pId === 0) return '';
    return (
      <select onChange={(e) => handleGlobalChange(index, 'causeId', e.target.value)} style={selectStyle}>
        <option value={0} selected={causeId === 0}>
          Choisir une cause
        </option>
        {configs[pId - 1]?.categories
          ?.find((category) => category.id === cId)
          ?.causes.map((cause) => (
            <option value={cause.id} selected={cause.id === causeId}>
              {cause.designation}
            </option>
          ))}
      </select>
    );
  };

  const positionSelect = () => {
    return (
      <select onChange={(e) => setPosition(e.target.value)} style={selectStyle}>
        {data.map((d, i) => (
          <option value={i} selected={i === position}>
            {i + 1}
          </option>
        ))}
        <option value={data.length} selected={data.length === position}>
          {data.length + 1}
        </option>
      </select>
    );
  };

  //handle validate
  const handleValidate = async () => {
    const startDate = new Date(data[0].start);
    const endDate = new Date(data[data.length - 1].end);
    const startQuart = new Date(machineStatusData.startQuart);
    const endQuart = new Date(machineStatusData.endQuart);

    if (startDate.getHours() !== startQuart.getHours()) return toast.error('données invalides');
    if (startDate.getMinutes() !== startQuart.getMinutes()) return toast.error('données invalides');
    // if(endDate.getHours() !== endQuart.getHours() ) return toast.error('données invalides');
    // if(endDate.getMinutes() !== endQuart.getMinutes() ) return toast.error('données invalides');
    if (!checkData(data)) return toast.error('données invalides');
    await correctionData(data);
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  /* 
             const filterPassedTime = (time, start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const selectedDate = new Date(time);

    return startTime.getTime() > selectedDate.getTime() || endTime.getTime() < selectedDate.getTime();
  };
  */

  return (
    <>
      <Button variant="contained" color="primary" style={{ margin: '8px' }} onClick={handleValidate}>
        Sauvegarder les changements
      </Button>
      <span style={{ cursor: 'default' }} onClick={openAddModal}>
        <IconPlus style={{ position: 'relative', top: 8 }} />
        Absence état
      </span>
      <div>
        <span style={{ margin: 3 }}>Début Quart : {getFullTime(machineStatusData.startQuart)}</span>
        <span style={{ margin: 3 }}>Fin Quart : {getFullTime(machineStatusData.endQuart)}</span>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>état</TableCell>
              <TableCell>éditeur</TableCell>
              <TableCell>Categorie</TableCell>
              <TableCell>Cause</TableCell>
              <TableCell>Début</TableCell>
              <TableCell>Fin</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{getPerte(configs, row.pId)?.label}</TableCell>
                <TableCell>{machineStatusData?.compagnon}</TableCell>
                <TableCell>{getCategory(configs, row.pId, row.cId)?.designation}</TableCell>
                <TableCell>{getCause(configs, row.pId, row.cId, row.causeId)?.designation}</TableCell>
                <TableCell>{getFullTime(row.start)}</TableCell>
                <TableCell>{getFullTime(row.end)}</TableCell>
                <TableCell>
                  {true && <IconPencil onClick={() => openEditModal(index)} />}
                  {data.length > 1 && <IconTrash onClick={() => openDeleteModal(index)} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* edit modal */}
      <Modal open={editModal} close={closeEditModal}>
        <div style={{ padding: 2 }}>
          <pre>
            <div>Perte : {pertesSelect(periode?.pId, index)}</div> <br />
            <div>Categorie: {categoriesSelect(periode?.pId, periode?.cId, index)}</div> <br />
            <div>Cause : {causesSelect(periode?.pId, periode?.cId, periode?.causeId, index)}</div>
            <br />
            <div>
              Début :{' '}
              <DatePicker
                selected={new Date(periode ? periode?.start : new Date())}
                onChange={(date) => setPeriode({ ...periode, start: date })}
                locale="pt-BR"
                showTimeSelect
                minTime={setHours(
                  setMinutes(new Date(), getMinutes(machineStatusData.startQuart)),
                  getHours(machineStatusData.startQuart),
                )}
                maxTime={setHours(
                  setMinutes(new Date(), getMinutes(machineStatusData.endQuart)),
                  getHours(machineStatusData.endQuart),
                )}
                minDate={new Date(machineStatusData.startQuart)}
                maxDate={
                  getHours(machineStatusData.startQuart) > getHours(machineStatusData.endQuart)
                    ? addDays(new Date(machineStatusData.startQuart), 1)
                    : new Date(machineStatusData.startQuart)
                }
                timeFormat="HH:mm"
                timeIntervals={30}
                dateFormat="MM/d/yyyy, HH:mm"
              />
            </div>
            <br />
            <div>
              Fin :{' '}
              <DatePicker
                selected={new Date(periode ? periode?.end : new Date())}
                onChange={(date) => setPeriode({ ...periode, end: date })}
                locale="pt-BR"
                showTimeSelect
                minTime={setHours(
                  setMinutes(new Date(), getMinutes(machineStatusData.startQuart)),
                  getHours(machineStatusData.startQuart),
                )}
                maxTime={setHours(
                  setMinutes(new Date(), getMinutes(machineStatusData.endQuart)),
                  getHours(machineStatusData.endQuart),
                )}
                minDate={new Date(machineStatusData.startQuart)}
                maxDate={
                  getHours(machineStatusData.startQuart) > getHours(machineStatusData.endQuart)
                    ? addDays(new Date(machineStatusData.startQuart), 1)
                    : new Date(machineStatusData.startQuart)
                }
                timeFormat="HH:mm"
                timeIntervals={30}
                dateFormat="MM/d/yyyy, HH:mm"
              />
            </div>
            <br />
            <div>
              <Button color="primary" variant="contained" onClick={handleEditPeriode}>
                Modifier
              </Button>{' '}
              <Button color="error" variant="contained" onClick={closeEditModal}>
                Annuler
              </Button>
            </div>
            <br />
          </pre>
        </div>
      </Modal>

      {/* delete modal */}
      <Modal open={deleteModal} close={closeDeleteModal} title={'Supprimer cette état?'}>
        <Button color="primary" variant="contained" onClick={handleDeletePeriode}>
          Oui
        </Button>{' '}
        <Button color="error" variant="contained" onClick={closeDeleteModal}>
          Non
        </Button>
      </Modal>

      {/* add modal */}
      <Modal open={addModal} close={closeAddModal}>
        <div style={{ padding: 2 }}>
          <pre>
            <div>Perte : {pertesSelect(periode?.pId, index)}</div> <br />
            <div>Categorie: {categoriesSelect(periode?.pId, periode?.cId, index)}</div> <br />
            <div>Cause : {causesSelect(periode?.pId, periode?.cId, periode?.causeId, index)}</div>
            <br />
            <div>Position : {positionSelect()}</div>
            <br />
            <div>
              Début :{' '}
              <DatePicker
                selected={new Date(periode ? periode?.start : new Date())}
                onChange={(date) => setPeriode({ ...periode, start: date })}
                locale="pt-BR"
                minTime={setHours(
                  setMinutes(new Date(), getMinutes(machineStatusData.startQuart)),
                  getHours(machineStatusData.startQuart),
                )}
                maxTime={setHours(
                  setMinutes(new Date(), getMinutes(machineStatusData.endQuart)),
                  getHours(machineStatusData.endQuart),
                )}
                minDate={new Date(machineStatusData.startQuart)}
                maxDate={
                  getHours(machineStatusData.startQuart) > getHours(machineStatusData.endQuart)
                    ? addDays(new Date(machineStatusData.startQuart), 1)
                    : new Date(machineStatusData.startQuart)
                }
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                dateFormat="MM/d/yyyy, HH:mm"
              />
            </div>
            <br />
            <div>
              Fin :{' '}
              <DatePicker
                selected={new Date(periode ? periode?.end : new Date())}
                onChange={(date) => setPeriode({ ...periode, end: date })}
                locale="pt-BR"
                minDate={new Date(machineStatusData.startQuart)}
                minTime={setHours(
                  setMinutes(new Date(), getMinutes(machineStatusData.startQuart)),
                  getHours(machineStatusData.startQuart),
                )}
                maxTime={setHours(
                  setMinutes(new Date(), getMinutes(machineStatusData.endQuart)),
                  getHours(machineStatusData.endQuart),
                )}
                maxDate={
                  getHours(machineStatusData.startQuart) > getHours(machineStatusData.endQuart)
                    ? addDays(new Date(machineStatusData.startQuart), 1)
                    : new Date(machineStatusData.startQuart)
                }
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                dateFormat="MM/d/yyyy, HH:mm"
              />
            </div>
            <br />
            <div>
              <Button color="primary" variant="contained" onClick={handleAddPeriode}>
                Modifier
              </Button>{' '}
              <Button color="error" variant="contained" onClick={closeAddModal}>
                Annuler
              </Button>
            </div>
            <br />
          </pre>
        </div>
      </Modal>
    </>
  );
}
