import useHttpClient from '../hooks/useHttpClient';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const useUserService = () => {
  const { sendRequest } = useHttpClient();
  const { setUsers, users } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  const createUser = async (userData, closeModal) => {
    console.log('in create');
    try {
      const response = await sendRequest('users', 'post', {
        ...userData,
        password: userData.matricule,
      });
      console.log(response);
      if (response.data.status === 400) {
        return toast.error(response.data.error);
      } else {
        toast.success('Ajouté avec succeés');
        closeModal();
        getAllUsers(1);
      }
      return 'ok';
    } catch (error) {
      toast.error('erreur ');
    }
  };

  const editUser = async (userData, pmL, closeModal) => {
    console.log('in edit');
    try {
      const response = await sendRequest(`users/${userData.id}`, 'put', userData);
      console.log(response, response.data.status);
      if (response.data.status == 201) {
        toast.warning('Cet matricule existe déja ! ');
      } else if (response.data.status == 200) {
        closeModal();
        toast.success('Modification effectué avec succès !');
      } else {
        closeModal();
        toast.error('Erreur lors de la modifiation de cet utilisateur');
      }
      return 'ok';
    } catch (error) {
      toast.error(t('TOAST.EDIT_USER_ERROR'));
    }
  };

  const deleteUser = async (userId, callBack, pmL) => {
    try {
      const response = await sendRequest(`users/${userId}`, 'delete');
      if (response.status === 201) {
        callBack();
        toast.success('Opération effectué avec succés');
        getAllUsers(pmL);
      }
      return 'ok';
    } catch (error) {
      toast.success(t('TOAST.EDIT_USER_ERROR'));
    }
  };

  const getAllUsers = async (pmL, setRows) => {
    try {
      const response = await sendRequest('users', 'get');
      setUsers(
        response.data.docs
          .filter((user) => {
            if (user.permissionLevel === pmL) {
              user.Etat = user.status == 1 ? 'actif' : 'désactivé';
              return user;
            }
          })
          .map((user) => ({ ...user, id: user._id })),
      );

      setRows(
        response.data.docs
          .filter((user) => {
            if (user.permissionLevel === pmL) {
              user.Etat = user.status == 1 ? 'actif' : 'désactivé';
              return user;
            }
          })
          .map((user) => ({ ...user, id: user._id })),
      );
    } catch (error) {
      toast.error('error');
    }
  };

  return { createUser, editUser, deleteUser, getAllUsers };
};

export default useUserService;
