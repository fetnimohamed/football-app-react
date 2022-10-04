import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import { useContext } from 'react';
import { AuthContext } from 'context/AuthContext';

// ===========================|| ROUTING RENDER ||=========================== //

export default function ThemeRoutes() {
  const { loggedIn } = useContext(AuthContext);
  return useRoutes([MainRoutes, AuthenticationRoutes]);
}
