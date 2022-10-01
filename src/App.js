import React from 'react';
import './App.css';
import {
  BrowserRouter as Router
} from 'react-router-dom';
import AppRoutes from './Routes.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
