import React, { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProcessType from 'views/processType/processType';
import MachineCycle from 'views/machineCycle/machineCycle';
import MappingTree from 'views/mapping/mappingTree';
import Machine from 'views/machine/machine';
import schedule from 'views/automaticReport/addSchedueling';

import Quarter from 'views/Configquarter/quarter';
import Articles from 'views/Articles';
import ImportOF from 'views/automaticReport/importOF';
import ListOF from 'views/OF/ListeOF';
import History from 'views/History/historyList';
import HistoryPassation from 'views/History/historique_passation';
import HistoryEtat from 'views/History/historiqueEtat';

import Lignesmachines from 'views/LignesEtMachines/lignesMachines';
import Index from 'views/renseingement-pieces';
import RateIndex from 'views/taux-renseignement';
import ConfigAnalyse from 'views/config-analyse/config-analyse';
import MachineStatusHistoryCorrection from 'views/History/machineStatusHistoryCorrection';
import OfState from 'views/OF-State/OF-state';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// scheduel report screen routing
const Modelschedule = Loadable(lazy(() => import('views/automaticReport/addSchedueling')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const ModelMachine = Loadable(lazy(() => import('views/modelMachine/modelMachine')));

const ConfigNonTrg = Loadable(lazy(() => import('views/configNonTrg/configNonTrg')));

const ConfigurationMapping = Loadable(lazy(() => import('views/mapping/configurationMapping')));
const FicheSuiveuse = Loadable(lazy(() => import('views/fichesuiveuse/ficheSuiveuse')));

const ResetPassFirstLogin = Loadable(lazy(() => import('views/pages/resetPasswordFirstLogin/ResetPassFirstLogin')));

const ConfigUsers = Loadable(lazy(() => import('views/users/configUsers')));

const AnalyseByWeek = Loadable(lazy(() => import('views/Analyse/AnalyseByWeek')));

const OvertureMachines = Loadable(lazy(() => import('views/overtureMachine')));

// ===========================|| MAIN ROUTING ||=========================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Lignesmachines />,
      // element: <Machine />,
    },
    {
      path: '/trg-configuration/process-type',
      element: <ProcessType />,
    },
    {
      path: '/trg-configuration/machine-cycle',
      element: <MachineCycle />,
    },
    {
      path: '/trg-configuration/machine',
      element: <Machine />,
    },
    {
      path: '/trg-configuration/OF',
      element: <ListOF />,
    },
    {
      path: '/config/non/trg',
      element: <ConfigNonTrg />,
    },
    {
      path: '/model/machine',
      element: <ModelMachine />,
    },
    {
      path: '/trg-configuration/rapport',
      element: <Modelschedule />,
    },
    {
      path: '/config/mapping',
      element: <ConfigurationMapping />,
    },
    {
      path: '/config/mapping-tree',
      element: <MappingTree />,
    },
    {
      path: '/reset/password/first/login',
      element: <ResetPassFirstLogin />,
    },
    {
      path: '/articles',
      element: <Articles />,
    },
    {
      path: '/config/quarter',
      element: <Quarter />,
    },
    {
      path: '/overture/machines',
      element: <OvertureMachines />,
    },
    {
      path: '/trg-configuration/history',
      element: <History />,
    },
    {
      path: '/trg-configuration/history-passation',
      element: <HistoryPassation />,
    },
    {
      path: '/trg-configuration/history-etat',
      element: <MachineStatusHistoryCorrection />,
    },
    {
      path: '/trg-configuration/renseingement-pieces',
      element: <Index />,
    },
    {
      path: '/config/users',
      element: <ConfigUsers />,
    },
    // {
    //   path: '/analyse/semaine',
    //   element: <AnalyseByWeek />,
    // },
    {
      path: '/analyse/periodicAnalysis',
      element: <ConfigAnalyse />,
    },
    {
      path: '/lignesmachines',
      element: <Lignesmachines />,
    },
    {
      path: '/fichesuiveuse/:machineId',
      element: <FicheSuiveuse />,
    },
    {
      path: '/history/ofState',
      element: <OfState />,
    },
  ],
};
export default MainRoutes;
