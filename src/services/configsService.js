import useHttpClient from '../hooks/useHttpClient';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { ConfigsContext } from 'context/ConfigsContext';

const useConfigsService = () => {
  const { sendRequest } = useHttpClient();
  const { configs, setConfigs } = useContext(ConfigsContext);

  const createCategory = async (data, callBack) => {
    try {
      const response = await sendRequest('configs/categories', 'post', { data });
      if (response.status === 200) {
        getConfigs();
        callBack();
        toast.success('Ajouter Avec Success');
      }
    } catch (error) {
      toast.error('Code déja existe');
    }
  };

  const editCategory = async (categoryData, callBack) => {
    try {
      const response = await sendRequest('configs/categories', 'put', { data: categoryData });
      if (response.status === 200) {
        toast.success('success');
        getConfigs();
        callBack();
      }
      return 'ok';
    } catch (error) {
      toast.error('error');
    }
  };

  const deleteCategory = async (data, callBack) => {
    try {
      const response = await sendRequest(`configs/categories/${data.pId}/${data.cId}`, 'delete', { data });
      if (response.status === 200) {
        getConfigs();
        callBack();
        toast.success('operation effectué avec succès');
      }
      return 'ok';
    } catch (error) {
      toast.error('error');
    }
  };

  const createCause = async (data, callBack) => {
    try {
      const response = await sendRequest('configs/causes', 'post', { data });
      if (response.status === 200) {
        getConfigs();
        callBack();
        toast.success('Ajouter Avec Success');
      }
    } catch (error) {
      toast.error('Code déja existe');
    }
  };

  const editCause = async (causeData, callBack) => {
    try {
      const response = await sendRequest('configs/causes', 'put', { data: causeData });
      if (response.status === 200) {
        toast.success('success');
        getConfigs();
        callBack();
      }
      return 'ok';
    } catch (error) {
      toast.error('error');
    }
  };

  const deleteCause = async (data, callBack) => {
    try {
      const response = await sendRequest(`configs/causes/${data.pId}/${data.cId}/${data.causeId}`, 'delete', { data });
      if (response.status === 200) {
        getConfigs();
        callBack();
        toast.success('operation effectué avec succès');
      }
      return 'ok';
    } catch (error) {
      toast.error('error');
    }
  };

  const getConfigs = async () => {
    try {
      const response = await sendRequest('configs', 'get');
      setConfigs([...response.data.configs]);
      console.log('response confgis', response);
      console.log('configs service', configs);
    } catch (error) {
      // toast.error('error')
    }
  };

  return { createCategory, editCategory, deleteCategory, createCause, editCause, deleteCause, getConfigs };
};

export default useConfigsService;
