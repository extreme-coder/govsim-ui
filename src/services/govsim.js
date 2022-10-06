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
        const { name, fields, values, relations } = arg;
        const filters = []
        for (let i = 0; i < fields.length; i++){
          let f = fields[i]
          let v = values[i]
          let r = relations[i]
          if(r) {
            filters.push(`filters[${f}][$eq]=${v}&`)
          } else {
            filters.push(`filters[${f}][${r}][$eq]=${v}&`)
          }         
        }
        return `${pluralize(name.replace('_', '-'))}?${filters.join('')}`
      }
    }),
    getEntitiesByField: builder.query({
      query: (arg) => { 
        const {name, field, value, relation, populate} = arg;
        let query 
        if (relation) {
          query = `${pluralize(name.replace('_', '-'))}?filters[${field}][${relation}][$eq]=${value}`
        } else {
          query = `${pluralize(name.replace('_', '-'))}?filters[${field}][$eq]=${value}`
        }
        if(populate) {
          query += '&populate=*'
        }
        return query
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
        const { code, user } = arg;
        return `parties?filters[country][join_code][$eq]=${code}&filters[user][id][$eq]=${user}`
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