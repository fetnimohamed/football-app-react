import React, { useEffect, useContext, useState } from 'react';
import { Typography } from '@material-ui/core';
import MainCard from 'ui-component/cards/MainCard';
import CustomizedTreeView from 'ui-component/treeView/treeView';

import useConfigsService from '../../services/configsService';
import { ConfigsContext } from 'context/ConfigsContext';
import Modal from 'ui-component/modal/modal';

import AddCategoryForm from './addCategoryForm';
import AddCauseForm from './addCauseForm';
import { Button } from '@material-ui/core';

const ConfigNonTrg = () => {
  const { getConfigs, deleteCause, deleteCategory } = useConfigsService();
  const { configs } = useContext(ConfigsContext);

  //category states
  const [categoryModal, setCategoryModal] = useState(false);
  const [categoryDeleteModal, setCategoryDeleteModal] = useState(false);
  const [perteId, setPerteId] = useState();
  const [categoryId, setCategoryId] = useState();
  const [editCategoryData, setEditCategoryData] = useState(null);

  //cause states
  const [causeModal, setCauseModal] = useState(false);
  const [causeDeleteModal, setCauseDeleteModal] = useState(false);
  const [editCauseData, seteditCauseData] = useState(null);
  const [causeId, setCauseId] = useState();

  // category functions
  const openCategoryModal = (pId, categoryData) => {
    setPerteId(pId);
    setCategoryModal(true);
    if (categoryData) setEditCategoryData(categoryData);
  };

  const closeCategoryModal = () => {
    setCategoryModal(false);
    setEditCategoryData(null);
  };

  const openCategoryDeleteModal = (cId, pId) => {
    setCategoryDeleteModal(true);
    setCategoryId(cId);
    setPerteId(pId);
  };

  // cause functions

  const openCauseModal = (pId, cId, causeData) => {
    setPerteId(pId);
    setCategoryId(cId);
    setCauseModal(true);
    if (causeData) seteditCauseData(causeData);
  };

  const closeCauseModal = () => {
    setCauseModal(false);
    seteditCauseData(null);
    setPerteId(null);
    setCategoryId(null);
  };

  const openCauseDeleteModal = (pId, cId, causeId) => {
    setCauseDeleteModal(true);
    setCategoryId(cId);
    setPerteId(pId);
    setCauseId(causeId);
  };

  useEffect(() => {
    getConfigs();
  }, []);

  return (
    <MainCard title="">
      <Typography variant="body2">
        <CustomizedTreeView
          data={configs}
          openCategoryModal={openCategoryModal}
          openCategoryDeleteModal={openCategoryDeleteModal}
          openCauseModal={openCauseModal}
          openCauseDeleteModal={openCauseDeleteModal}
        />
      </Typography>

      {/* Category modals */}
      <Modal
        title={editCategoryData ? 'Editer Une Categorie' : 'Ajouter Une Categorie'}
        open={categoryModal}
        close={closeCategoryModal}
      >
        <AddCategoryForm closeModal={closeCategoryModal} pId={perteId} editCategoryData={editCategoryData} />
      </Modal>

      <Modal title={'Supprimer Categorie?'} open={categoryDeleteModal} close={() => setCategoryDeleteModal(false)}>
        <Button
          variant="contained"
          onClick={() => deleteCategory({ cId: categoryId, pId: perteId }, () => setCategoryDeleteModal(false))}
        >
          {' '}
          Oui{' '}
        </Button>{' '}
        <Button variant="contained" color="error" onClick={() => setCategoryDeleteModal(false)}>
          {' '}
          Annuler{' '}
        </Button>
      </Modal>

      {/* Cause modals */}
      <Modal title={editCauseData ? 'Editer Une Cause' : 'Ajouter Cause'} open={causeModal} close={closeCauseModal}>
        <AddCauseForm closeModal={closeCauseModal} pId={perteId} cId={categoryId} editCauseData={editCauseData} />
      </Modal>

      <Modal title={'Supprimer Cause?'} open={causeDeleteModal} close={() => setCauseDeleteModal(false)}>
        <Button
          variant="contained"
          onClick={() => deleteCause({ cId: categoryId, pId: perteId, causeId }, () => setCauseDeleteModal(false))}
        >
          {' '}
          Oui{' '}
        </Button>{' '}
        <Button variant="contained" color="error" onClick={() => setCauseDeleteModal(false)}>
          {' '}
          Annuler{' '}
        </Button>
      </Modal>
    </MainCard>
  );
};
export default ConfigNonTrg;
