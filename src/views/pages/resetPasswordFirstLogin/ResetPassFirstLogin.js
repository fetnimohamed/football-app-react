import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { Divider, Grid, useMediaQuery } from '@material-ui/core';
import AuthCardWrapper from '../authentication/AuthCardWrapper';
import ResetPassForm from './ResetPassForm';
import { AuthContext } from 'context/AuthContext';

const ResetPassFirstLogin = () => {
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

export default ResetPassFirstLogin;
