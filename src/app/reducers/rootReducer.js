import { combineReducers } from 'redux'
import TaskReducer from './task-reducer'
import PatientReducer from './patient-reducer'
import UserReducer from './user-reducer'
import { reducer as form } from 'redux-form'
import { reducer as notification } from './notification-reducer'
import TaskListReducer from './tasklist-reducer'

const rootReducer = combineReducers({
  taskState: TaskReducer,
  patientState: PatientReducer,
  userState: UserReducer,
  notification,
  form,
  taskListState: TaskListReducer
})

export default rootReducer
