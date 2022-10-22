import React from 'react';

import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import {
  BrowserRouter as Router
} from 'react-router-dom';
import AppRoutes from './Routes.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
function App() {
  return (
    <Router>
      <div>
        <ToastContainer />
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
