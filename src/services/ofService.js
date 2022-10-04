import { AuthContext } from 'context/AuthContext';
import { ConfigsContext } from 'context/ConfigsContext';
import useHttpClient from 'hooks/useHttpClient';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import useConfigsService from './configsService';

const useOfService = () => {
  const { sendRequest } = useHttpClient();
  const { matricule, setMatricule, machine } = useContext(AuthContext);

  const addOF = async (data) => {
    try {
      const response = await sendRequest('OFinProgress', 'post', data);
      console.log('response', response);
      if (response.status === 200) {
        return response;
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout de cet OF");
    }
  };
  const getAllOfByMachine = async (machineId) => {
    try {
      const response = await sendRequest('OFinProgress/' + machineId, 'get');
      if (response) {
        console.log('OF', response);
        return response.data;
      }
    } catch (err) {
      toast.error("Erreur lors de l'affichage des OFs");
    }
  };

  const getAllOf = async () => {
    const response = await sendRequest('fabricationOrder', 'get');
    console.log('process type', response.data);
    return response.data;
  };
  const getCorrectionData = async (data) => {
    console.log(data);
    const response = await sendRequest('OFCorrection/' + data.of + '/' + data.machine, 'get');

    return response.data.correctionData;
  };

  const editOF = async (data, machine) => {
    try {
      const response = await sendRequest('OFinProgress/' + machine, 'put', data);
      console.log('response', response);
      if (response) {
        return response;
      }
    } catch (error) {
      toast.error('Erreur lors de la modifcation de cet OF');
    }
  };

  const editOFStatus = async (data) => {
    try {
      const response = await sendRequest('OFinProgress', 'put', data);

      if (response) {
        return response;
      }
    } catch (error) {
      toast.error('Erreur lors de la modifcation de cet OF');
    }
  };

  const getOFById = async (of) => {
    try {
      const response = await sendRequest('fabricationOrder/' + of, 'get');
      if (response) {
        return response;
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression de cet OF');
    }
  };

  const getOFByState = async (data) => {
    try {
      const response = await sendRequest('OfState', 'post', data);
      if (response) {
        return response;
      }
    } catch (error) {
      toast.error('Erreur lors de l...');
    }
  };
  return {
    addOF,
    getAllOf,
    editOF,
    getOFById,
    editOFStatus,
    getAllOfByMachine,
    getCorrectionData,
    getOFByState,
  };
};

export default useOfService;
