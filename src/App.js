// @flow
import React from 'react';
import Routes from './routes/Routes';


// Themes

// For Saas import Saas.scss
import './assets/scss/Saas.scss';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

type AppProps = {};

/**
 * Main app component
 */
const App = (props: AppProps): React$Element<any> => {
  return (
    <>
      <Routes></Routes>;
      <ToastContainer />
    </>
  )

};

export default App;
