import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { Modal, Button, Box, Stack } from '@material-ui/core';
import styled from 'styled-components';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as yup from 'yup';
import useImportOrdersService from 'services/importOrdersService';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';

import ImportOutput from './importOutput';
import ConfirmImport from './confirmImport';
const Input = styled.input`
  font-size: 14px;
  padding: 10px;
  margin: 10px;
  background: papayawhip;
  border: none;
  border-radius: 3px;
  ::placeholder {
    color: palevioletred;
  }
`;
const ImportOF = ({ processTypeId }) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const exportToCSV = () => {
    if (of.length > 0) {
      let csvData = of.map((order) => {
        return {
          mois: order.mois,
          'Orig.bes.': order.of,
          article: order.articleCode,
          'désignation article': order.designation,
          Besoins: order.duration,
          'Ps.trav.': order.machine,
          fin: order.end,
          début: order.start,
          '   Qté orig. bes.': order.quantity,
        };
      });
      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, 'CM01' + fileExtension);
    } else {
      toast.error('pas de donnée');
    }
  };
  ///////service importation zone////////
  const { importOrders, getOrders } = useImportOrdersService();
  ////use state zone//////
  const [of, setOf] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [data, setData] = useState({});
  const [file, setFile] = useState({});
  ////get data function zone/////
  const getData = async () => {
    try {
      // TODO clear comment
      const orders = await getOrders();
      console.log(orders.data);
      setOf(orders.data);
    } catch (err) {
      console.log('Failed Orders loading !', err.message);
      setOf([]);
    }
  };
  //////loading spinner\\\\\\\
  const Spinner = () => {
    if (loading) {
      return <CircularProgress />;
    } else {
      return <></>;
    }
  };
  //////use effect zone///////
  useEffect(() => {}, []);
  return (
    <>
      <div className="container">
        <Formik
          initialValues={{ file: null }}
          onSubmit={async (values) => {
            console.log(values);
            const formData = new FormData();
            formData.append('file', values.file);
            formData.append('processId', processTypeId);

            console.log(formData);
            if (values.file.name.split('.').pop() === 'xlsx') {
              setLoading(true);

              const response = await importOrders(formData);
              if (response.status) {
                toast.error(response.message);
                setLoading(false);
                return;
              }
              console.log(JSON.parse(response.replaceAll('*', '')), response.split('*'));
              setData(JSON.parse(response.replaceAll('*', '')));
              setLoading(false);
              setOpenModal(true);
            } else {
              toast.error("merci d'introduire un format valide");
            }
          }}
          validationSchema={yup.object().shape({
            file: yup.mixed().required('pas de fichier!!'),
          })}
          render={({ values, handleSubmit, setFieldValue }) => {
            return (
              <Form>
                <Stack direction="row" alignItems="center" justifyContent="center" margin={2}>
                  <Input
                    id="file"
                    type="file"
                    accept=".xlsx"
                    onChange={(event) => {
                      var ext = event.currentTarget.files[0].name.split('.').pop();
                      console.log(ext, 'here is the extention');

                      setFieldValue('file', event.currentTarget.files[0]);
                    }}
                    disabled={processTypeId ? false : true}
                  />
                  <Box
                    sx={{
                      '& button': { m: 1 },
                      display: 'flex',
                      justifyContent: 'end',
                    }}
                  >
                    <Button
                      size="sm"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        if (values.file) setOpenImportModal(true);
                      }}
                      disabled={values.file ? false : true}
                    >
                      Importer
                    </Button>
                    <Spinner />
                    <Button
                      size="sm"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        getData();
                        exportToCSV();
                      }}
                      disabled={processTypeId ? false : true}
                    >
                      Exporter
                    </Button>
                  </Box>
                </Stack>
                <Modal open={openModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                  {
                    <ImportOutput
                      data={data}
                      close={() => {
                        setOpenModal(false);
                        window.location.reload();
                      }}
                    />
                  }
                </Modal>
                <Modal
                  open={openImportModal}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  {<ConfirmImport callback={() => setOpenImportModal(false)} submit={handleSubmit} />}
                </Modal>
              </Form>
            );
          }}
        />
      </div>
    </>
  );
};
export default ImportOF;
