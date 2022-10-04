import React from 'react';
import ReactDOM from 'react-dom';

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// project imports
import { store } from './store';
import * as serviceWorker from './serviceWorker';
import App from './App';

import AuthProvider from './context/AuthContext';

import ConfigsProvider from './context/ConfigsContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// style + assets
import './assets/scss/style.scss';
import './assets/scss/custom.scss';
import './index.css';
import "react-datepicker/dist/react-datepicker.css";

// ===========================|| REACT DOM RENDER  ||=========================== //

ReactDOM.render(
  <Provider store={store}>
    <AuthProvider>
      <ConfigsProvider>
        <BrowserRouter>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </ConfigsProvider>
    </AuthProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
