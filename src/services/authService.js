import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import useHttpClient from '../hooks/useHttpClient';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

const useAuthService = () => {
  const { sendRequest } = useHttpClient();
  const { signIn, clearLocalStorage, user, setUser, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const response = await sendRequest('session', 'get');
      if (response) {
        setUser(response.data);
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const login = async (data) => {
    try {
      const response = await sendRequest('loginresponsable', 'post', data);

      if (response.data.accessToken) {
        await signIn(response.data.accessToken);
        toast.success('Bienvenue');
        localStorage.setItem('firstTime', true);
        navigate('/');
      }
      if (response.data.code === 1) {
        toast.error('Cet utilisateur est désactivé');
      }
    } catch (err) {
      toast.error('Id de connexion ou mot de passe incorrect');
    }
  };

  const changePassword = async (password, newPassword) => {
    try {
      const response = await sendRequest('resetadminpassword', 'post', {
        matricule: token ? jwt_decode(token).matricule : null,
        newPassword,
        password,
      });

      if (response) {
        clearLocalStorage();
      }
      return false;
    } catch (err) {
      toast.error('mot de passe actuel incorrect');
      return false;
    }
  };

  const changePasswordFirstlogin = async (newPassword, password) => {
    try {
      const response = await sendRequest('resetadminpassword/first-login', 'post', {
        matricule: user?.data?.matricule,
        newPassword,
        password,
      });

      if (response) {
        clearLocalStorage();
      }
      return false;
    } catch (err) {
      toast.error('mot de passe actuel incorrect');
      return false;
    }
  };

  const logout = () => {
    clearLocalStorage();
  };

  return { login, logout, changePassword, changePasswordFirstlogin, getUserData };
};

export default useAuthService;
