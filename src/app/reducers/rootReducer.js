import { combineReducers } from 'redux'
import * as types from '../actions/action-types';
import TaskReducer from './task-reducer'
import PatientReducer from './patient-reducer'
import UserReducer from './user-reducer'
import { reducer as form } from 'redux-form'
import { reducer as notification } from './notification-reducer'
import TaskListReducer from './tasklist-reducer'
import InvitationReducer from './invitation-reducer'
import peopleReducer from './people-reducer'

const rootReducer = combineReducers({
  taskState: TaskReducer,
  patientState: PatientReducer,
  userState: UserReducer,
  notification,
  form,
  taskListState: TaskListReducer,
  invitationState: InvitationReducer,
  peopleState: peopleReducer

})

export default rootReducer
