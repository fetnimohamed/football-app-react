import { ConfigsContext } from 'context/ConfigsContext';
import useHttpClient from 'hooks/useHttpClient';
import { useContext } from 'react';
import { toast } from 'react-toastify';

const useMachineService = () => {
  const { sendRequest } = useHttpClient();
  const { setMachines } = useContext(ConfigsContext);

  const addMachine = async (machine) => {
    const response = await sendRequest('machines', 'post', machine);
    console.log('response', response.data.id?.pdtUsed);
    if (response) {
      // if (response.data.id?.pdtUsed) toast.warn('pdt déja utilisé !!');
      return response;
    }
  };
  const getAllMachines = async () => {
    const response = await sendRequest('machines', 'get');
    if (response) {
      if (typeof response.data !== 'string') setMachines([...response.data]);
      return response.data;
    }
  };

  const editMachine = async (data) => {
    const response = await sendRequest('machines', 'put', data);
    console.log(response);

    return response;
  };

  const deleteMachine = async (id) => {
    console.log(id);
    const response = await sendRequest('machines/' + id, 'delete');
    console.log(response);
    return response;
  };

  const editMachineReap = async (data) => {
    const response = await sendRequest('machineReap', 'put', data);
    return response;
  };
  const getReap = async (machineId) => {
    const response = await sendRequest('Reap', 'get', machineId);
    return response;
  };

  return {
    editMachine,
    addMachine,
    getAllMachines,
    deleteMachine,
    editMachineReap,
  };
};

export default useMachineService;
