// Need to use the React-specific entry point to import createApi
import pluralize from 'pluralize';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { showAlert } from '../redux/actions';

// Define a service using a base URL and expected endpoints
export const govsimApi = createApi({
  reducerPath: 'govsimApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_DOMAIN}/api/`,
    prepareHeaders: (headers, { getState }) => {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        const token = user.jwt
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getEntity: builder.query({
      query: (arg) => {
        const { name, id } = arg;
        return `${pluralize(name.replace('_', '-'))}/${id}`
      }
    }),
    getEntities: builder.query({
      query: (arg) => {
        const { name, populate } = arg;
        let query = `${pluralize(name.replace('_', '-'))}`
        if (populate) query += '?populate=*'
        return query
      }
    }),
    getBlockGroups: builder.query({
      query: (countryId) => {        
        let query = `blocks/groups?country=${countryId}`        
        return query
      }
    }),    
    getEntitiesByFields: builder.query({
      query: (arg) => {
        const { name, fields, values, relations } = arg;
        const filters = []
        for (let i = 0; i < fields.length; i++) {
          let f = fields[i]
          let v = values[i]
          let r = relations[i]
          if (r) {
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
        const { name, field, value, relation, populate } = arg;
        let query
        if (relation) {
          query = `${pluralize(name.replace('_', '-'))}?filters[${field}][${relation}][$eq]=${value}`
        } else {
          query = `${pluralize(name.replace('_', '-'))}?filters[${field}][$eq]=${value}`
        }
        if (populate === true) {
          query += '&populate=*'
        } else if (populate !== undefined) {
          query += '&' + populate
        }
        return query
      },
      providesTags: (result, error, arg) => [{ type: arg.name, id: 'LIST' }],
    }),
    addEntity: builder.mutation({
      query(arg) {
        const { name, body } = arg;
        return {
          url: `${pluralize(name.replace('_', '-'))}`,
          method: 'POST',
          body,
        }
      },
      invalidatesTags: (result, error, arg) => {
        let tags = [{ type: arg.name, id: 'LIST' }]
        if (arg.name === 'vote') {
          tags.push({ type: 'promise', id: 'LIST' })
        }
        if (arg.name === 'promotion') {
          tags.push({ type: 'party', id: 'LIST' })
        }
        return tags
      },
    }),
    updateEntity: builder.mutation({
      query(arg) {
        const { name, body, id } = arg;
        return {
          url: `${pluralize(name.replace('_', '-'))}/${id}`,
          method: 'PUT',
          body,
        }
      },
      invalidatesTags: (result, error, arg) => {
        let tags = [{ type: arg.name, id: 'LIST' }]        
        return tags
      },
    }),
    updateMessagesRead: builder.mutation({
      query(arg) {
        const { body } = arg;
        return {
          url: `/messages/read`,
          method: 'POST',
          body,
        }
      },
      invalidatesTags: (result, error, arg) => {
        let tags = [{ type: 'message', id: 'LIST' }]        
        return tags
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
        if (user) {
          return `parties?filters[country][join_code][$eq]=${code}&filters[user][id][$eq]=${user}&populate[0]=template&populate[1]=template.avatar`
        }
        return `parties?filters[country][join_code][$eq]=${code}&populate=*`
      },
      providesTags: (result, error, arg) => [{ type: 'party', id: 'LIST' }],
    }),
    getMessages: builder.query({
      query: (country) => `messages?filters[country][id]=${country}&populate=*&pagination[pageSize]=1000`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        // create a websocket connection when the cache subscription starts
        //const ws = new WebSocket('ws://localhost:1337')
        const socket = io(process.env.REACT_APP_API_DOMAIN);
        try {
          socket.on('connect', () => {
            console.log("connected to socket")            
            //join the country room
            socket.emit("join", { country:arg }, (error) => {             
              console.log("joined the room:" + arg)
              if (error) return alert(error);
            });
          });

          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded           
          // when data is received from the socket connection to the server,
          // if it is a message and for the appropriate channel,
          // update our query result with the received message
          socket.on('message', (message) => {
            updateCachedData((draft) => {
              draft.data.push(message);
              dispatch({
                type: `govsimApi/invalidateTags`,
                payload: [{ type: 'promise', id: 'LIST' }],
             });              
            });            
          });

          socket.on('new_party', (message) => {            
            toast('A new party has joined the Game : ' + message.name)
            dispatch({
              type: `govsimApi/invalidateTags`,
              payload: [{ type: 'party', id: 'LIST' }],
            });              
          });

          socket.on('ready_for_election', (message) => {            
            toast( message.name + ' is ready for Elections')
            dispatch({
              type: `govsimApi/invalidateTags`,
              payload: [{ type: 'party', id: 'LIST' }],
            });              
          });

          socket.on('new_bill', (message) => {                        
            dispatch({
              type: `govsimApi/invalidateTags`,
              payload: [{ type: 'promise', id: 'LIST' }],
            });              
          });

          socket.on('new_vote', (message) => {         
            toast( 'A new vote was called, Please cast your ballot')               
            dispatch({
              type: `govsimApi/invalidateTags`,
              payload: [{ type: 'vote', id: 'LIST' }],
            });              
          });

          socket.on('election_underway', (message) => {     
            dispatch(showAlert({
              show:true, 
              title:'Elections', 
              message:'Elections are underway',  
              showConfirmButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false
                          
            }));     
            dispatch({
              type: `govsimApi/invalidateTags`,
              payload: [{ type: 'country', id: 'LIST' }],
            });              
          });

          socket.on('election_finished', (message) => {
            dispatch(showAlert({
              show:false,               
            }));   

            setTimeout(() => {
              dispatch(showAlert({
                show:true, 
                title:'Elections',                 
                message:'Elections result are out',                            
              }));   
            }, 100);
            
            
            dispatch({
              type: `govsimApi/invalidateTags`,
              payload: [{ type: 'country', id: 'LIST' }],
            });
          });
          
          
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        socket.off('connect');
        socket.off('message');
      },
      providesTags: (result, error, arg) => [{ type: 'message', id: 'LIST' }],
    })
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetEntityQuery,
  useGetEntitiesQuery,
  useGetBlockGroupsQuery,
  useGetEntitiesByFieldsQuery,
  useGetEntitiesByFieldQuery,
  useLoginMutation,
  useRegisterMutation,
  useAddEntityMutation,
  useUpdateEntityMutation,
  useUpdateMessagesReadMutation,
  useGetPartiesQuery,
  useGetMessagesQuery
} = govsimApi