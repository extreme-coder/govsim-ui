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
    getEntitiesByFields: builder.query({
      query: (arg) => { 
        const { name, fields, values } = arg;
        const filters = []
        for (let i = 0; i < fields.length; i++){
          let f = fields[i]
          let v = values[i]
          filters.push(`filters[${f}][$eq]=${v}&`)
         
        }
        return `${pluralize(name.replace('_', '-'))}?${filters.join('')}`
      }
    }),
    getEntitiesByField: builder.query({
      query: (arg) => { 
        const {name, field, value} = arg;
        return `${pluralize(name.replace('_', '-'))}?filters[${field}][$eq]=${value}`
      }
    }),
    addEntity: builder.mutation({
      query(arg) {
        const {name, body} = arg;
        return {
          url: `${pluralize(name.replace('_', '-'))}`,
          method: 'POST',
          body,
        }
      },        
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
    getParties: builder.query({
      query: (arg) => { 
        const { country, user } = arg;
        return `parties?filters[country][id][$eq]=${country}&filters[user][id][$eq]=${user}`
      }
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetEntityQuery, 
  useGetEntitiesQuery,
  useGetEntitiesByFieldsQuery,
  useGetEntitiesByFieldQuery,
  useLoginMutation,
  useRegisterMutation,
  useAddEntityMutation,
  useGetPartiesQuery,
} = govsimApi