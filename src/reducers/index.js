import { combineReducers } from 'redux'
import entities from './entities'
import { alert } from './alert'
import { auth } from './auth'

export default combineReducers({
  entities,
  alert,
  auth
})