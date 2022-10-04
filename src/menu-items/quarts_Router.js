// assets
import {
  IconBrandFramer,
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconLayoutGridAdd,
} from '@tabler/icons';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconBrandFramer,
  IconLayoutGridAdd,
};

// ===========================|| UTILITIES MENU ITEMS ||=========================== //

const Historique_Router = {
  id: 'historique',
  title: 'Historique',
  type: 'group',
  children: [
    {
      id: 'history',
      title: 'Traçabilité',
      type: 'item',
      url: '/trg-configuration/history',
      /* icon: icons.IconTypography,*/
      breadcrumbs: true,
    },
    {
      id: 'historyPassation',
      title: 'historique Passation',
      type: 'item',
      url: '/trg-configuration/history-passation',
      /* icon: icons.IconTypography,*/
      breadcrumbs: true,
    },
    {
      id: 'historyETAT',
      title: 'Historique Etat',
      type: 'item',
      url: '/trg-configuration/history-etat',
      /* icon: icons.IconTypography,*/
      breadcrumbs: true,
    },
    {
      id: 'renseingement-pieces',
      title: 'Renseignement des pièces',
      type: 'item',
      url: '/trg-configuration/renseingement-pieces',
      /* icon: icons.IconTypography,*/
      breadcrumbs: true,
    },
    {
      id: 'of-state',
      title: 'Etat of',
      type: 'item',
      url: '/history/ofState',
      /* icon: icons.IconTypography,*/
      breadcrumbs: true,
    },
    // {
    //     id: 'quarts',
    //     title: 'Standard /Spécifique',
    //     type: 'item',
    //     url: '/config/quarter',
    //    /* icon: icons.IconTypography,*/
    //     breadcrumbs: true
    // },
  ],
};

export default Historique_Router;
