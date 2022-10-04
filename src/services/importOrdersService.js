import useHttpClient from '../../src/hooks/useHttpClient';
import { toast } from 'react-toastify';

const useImportOrdersService = () => {
  const { sendRequest } = useHttpClient();

  const importOrders = async (data) => {
    const response = await sendRequest('fabricationOrder/import', 'post', data);
    if (response) {
      console.log(response.data);

      return response.data;
    }
  };
  const getOrdersHistory = async (machine, quart) => {
    try {
      const response = await sendRequest('fabricationOrder/history/' + machine + '/' + quart, 'get');
      return response.data;
    } catch (err) {
      toast.error('Un problème est survenue..');
    }
  };
  const getOrders = async () => {
    const response = await sendRequest('fabricationOrder', 'get');
    if (response) {
      console.log(response);
      return response;
    }
  };
  return { importOrders, getOrders, getOrdersHistory };
};

export default useImportOrdersService;
