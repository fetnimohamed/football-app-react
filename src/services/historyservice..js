import useHttpClient from '../../src/hooks/useHttpClient';
import { toast } from 'react-toastify';

const useClotureDataService = () => {
  const { sendRequest } = useHttpClient();

  const getHistory = async (data) => {
    const response = await sendRequest('config-trg/history', 'get');
    if (response.data.status == 401) {
      toast.warn(response.data.errors[0]);
      return [];
    }
    if (response) {
      console.log(response.data);

      return response.data;
    }
  };

  const getpassation = async (data) => {
    const response = await sendRequest('config-trg/historyPassation', 'post', {
      ...data,
    });
    console.log(response);
    if (response.status == 201) {
      console.log(response);

      return response.data;
    } else {
      toast.warn('données introuvable');
    }
  };
  const getEtat = async (data) => {
    const response = await sendRequest('machine/status/history', 'post', {
      ...data,
    });
    console.log(response);
    if (response.status == 201) {
      console.log(response);

      return response.data;
    } else {
      return toast.warn('données introuvable');
    }
  };
  return { getpassation, getEtat, getHistory };
};

export default useClotureDataService;
