import useHttpClient from 'hooks/useHttpClient';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const axios = require('axios');

const useAnalyseService = () => {
  const { sendRequest } = useHttpClient();

  const { clearLocalStorage, token } = useContext(AuthContext);
  const { baseUrl } = useHttpClient();

  const getTRGWeek = async (startDay, siteId) => {
    try {
      const response = await axios.get(baseUrl + 'analyse/week', {
        params: {
          startDay,
          siteId,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      toast.error('erreur : données invalide');
    }
  };

  const generateAnalyse = async (data) => {
    const response = await sendRequest('analyseTrg', 'post', data);
    if (response) {
      console.log(response.data);

      return response.data;
    }
  };

  const getAllCauses = async () => {
    const response = await sendRequest('configs/causes', 'get');
    if (response) {
      return response.data.response;
    }
  };

  const getAllCategories = async () => {
    const response = await sendRequest('configs/categories', 'get');
    if (response) {
      return response.data.response;
    }
  };

  const getNonTrgAnalysisFirstLevel = async (data) => {
    const response = await sendRequest('analyseTrgByLosses', 'post', data);
    if (response) {
      return response.data;
    }
  };

  const getNonTrgAnalysisSecondLevelByLoss = async (data) => {
    const response = await sendRequest('getcategoryfromperte', 'post', data)
    if (response) {
      return response.data
    }
  }

  const getNonTrgAnalysisSecondLevelByCategory = async (data) => {
    const response = await sendRequest('getcausesfromcategorie', 'post', data)
    if (response) {
      return response.data
    }
  }
  return { getTRGWeek, generateAnalyse, getAllCauses, getAllCategories, getNonTrgAnalysisFirstLevel, getNonTrgAnalysisSecondLevelByCategory, getNonTrgAnalysisSecondLevelByLoss };
};

export default useAnalyseService;
