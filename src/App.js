// @flow
import React from 'react';
import Routes from './routes/Routes';


// Themes

// For Saas import Saas.scss
import './assets/scss/Saas.scss';


type AppProps = {};

/**
 * Main app component
 */
const App = (props: AppProps): React$Element<any> => {
    return <Routes></Routes>;
};

export default App;
