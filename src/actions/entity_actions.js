import pluralize from 'pluralize';
import { createAction } from 'redux-actions';

export const getEntities = createAction('LOAD_ENTITIES', (name) => ({
  request: {
    url: `/${pluralize(name.replace('_', '-'))}`,
    modelName: name
  }
}));

export const getEntity = createAction('LOAD_ENTITY', (name, id) => ({
  request: {
    url: `/${pluralize(name.replace('_', '-'))}/${id}`,
    modelName: name
  }
}));

export const getEntityImages = createAction('LOAD_ENTITY_IMG', (name, id) => ({
  request: {
    url: `/${pluralize(name.replace('_', '-'))}/${id}?populate=images`,
    modelName: name + '_imgs'
  }
}));

export const addEntity = createAction('ADD_ENTITY', (name, data, next) => ({
  request: {
    url: `/${pluralize(name.replace('_', '-'))}`,
    method: 'POST',
    data,
    modelName: name
  },
  options: {
    onSuccess1({ getState, dispatch, response }) {
      if (next) {
        window.location = next;
      } 
    }
  }
}));

export const updateEntity = createAction('UPDATE_ENTITY', (name, data, next) => ({
  request: {
    url: `/${pluralize(name.replace('_', '-'))}/${data.id}`,
    method: 'PUT',
    data,
    modelName: name
  },
  options: {
    onSuccess({ getState, dispatch, response }) {
      if (next) {
        window.location = next;
      }
    }
  }
}));
