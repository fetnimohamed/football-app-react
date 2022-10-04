import React, { Suspense, useContext, useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@material-ui/core/styles';
import { CircularProgress, CssBaseline, StyledEngineProvider } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

// routing
import Routes from './routes';

// defaultTheme
import themes from './themes';

// project imports
import NavigationScroll from './layout/NavigationScroll';
import './i18next';
import { AuthContext } from 'context/AuthContext';
import Modal from 'ui-component/modal/modal';
import ResetPassFirstLogin from 'views/pages/resetPasswordFirstLogin/ResetPassFirstLogin';
import useAuthService from 'services/authService';

// ===========================|| APP ||=========================== //

const App = () => {
  const customization = useSelector((state) => state.customization);
  const { decodedToken, token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <Suspense fallback={<CircularProgress />}>
          <CssBaseline />
          <NavigationScroll>
            <Routes />
          </NavigationScroll>
          <Modal open={token ? (jwt_decode(token).updatedPassword ? false : true) : false}>
            <ResetPassFirstLogin />
          </Modal>
        </Suspense>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
