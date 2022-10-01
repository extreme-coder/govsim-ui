import pluralize from 'pluralize';

const initialState = {
    customers: [],
    customer: {},
    events: [],
    event: {},
    order: {},
    orders: [],
    tickets: [],
    ticket: {}
}
const entities = (state = initialState, action) => {
  let name = ''
  switch (action.type) {
    case 'LOAD_ENTITIES_SUCCESS':
      name = pluralize(action.meta.previousAction.payload.request.modelName);
      return { ...state, [name]: action.payload.data }
    case 'LOAD_ENTITY_SUCCESS':
      name = action.meta.previousAction.payload.request.modelName;
      return { ...state, [name]: { ...action.payload.data.data.attributes, id: action.payload.data.data.id } }
    case 'LOAD_ENTITY_IMG_SUCCESS':
      name = action.meta.previousAction.payload.request.modelName;
      return { ...state, [name]: action.payload.data.data.attributes.images.data.map((d) => ('http://localhost:1337' + d.attributes.url)) }
    case 'ADD_ENTITY_SUCCESS':
      name = action.meta.previousAction.payload.request.modelName;
      return {...state, [name]: { ...action.payload.data.data.attributes, id: action.payload.data.data.id }}
    default:
      return state;
  }
};

export default entities;