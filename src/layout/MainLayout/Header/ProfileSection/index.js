import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { makeStyles, useTheme } from '@material-ui/styles';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  InputAdornment,
  List,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Paper,
  Popper,
  Switch,
  Typography,
} from '@material-ui/core';
import ListItemButton from '@material-ui/core/ListItemButton';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import UpgradePlanCard from './UpgradePlanCard';

// assets
import { IconLogout, IconEdit, IconSettings } from '@tabler/icons';
import User1 from 'assets/images/users/user-round.svg';
import useAuthService from 'services/authService';
import Modal from 'ui-component/modal/modal';
import ResetPasssword from 'views/pages/resetPassword/ResetPassword';
import { AuthContext } from 'context/AuthContext';
import MachineTree from 'views/machine/machineTree';
import { toast } from 'react-toastify';
import useMachineService from 'services/machineService';
import useMappingService from 'services/mappingService';
import getpath from 'views/machine/getpath';

// style const
const useStyles = makeStyles((theme) => ({
  navContainer: {
    width: '100%',
    maxWidth: '350px',
    minWidth: '300px',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '10px',
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
    },
  },
  headerAvatar: {
    cursor: 'pointer',
    ...theme.typography.mediumAvatar,
    margin: '8px 0 8px 8px !important',
  },
  profileChip: {
    height: '48px',
    alignItems: 'center',
    borderRadius: '27px',
    transition: 'all .2s ease-in-out',
    borderColor: theme.palette.primary.light,
    backgroundColor: theme.palette.primary.light,
    '&[aria-controls="menu-list-grow"], &:hover': {
      borderColor: theme.palette.primary.main,
      background: `${theme.palette.primary.main}!important`,
      color: theme.palette.primary.light,
      '& svg': {
        stroke: theme.palette.primary.light,
      },
    },
  },
  profileLabel: {
    lineHeight: 0,
    padding: '12px',
  },
  listItem: {
    marginTop: '5px',
  },
  cardContent: {
    padding: '16px !important',
  },
  card: {
    backgroundColor: theme.palette.primary.light,
    marginBottom: '16px',
    marginTop: '16px',
  },
  searchControl: {
    width: '100%',
    paddingRight: '8px',
    paddingLeft: '16px',
    marginBottom: '16px',
    marginTop: '16px',
  },
  startAdornment: {
    fontSize: '1rem',
    color: theme.palette.grey[500],
  },
  flex: {
    display: 'flex',
  },
  name: {
    marginLeft: '2px',
    fontWeight: 400,
  },
  ScrollHeight: {
    height: '100%',
    maxHeight: 'calc(100vh - 250px)',
    overflowX: 'hidden',
  },
  badgeWarning: {
    backgroundColor: theme.palette.warning.dark,
    color: '#fff',
  },
}));

// ===========================|| PROFILE MENU ||=========================== //

const ProfileSection = () => {
  const classes = useStyles();
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const [openEditPassModal, setEditPassModal] = useState(false);
  const { user, displayModal, setDisplayModal } = useContext(AuthContext);

  const { logout, getUserData } = useAuthService();
  const { editMachineReap } = useMachineService();
  const { getAllMapping } = useMappingService();

  const [local, setLocal] = useState(0);

  const [selectedIndex] = React.useState(1);
  const [localPath, setLocalPath] = useState();
  const [mapping, setMapping] = React.useState([]);

  const [open, setOpen] = React.useState(false);
  const [userData, setUserData] = useState();
  const [openTreeModal, setOpenTreeModal] = useState(false);
  const anchorRef = React.useRef(null);
  const handleLogout = async () => {
    console.error('Logout');
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);
  React.useEffect(() => {
    setTimeout(() => {
      const firstTime = JSON.parse(localStorage.getItem('firstTime'));
      console.log({ firstTime });
      if (firstTime) {
        setOpenTreeModal(true);
      }
    }, 500);
  }, [displayModal]);
  const close = () => {
    setOpenTreeModal(false);
    localStorage.setItem('firstTime', false);
  };
  React.useEffect(async () => {
    getUserData();
    const mapping = await getAllMapping();
    setMapping(mapping.data.mapping);
  }, []);

  return (
    <>
      <Button sx={{ m: 1 }} variant="outlined" onClick={() => setOpenTreeModal(true)}>
        Choisir une ligne
      </Button>
      <Chip
        classes={{ label: classes.profileLabel }}
        className={classes.profileChip}
        icon={
          <Avatar
            className={classes.headerAvatar}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={user?.firstName + ' ' + user?.lastName}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />

      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <CardContent className={classes.cardContent}>
                    <List component="nav" className={classes.navContainer}>
                      <ListItemButton
                        className={classes.listItem}
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        selected={selectedIndex === 4}
                        onClick={() => setEditPassModal(true)}
                      >
                        <ListItemIcon>
                          <IconEdit stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="body2">Changer mot de passe</Typography>} />
                      </ListItemButton>

                      <ListItemButton
                        className={classes.listItem}
                        sx={{ borderRadius: `${customization.borderRadius}px` }}
                        selected={selectedIndex === 4}
                        onClick={logout}
                      >
                        <ListItemIcon>
                          <IconLogout stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="body2">Déconnexion</Typography>} />
                      </ListItemButton>
                    </List>
                  </CardContent>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
      <Modal open={openEditPassModal} close={() => setEditPassModal(false)}>
        <ResetPasssword />
      </Modal>

      <Modal open={openTreeModal} close={close}>
        <MachineTree
          setLocal={async (e) => {
            setLocal(e);
            const response = await editMachineReap({
              reap: user,
              localId: e,
            });
            if (response.data.status == 201) {
              toast.success('Vous êtes responsable de la ligne ' + getpath(mapping, local));
            } else {
              toast.error('Une erreur est survenue. Veuillez essayer de nouveau !');
            }
          }}
          setOpen={close}
          setLocalPath={(e) => {
            setLocalPath(e);
          }}
        />
      </Modal>
    </>
  );
};

export default ProfileSection;
