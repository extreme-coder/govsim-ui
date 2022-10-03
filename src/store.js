import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { govsimApi } from './services/govsim'
import { rtkQueryErrorLogger } from './middlewares/error'

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [govsimApi.reducerPath]: govsimApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([govsimApi.middleware, rtkQueryErrorLogger]),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)