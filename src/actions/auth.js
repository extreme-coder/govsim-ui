import { createAction } from 'redux-actions';

export const logout = () => ({ type: 'LOGOUT' })

export const login = createAction('LOGIN', (loginData) => ({
  request: {
    url: '/auth/local',
    method: 'POST',
    data: loginData
  },
  options: {
    onSuccess({ getState, dispatch, response }) {
      localStorage.setItem('user', JSON.stringify(response.data));
      window.location = '/dashboard';
    }
  }
}));

export const addUser = createAction('ADD_USER', (loginData) => ({
  request: {
    url: '/auth/local/register',
    method: 'POST',
    data: loginData
  },
  options: {
    onSuccess({ getState, dispatch, response }) {
      localStorage.setItem('user', JSON.stringify(response.data));
      window.location = '/dashboard';
    }
  }
}));
