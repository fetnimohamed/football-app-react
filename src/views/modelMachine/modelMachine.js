import React, { Fragment, useContext, useEffect, useState } from 'react';
import ModelMachineMatrix from './modelMachineMatrix';
import useConfigsService from '../../services/configsService';
import { ConfigsContext } from 'context/ConfigsContext';
import useModelsMachineService from 'services/modelsMachineService';
import useProcessTypeService from 'services/processTypeService';
import Modal from 'ui-component/modal/modal';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

export default function ModelMachine() {
  const { getConfigs, deleteCause, deleteCategory } = useConfigsService();
  const { configs, models, setModels } = useContext(ConfigsContext);
  const { getModelsMachine, deleteModel } = useModelsMachineService();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modelId, setModelId] = useState();
  const { t, i18n } = useTranslation();

  useEffect(async () => {
    getConfigs();
    getModelsMachine();
    console.log(models);
  }, []);

  const openDeleteModal = (id) => {
    setShowDeleteModal(true);
    setModelId(id);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setModelId();
  };

  const getData = (configs) => {
    const c = [];
    configs.forEach((config) => {
      config.categories
        .filter((c) => c.isActive === true)
        .forEach((category) => {
          if (category.causes) {
            const cc = category.causes.filter((cause) => cause.isGeneric === false && cause.isActive === true);
            if (cc.length > 0) {
              category.causes = cc;
              c.push(category);
            }
          }
        });
    });

    return c;
  };

  return (
    <Fragment>
      <ModelMachineMatrix
        data={getData(configs)}
        models={models}
        setModels={setModels}
        openDeleteModal={openDeleteModal}
      />

      <Modal
        title={t('MACHINE_MODEL.TOAST.DELETE_MACHINE_MODEL_ALERTE')}
        open={showDeleteModal}
        close={closeDeleteModal}
      >
        <Button variant="contained" onClick={() => deleteModel(modelId, closeDeleteModal)}>
          {' '}
          {t('GENERAL.YES')}{' '}
        </Button>{' '}
        <Button variant="contained" color="error" onClick={closeDeleteModal}>
          {' '}
          {t('GENERAL.NO')}{' '}
        </Button>
      </Modal>
    </Fragment>
  );
}
