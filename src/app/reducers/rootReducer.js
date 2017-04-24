import { combineReducers } from 'redux'
import TaskReducer from './task-reducer'
import PatientReducer from './patient-reducer'
import UserReducer from './user-reducer'
// import { reducer as user } from './user-reducer'
import { reducer as form } from 'redux-form'
import { reducer as notification } from './notification-reducer'

const rootReducer = combineReducers({
  taskState: TaskReducer,
  patientState: PatientReducer,
  userState: UserReducer
  , notification
  , form
})

export default rootReducer
