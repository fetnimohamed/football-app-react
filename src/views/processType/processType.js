import {
  Button,
  Chip,
  ListItem,
  Modal,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import React, { useContext, useEffect, useState } from 'react';
import useProcessTypeService from 'services/processTypeService';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import AddProcessType from './addProcessTypeForm';
import ConfirmDelete from './confirmDelete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ProcessTypeDetails from './processTypeDetails';
import { useTranslation } from 'react-i18next';
import { Box } from '@material-ui/system';
import { toast } from 'react-toastify';
import useModelsMachineService from 'services/modelsMachineService';
import { ConfigsContext } from 'context/ConfigsContext';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ProcessType() {
  const { getAllProcessTypes, deleteProcessType } = useProcessTypeService();
  const { getModelsMachine } = useModelsMachineService();
  const { models } = useContext(ConfigsContext);

  const [processTypedata, setProcessTypedata] = useState([]);
  const [open, setOpen] = useState();
  const [displayDetailsModal, setDisplayDetailsModal] = useState();
  const [openDeleteModal, setOpenDeleteModal] = useState();
  const [processType, setProcessType] = useState();
  const [existData, setExistData] = useState([]);
  const [openEdit, setOpenEdit] = useState();

  const { t, i18n } = useTranslation();
  async function getAllData() {
    const data = await getAllProcessTypes();
    if (data === 'process types not found') return;
    setProcessTypedata(data);
  }
  useEffect(async () => {
    getAllData();
    await getModelsMachine();
  }, []);

  return (
    <>
      {/* <Stack direction="row" margin={1}>
        <h3>{t('PROCESS_TYPE.CONFIG_PROCESS_TYPE')}</h3>
      </Stack> */}
      <Stack direction="row" alignItems="end" justifyContent="end" margin={2}>
        <Button
          disableElevation
          size="large"
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          {t('PROCESS_TYPE.ADD_NEW_PROCESS_TYPE')}
        </Button>
        <Modal open={open}>
          <AddProcessType
            callback={() => {
              setOpen(false);
              getAllData();
            }}
          />
        </Modal>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" sx={{ fontWeight: 500 }}>
                {t('GENERAL.DESIGNATION')}
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ fontWeight: 500 }}>
                {t('GENERAL.CODE')}
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ fontWeight: 500 }}>
                {t('GENERAL.ATTRIBUTES')}
              </StyledTableCell>
              <StyledTableCell align="center" sx={{ fontWeight: 500 }}>
                {t('GENERAL.ACTIONS')}
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {processTypedata.map((row, index) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell align="center" style={{ width: '25%' }} component="th" scope="row">
                  {row.designation}
                </StyledTableCell>
                <StyledTableCell style={{ width: '25%' }} align="center">
                  {row.code_processType}
                </StyledTableCell>
                {row.attributes.length > 4 ? (
                  <StyledTableCell style={{ width: '25%' }} align="center">
                    {row.attributes.slice(0, 4).map((data) => {
                      return <Chip sx={{ margin: 0.5 }} label={data} />;
                    })}
                    ...
                  </StyledTableCell>
                ) : (
                  <StyledTableCell style={{ width: '25%' }} align="center">
                    {row.attributes.map((data) => {
                      return <Chip sx={{ margin: 0.5 }} label={data} />;
                    })}
                  </StyledTableCell>
                )}
                <StyledTableCell style={{ width: '25%' }} align="center">
                  <VisibilityIcon
                    onClick={() => {
                      setProcessType(row);
                      setDisplayDetailsModal(true);
                    }}
                  />
                  <CreateIcon
                    onClick={() => {
                      setExistData(row);
                      setOpenEdit(true);
                    }}
                  />
                  <DeleteIcon
                    onClick={() => {
                      const exist = models?.filter((m) => m.processtypeId === row.id);
                      if (exist.length > 0)
                        return toast.error(
                          'Suppression non possible ! Ce type de process est liée à un modèle de machine',
                        );
                      setProcessType(row);
                      setOpenDeleteModal(true);
                    }}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <Modal open={openEdit}>
          <AddProcessType
            existProcessType={existData}
            callback={() => {
              setOpenEdit(false);
              getAllData();
            }}
          />
        </Modal>
        <Modal open={openDeleteModal}>
          <ConfirmDelete
            data={processType}
            callback={() => {
              getAllProcessTypes();
              setOpenDeleteModal(false);
            }}
            deleteProcessType={() => {
              console.log(processType);
              deleteProcessType(processType.id).then((res) => {
                if (res.status === 200) {
                  getAllData();
                  setOpenDeleteModal(false);
                  toast.success(t('PROCESS_TYPE.TOAST.DELETE_SUCESS'));
                } else if (res.status === 201) {
                  toast.warning(t('PROCESS_TYPE.TOAST.PROCESS_TYPE_USED'));
                } else {
                  toast.error(t('PROCESS_TYPE.TOAST.DELETE_ERROR'));
                }
              });
            }}
          />
        </Modal>
        <Modal open={displayDetailsModal}>
          <ProcessTypeDetails
            data={processType}
            callback={() => {
              setDisplayDetailsModal(false);
            }}
          />
        </Modal>
      </TableContainer>
    </>
  );
}
