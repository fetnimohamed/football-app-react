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

const utilities = {
  id: 'trg-configuration',
  title: 'Configuration TRG',
  type: 'group',
  children: [
    {
      id: 'A Non TRG',
      title: 'Config Non TRG',
      type: 'item',
      url: '/config/non/trg',
    },
    {
      id: 'processType',
      title: 'Type de process',
      type: 'item',
      url: '/trg-configuration/process-type',
      breadcrumbs: true,
    },
    {
      id: 'Matrix',
      title: 'Modèles Des machines',
      type: 'item',
      url: '/model/machine',
    },

    {
      id: 'machineCycle',
      title: 'Cycle de machine',
      type: 'item',
      url: '/trg-configuration/machine-cycle',
      breadcrumbs: true,
    },
    {
      id: 'config-mapping',
      title: 'Configuration Mapping',
      type: 'item',
      url: '/config/mapping',
      breadcrumbs: true,
    },

    {
      id: 'mapping-tree',
      title: 'Arborescence Mapping',
      type: 'item',
      url: '/config/mapping-tree',
      breadcrumbs: true,
    },
    {
      id: 'machine',
      title: 'Machine',
      type: 'item',
      url: '/trg-configuration/machine',
      breadcrumbs: true,
    },
    {
      id: 'schedule',
      title: 'Import Of',
      type: 'item',
      url: '/trg-configuration/rapport',
      breadcrumbs: true,
    },
    {
      id: 'articles',
      title: 'Articles',
      type: 'item',
      url: '/articles',
      breadcrumbs: true,
    },
    {
      id: 'of',
      title: 'Liste des OF',
      type: 'item',
      url: '/trg-configuration/OF',
      breadcrumbs: true,
    },
    {
      id: 'quarts',
      title: 'Standard /Spécifique',
      type: 'item',
      url: '/config/quarter',
      breadcrumbs: true,
    },
    {
      id: 'overturemachines',
      title: 'Overture Machines',
      type: 'item',
      url: '/overture/machines',
      breadcrumbs: true,
    },
  ],
};

export default utilities;
