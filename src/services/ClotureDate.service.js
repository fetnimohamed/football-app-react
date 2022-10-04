import useHttpClient from '../../src/hooks/useHttpClient';
import { toast } from 'react-toastify';

const useClotureDataService = () => {
  const { sendRequest } = useHttpClient();

  const getpassation = async (data) => {
    const response = await sendRequest('history-passation', 'post', { ...data });
    if (response.status === 200) {
      console.log(response);
      return response.data;
    } else {
      toast.warn('Données introuvables');
    }
  };
  const getEtat = async (data) => {
    const response = await sendRequest('machine/status/history', 'post', { ...data });
    console.log(response);
    if (response.status == 201) {
      console.log(response);

      return response.data;
    } else {
      toast.warn('Données introuvables');
    }
  };
  return { getpassation, getEtat };
};

export default useClotureDataService;
