import useHttpClient from '../hooks/useHttpClient';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { ConfigsContext } from 'context/ConfigsContext';

const useModelsMachineService = () => {
  const { sendRequest } = useHttpClient();
  const { setModels, setConfigs } = useContext(ConfigsContext);

  const createModelMachine = async (data, callBack) => {
    try {
      const response = await sendRequest('configsModel', 'post', { ...data });
      if (response.status === 200) {
        getModelsMachine();
        callBack();
        toast.success('Ajouté Avec Success');
      }
    } catch (error) {
      toast.error('Code déja existe');
    }
  };

  const editModelMachine = async (data, callBack) => {
    try {
      const response = await sendRequest('configsModel', 'put', { data });
      if (response.status === 200) {
        toast.success('success');
        getModelsMachine();
        callBack();
      }
      return 'ok';
    } catch (error) {
      toast.error('error');
    }
  };

  const deleteModel = async (modelId, callBack) => {
    try {
      const response = await sendRequest(`configsModel/${modelId}`, 'delete');
      if (response.status === 201) {
        callBack();
        toast.error('Suppression non possible ! Ce modèle est liée à une machine');
      }
      if (response.status === 200) {
        getModelsMachine();
        callBack();
        toast.success('operation effectué avec succès');
      }
      return 'ok';
    } catch (error) {
      toast.error('error');
    }
  };

  const getModelsMachine = async () => {
    try {
      const response = await sendRequest('configsModel', 'get');
      if (response.data.models) {
        setModels(response.data.models);
        console.log(response.data.models);
        return response.data.models;
      }
    } catch (error) {
      toast.error('error');
      return 'error';
    }
  };

  const editOVMachines = async (data) => {
    try {
      const response = await sendRequest('ovMachines', 'put', { data });
      return 'ok';
    } catch (error) {
      toast.error('error');
    }
  };

  const editOVMachinesSpec = async (data) => {
    try {
      const response = await sendRequest('ovMachines/spec', 'put', { data });
      return 'ok';
    } catch (error) {
      toast.error('error');
    }
  };

  return {
    createModelMachine,
    editModelMachine,
    getModelsMachine,
    deleteModel,
    editOVMachines,
    editOVMachinesSpec,
  };
};

export default useModelsMachineService;
