import useHttpClient from '../hooks/useHttpClient';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { ConfigsContext } from 'context/ConfigsContext';

const useArticlesService = () => {
  const { sendRequest } = useHttpClient();
  const { setArticles } = useContext(ConfigsContext);

  const getAllArticles = async (setRows) => {
    try {
      const response = await sendRequest('articles', 'get');
      if (response.data.articles) {
        setArticles(response.data.articles);
        setRows(response.data.articles)
      }
    } catch (error) {
      toast.error('error');
      return 'error';
    }
  };

  return {
    getAllArticles,
  };
};

export default useArticlesService;
