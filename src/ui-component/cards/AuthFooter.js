import React from 'react';

// material-ui
import { Link, Typography, Stack } from '@material-ui/core';

// ===========================|| FOOTER - AUTHENTICATION 2 & 3 ||=========================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://www.iowaves.com" target="_blank" underline="hover">
      IOWAVES 2021
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://www.iowaves.com" target="_blank" underline="hover">
      &copy; iowaves.com
    </Typography>
  </Stack>
);

export default AuthFooter;
