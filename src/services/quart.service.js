import { ConfigsContext } from 'context/ConfigsContext';
import useHttpClient from 'hooks/useHttpClient';
import { useContext } from 'react';
import { toast } from 'react-toastify';

const useQuartService = () => {
  const { sendRequest } = useHttpClient();
  const { machines } = useContext(ConfigsContext);

  const m = machines.map((machine) => machine.id);

  const addquart = async (quart) => {
    const response = await sendRequest('quarts/', 'post', {
      ...quart,
      detail_semaine: {
        l: { ...quart.detail_semaine.l, machines: [[...m], [...m], [...m], [...m]] },
        m: { ...quart.detail_semaine.m, machines: [[...m], [...m], [...m], [...m]] },
        me: { ...quart.detail_semaine.me, machines: [[...m], [...m], [...m], [...m]] },
        j: { ...quart.detail_semaine.j, machines: [[...m], [...m], [...m], [...m]] },
        v: { ...quart.detail_semaine.v, machines: [[...m], [...m], [...m], [...m]] },
        s: { ...quart.detail_semaine.s, machines: [[...m], [...m], [...m], [...m]] },
        d: { ...quart.detail_semaine.d, machines: [[...m], [...m], [...m], [...m]] },
      },
    });
    if (response) {
      return response;
    }
  };

  const getallquarts = async () => {
    console.log('loaading');
    const response = await sendRequest('quarts/', 'get');
    if (response) {
      return response.data;
    }
  };
  const editquart = async (data) => {
    const response = await sendRequest('quarts/', 'put', data);
    return response;
  };
  const deletequart = async (id) => {
    const response = await sendRequest('quarts/' + id, 'delete');

    return response;
  };
  const addquartspec = async (quart) => {
    const response = await sendRequest('specificquarts/', 'post', {
      ...quart,
      Machines: [[...m], [...m], [...m], [...m]],
    });
    if (response) {
      return response;
    }
  };

  const getallquartsspec = async () => {
    console.log('loaading');
    const response = await sendRequest('specificquarts/', 'get');
    if (response) {
      return response.data;
    }
  };
  const editquartspec = async (data) => {
    const response = await sendRequest('specificquarts/', 'put', { ...data });
    return response;
  };
  const deletequartspec = async (id) => {
    const response = await sendRequest('specificquarts/' + id, 'delete');

    return response;
  };
  const compare_dates = async (data) => {
    const response = await sendRequest('compare/', 'post', { ...data });
    return response;
  };
  const getQuartdetails = async () => {
    try {
      const response = await sendRequest('current/quartdata');
      if (response) return response.data;
    } catch (error) {
      toast.error('error');
    }
  };
  return {
    addquart,
    getallquarts,
    editquart,
    deletequart,
    deletequartspec,
    editquartspec,
    getallquartsspec,
    addquartspec,
    compare_dates,
    getQuartdetails,
  };
};

export default useQuartService;
