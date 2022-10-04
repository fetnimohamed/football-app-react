import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@material-ui/core';

// project imports
import config from 'config';
import Logo from '../../../assets/logo.png';

// ===========================|| MAIN LOGO ||=========================== //

const LogoSection = () => (
  <ButtonBase disableRipple >
    <img src={Logo} width={150} />
  </ButtonBase>
);

export default LogoSection;
