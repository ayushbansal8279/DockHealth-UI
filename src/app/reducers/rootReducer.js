import { combineReducers } from 'redux'
import TaskReducer from './task-reducer'
import PatientReducer from './patient-reducer'
import { reducer as form } from 'redux-form'
import { reducer as user } from './user'
import { reducer as notification } from './notification'

const rootReducer = combineReducers({
  taskState: TaskReducer,
  patientState: PatientReducer
  , user
  , notification
  , form
})

export default rootReducer
