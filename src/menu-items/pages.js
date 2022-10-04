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

const ConfigUser = {
  id: 'configusers',
  title: 'Gestion des utilisateurs',
  type: 'group',
  children: [
    {
      id: 'Compagnion',
      title: 'Compagnon',
      type: 'item',
      url: '/config/users',
      /* icon: icons.IconTypography,*/
      breadcrumbs: true,
    },
  ],
};

export default ConfigUser;
