import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { govsimApi } from './services/govsim'
import { rtkQueryErrorLogger } from './middlewares/error'
import reducers from './redux/reducers';
import rootSaga from './redux/sagas';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const localStorageMiddleware = ({getState}) => { // <--- FOCUS HERE
  return (next) => (action) => {
      const result = next(action);
      localStorage.setItem('applicationState', JSON.stringify(
          getState().theme
      ));
      return result;
  };
};


const reHydrateStore = () => { // <-- FOCUS HERE

  if (localStorage.getItem('applicationState') !== null) {
      return {theme: JSON.parse(localStorage.getItem('applicationState'))} // re-hydrate the store
  }
}

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [govsimApi.reducerPath]: govsimApi.reducer,
    theme: reducers
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([govsimApi.middleware, rtkQueryErrorLogger, sagaMiddleware, localStorageMiddleware]),

  preloadedState: reHydrateStore()  
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

sagaMiddleware.run(rootSaga);



