import { combineReducers } from 'redux'
import TaskReducer from './task-reducer'
import PatientReducer from './patient-reducer'
import { reducer as form } from 'redux-form'
import { reducer as user } from './user'
import { reducer as notification } from './notification'
import TaskListReducer from './tasklist-reducer'

const rootReducer = combineReducers({
  taskState: TaskReducer,
  patientState: PatientReducer,
  user,
  notification,
  form,
  taskListState: TaskListReducer,
})

export default rootReducer
