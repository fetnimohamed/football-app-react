import { useContext } from 'react';
import { useHistory } from 'react-router';
import { AuthContext } from 'src/context/AuthContext';
import useHttpClient from 'src/hooks/useHttpClient';

const useProfilService = () => {
  const { sendRequest } = useHttpClient();
  const history = useHistory();

  const addProfil = async (profil) => {
    const response = await sendRequest('users/profiles', 'post', { ...profil });
    if (response) {
      return response;
    }
  };

  const getallprofil = async () => {
    console.log('loaading');
    const response = await sendRequest('users/profiles', 'get');
    if (response) {
      return response;
    }
  };
  const editprofil = async (data) => {
    const response = await sendRequest('users/profiles', 'put', data);
    if (response.staus == 200) {
      return response;
    }
  };
  const deleteprofil = async (id) => {
    const response = await sendRequest('users/profiles/' + id, 'delete');

    return response;
  };

  return { addProfil, getallprofil, editprofil, deleteprofil };
};

export default useProfilService;
