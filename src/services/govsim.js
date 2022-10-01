// Need to use the React-specific entry point to import createApi
import pluralize from 'pluralize';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const govsimApi = createApi({
  reducerPath: 'govsimApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:1337/' }),
  endpoints: (builder) => ({
    getEntity: builder.query({
      query: (name, id) => `${pluralize(name.replace('_', '-'))}/${id}`,
    }),
    getEntities: builder.query({
        query: (name, id) => `${pluralize(name.replace('_', '-'))}`,
      }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetEntityQuery, useGetEntitiesQuery } = govsimApi