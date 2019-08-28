import { combineReducers } from 'redux';
import TaskReducer from './task-reducer';
import PatientReducer from './patient-reducer';
import UserReducer from './user-reducer';
import notification from './notification-reducer';
import TaskListReducer from './tasklist-reducer';
import InvitationReducer from './invitation-reducer';
import PeopleReducer from './people-reducer';
import FormReducer from './form-reducer';


const rootReducer = combineReducers({
  taskState: TaskReducer,
  patientState: PatientReducer,
  userState: UserReducer,
  notification,
  taskListState: TaskListReducer,
  invitationState: InvitationReducer,
  peopleState: PeopleReducer,
  form: FormReducer,
});

export default rootReducer;
