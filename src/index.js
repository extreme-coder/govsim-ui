import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import { alertActions } from './actions/alert'
import * as actions from './actions'
import rootReducer from './reducers'
import App from './App';

import { store } from './store'

const client = axios.create({
  baseURL: 'http://localhost:1337/api',
  responseType: 'json'
});

function errorHandler({ getState, dispatch, error }) {
  // debugger;
  if (error.response.status === 401) {
    // auto logout if 401 response returned from api
    dispatch(actions.logout());
    window.location.reload(true);
  }
  dispatch(alertActions.error(error.response.data.error));
}

const middlewareConfig = {
  onError: errorHandler,
  interceptors: {
    request: [
      function ({ getState, dispatch, getSourceAction }, req) {
        console.log(req); // contains information about request object
        if (localStorage.getItem('user') != null) {
          req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('user')).jwt}`
        }
        return req;
      }
    ],
    response: [
      function ({ getState, dispatch, getSourceAction }, res) {
        console.log(res); // contains information about request object
        return res;
      }
    ]
  }
};


const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
</React.StrictMode>);

