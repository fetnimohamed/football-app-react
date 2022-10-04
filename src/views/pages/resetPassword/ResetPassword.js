import React, { useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@material-ui/core/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@material-ui/core';

// project imports
import AuthWrapper1 from '../authentication/AuthWrapper1';
import AuthCardWrapper from '../authentication/AuthCardWrapper';
import ResetPassForm from './ResetPassForm';
//import logo from '../../../assets/logo.png'
import AuthFooter from 'ui-component/cards/AuthFooter';
import { AuthContext } from 'context/AuthContext';
import Modal from 'ui-component/modal/modal';

// assets

//= ===============================|| AUTH3 - LOGIN ||================================//

const ResetPasssword = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const { loggedIn, decodedToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) navigate('/login');
  }, [loggedIn]);

  return (
    <Grid item xs={12}>
      <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
        <AuthCardWrapper>
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item sx={{ mb: 3 }}>
              <h2>Changer votre mot de passe</h2>
            </Grid>

            <Grid item xs={12}>
              <ResetPassForm login={3} />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </AuthCardWrapper>
      </Grid>
    </Grid>
  );
};

export default ResetPasssword;
