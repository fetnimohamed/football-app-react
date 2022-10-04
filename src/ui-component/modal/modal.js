import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const ModalTile = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0 }} {...other}>
      <h3>{children} </h3>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 9,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};

ModalTile.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function Modal({ open, close, title, children }) {
  return (
    <div>
      <BootstrapDialog onClose={close} aria-labelledby="customized-dialog-title" open={open} fullWidth={true}>
        <ModalTile id="customized-dialog-title" onClose={close}>
          {title}
        </ModalTile>
        <DialogContent>
          <div style={{ width: '100%' }}>{children}</div>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
