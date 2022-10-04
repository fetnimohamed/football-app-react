import dashboard from './dashboard';
import utilities from './utilities';
import Historique_Router from './quarts_Router';
import ConfigUser from './pages';
import AnalyseRoutes from './analyse-router';

// ===========================|| MENU ITEMS ||=========================== //

const menuItems = {
  items: [dashboard, ConfigUser, utilities, Historique_Router, AnalyseRoutes],
};

export default menuItems;
