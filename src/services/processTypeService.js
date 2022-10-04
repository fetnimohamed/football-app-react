import { ConfigsContext } from 'context/ConfigsContext';
import useHttpClient from 'hooks/useHttpClient';
import { useContext } from 'react';
import { toast } from 'react-toastify';

const useProcessTypeService = () => {
  const { sendRequest } = useHttpClient();
  const { setProcessTypes } = useContext(ConfigsContext);

  const addProcessType = async (processType) => {
    try {
      const response = await sendRequest('processtype', 'post', processType);
      console.log('response', response);
      if (response) {
        return response;
      }
    } catch (error) {
      toast.error('Erreur lors de la création de ce type de process');
    }
  };
  const getAllProcessTypes = async () => {
    const response = await sendRequest('processtype', 'get');
    console.log(response);
    if (response) {
      setProcessTypes(response.data);
      return response.data;
    }
  };

  const editProcessType = async (data) => {
    try {
      const response = await sendRequest('processtype', 'put', data);
      if (response) {
        return response;
      }
    } catch (error) {
      toast.error('Erreur lors de la modification de ce type de process');
    }
  };

  const deleteProcessType = async (id) => {
    console.log('id', id);
    const response = await sendRequest('processtype/' + id, 'delete');
    console.log('response delete', response);
    return response;
  };

  const getProcessTypeById = async (id) => {
    console.log(id);
    const response = await sendRequest('processtype/' + id, 'get');
    console.log('process type', response.data, id);
    return response.data;
  };

  const getAllModels = async () => {
    const response = await sendRequest('configsModel', 'get');
    console.log(response);
    if (response) {
      return response.data;
    }
  };

  return {
    addProcessType,
    getAllProcessTypes,
    editProcessType,
    deleteProcessType,
    getProcessTypeById,
    getAllModels,
  };
};

export default useProcessTypeService;
