// Need to use the React-specific entry point to import createApi
import pluralize from 'pluralize';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const govsimApi = createApi({
  reducerPath: 'govsimApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:1337/api/' }),
  endpoints: (builder) => ({
    getEntity: builder.query({
      query: (arg) => {
        const {name, id} = arg;
        return `${pluralize(name.replace('_', '-'))}/${id}`
      }
    }),
    getEntities: builder.query({
      query: (name) => `${pluralize(name.replace('_', '-'))}`,
    }),
    login: builder.mutation({
      query(body) {
          return {
            url: `/auth/local`,
            method: 'POST',
            body,
          }
      },        
    }),
    register: builder.mutation({
      query(body) {
          return {
            url: `/auth/local/register`,
            method: 'POST',
            body,
          }
      },        
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetEntityQuery, 
  useGetEntitiesQuery, 
  useLoginMutation,
  useRegisterMutation } = govsimApi