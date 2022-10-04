import { useState, useCallback, useRef, useEffect, useContext } from 'react';

import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { AuthContext } from '../context/AuthContext';

require('dotenv').config();

const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequest = useRef([]);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const { clearLocalStorage, token } = useContext(AuthContext);

  const baseUrl = window.API_URL === 'DEFAULT_API_URL' ? process.env.REACT_APP_SERVER_URL : window.API_URL;

  const sendRequest = useCallback(async (url, method = 'get', body = null) => {
    const options = { headers: { Authorization: `Bearer ${token}` } };

    setIsLoading(true);
    try {
      const response = await axios[method](
        baseUrl + url,
        method === 'post' || method === 'put' ? body : options,
        options,
      );
      const responseData = await response;
      setIsLoading(false);
      return responseData;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const clearError = () => setError(null);

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);
  return { isLoading, error, sendRequest, clearError, baseUrl };
};

export default useHttpClient;
