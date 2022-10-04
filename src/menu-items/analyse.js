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

const AnalyseRouter = {
  id: 'analyse',
  title: 'Analyse',
  type: 'group',
  children: [
    {
      id: 'ANALALYSE-MACHINES',
      title: 'analyse machines',
      type: 'item',
      url: '/analyse/semaine',
      breadcrumbs: true,
    },
  ],
};

export default AnalyseRouter;
