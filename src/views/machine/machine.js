import {
  Button,
  ButtonBase,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  makeStyles,
  OutlinedInput,
  Paper,
  Stack,
} from '@material-ui/core';
import { Box } from '@material-ui/system';
import React, { Fragment, useEffect, useState } from 'react';
import { Modal } from '@material-ui/core';
import AddMachineForm from './addMachineForm';
import ListMachine from './listMachine';
import Tree from './Tree';
import { useTranslation } from 'react-i18next';
import useMachineService from '../../services/machineService';

const Machine = () => {
  const [machineData, setMachineData] = useState([]);
  const [showTree, setShowTree] = useState(false);
  const [openModal, setOpenModal] = useState();
  const { t, i18n } = useTranslation();
  const { getAllMachines } = useMachineService();
  //fet data //
  const getData = async () => {
    const data = await getAllMachines();
    if (data === 'machines not found') return;
    console.log('machine', data);
    setMachineData(data);
  };
  useEffect(async () => {
    getData();
  }, []);

  return (
    <>
      {/* <Stack direction="row" margin={1}>
        <h3>{t("MACHINE.CONFIG_MACHINE")}</h3>
      </Stack> */}

      <Box sx={{ '& button': { m: 1 }, display: 'flex', justifyContent: 'end' }}>
        <Box sx={{ borderRadius: 2, bgcolor: '#e6e9ec', margin: 1 }}></Box>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

        <Button
          disableElevation
          size="medium"
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            setShowTree(!showTree);
          }}
        >
          {showTree ? 'Liste' : 'Arboresence'}
        </Button>
        {!showTree ? (
          <Button
            disableElevation
            size="medium"
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            {t('MACHINE.ADD_NEW_MACHINE')}
          </Button>
        ) : (
          ''
        )}
      </Box>

      {showTree ? (
        <Fragment component={Paper}>
          <Tree machineData={machineData} />
        </Fragment>
      ) : (
        <ListMachine data={machineData} refreshData={() => getData()} />
      )}
      <Modal open={openModal}>
        <AddMachineForm
          callback={() => {
            setOpenModal(false);
            getData();
          }}
        />
      </Modal>
    </>
  );
};

export default Machine;
