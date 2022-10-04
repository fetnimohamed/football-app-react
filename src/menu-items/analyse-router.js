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

const AnalyseRoutes = {
  id: 'analyse',
  title: 'Analyse',
  type: 'group',
  children: [
    // {
    //     id: "taux-renseignement",
    //     title: "Taux de renseignement",
    //     type: "item",
    //     url: "/analyse/taux-renseignement",
    //     /* icon: icons.IconTypography,*/
    //     breadcrumbs: true,
    // },
    {
      id: 'ANALALYSE-TRG-MACHINES',
      title: 'Analyse périodique des TRG et nonTRG',
      type: 'item',
      url: '/analyse/periodicAnalysis',
      breadcrumbs: true,
    },

    // {
    //   id: 'ANALALYSE-MACHINES',
    //   title: 'TRG machines',
    //   type: 'item',
    //   url: '/analyse/semaine',
    //   breadcrumbs: true,
    // },
  ],
};

export default AnalyseRoutes;
