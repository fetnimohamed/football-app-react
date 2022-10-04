import useHttpClient from 'hooks/useHttpClient';
import { toast } from 'react-toastify';
const useMappingService = () => {
  const { sendRequest } = useHttpClient();

  const getAllMapping = async () => {
    try {
      const response = await sendRequest('config-trg/mapping', 'get');
      console.log(response);
      if (response?.status === 201 || response?.status === 200) {
        return response;
      } else toast.error('erreur avec impotation de données');
    } catch (err) {
      toast.error('erreur : données invalide');
    }
  };

  const postMappingConfig = async (niveau) => {
    try {
      const response = await sendRequest('config-trg/config-mapping', 'post', {
        niveau,
      });
      console.log(response);
      if (response?.status === 201 || response?.status === 200) {
        return response;
      } else toast.error('erreur : données invalide');
    } catch (err) {
      toast.error('erreur : données invalide');
      return false;
    }
  };

  const postMappingTree = async (mapping) => {
    try {
      const response = await sendRequest('config-trg/mapping', 'post', {
        mapping,
      });
      if (response?.status === 201 || response?.status === 200) {
        toast.success('les changements sont sauvegardés avec succès');
        return response;
      } else toast.error('erreur : données invalide');
    } catch (err) {
      toast.error('erreur : données invalide');
    }
  };

  return { getAllMapping, postMappingConfig, postMappingTree };
};

export default useMappingService;
