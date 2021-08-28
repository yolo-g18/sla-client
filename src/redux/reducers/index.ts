import { combineReducers } from 'redux'
import auth from './authReducer'
import alert from './alertReducer'
import user from './userReducer'
import search from './searchReducer'
import event from './eventReducer'
import eventHandle from './eventHandleReducer'
import learn from './learnReducer'


export default combineReducers({
  auth,
  alert,
  user,
  search,
  event,
  eventHandle,
  learn
})