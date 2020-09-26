import { combineReducers } from 'redux';
import { RESET_APP } from 'actions/action-types';
import ModalReducer from 'modal/reducers';
import AlertChipReducer from 'alert/reducer';
import AuthBaseReducer from './auth-base-reducer';
import FormReducer from './form-reducer';
import HeaderReducer from './header-reducer';
import InvitationReducer from './invitation-reducer';
import MegaFilterReducer from './mega-filter-reducer';
import notification from './notification-reducer';
import OrganizationReducer from './organization-reducer';
import patient from './patient';
import PatientReducer from './patient-reducer';
import PeopleReducer from './people-reducer';
import TaskDrawerReducer from './task-drawer-reducer';
import TaskGroupListReducer from './task-group-list-reducer';
import TaskReducer from './task-reducer';
import TaskListReducer from './tasklist-reducer';
import TaskLabelReducer from './task-label-reducer';
import UserReducer from './user-reducer';
import LocationReducer from '../location/reducers';
import ListTasksReducer from './list-tasks-reducer';
import PatientTasksReducer from './patient-tasks-reducer';
import TemplateReducer from './template-reducer';
import DashboardTasksReducer from './dashboard-tasks-reducer';
import DashboardStatisticsReducer from './dashboard-statistics-reducer';
import GlobalSearchReducer from './global-search-reducer';
import AlertsReducer from './alerts-reducer';

const appReducer = combineReducers({
  alertsState: AlertsReducer,
  templateState: TemplateReducer,
  taskState: TaskReducer,
  patientState: PatientReducer,
  userState: UserReducer,
  notification,
  taskListState: TaskListReducer,
  invitationState: InvitationReducer,
  peopleState: PeopleReducer,
  form: FormReducer,
  patient,
  header: HeaderReducer,
  organizationState: OrganizationReducer,
  taskDrawerState: TaskDrawerReducer,
  authBase: AuthBaseReducer,
  taskLabelState: TaskLabelReducer,
  modal: ModalReducer,
  taskGroupList: TaskGroupListReducer,
  alertChip: AlertChipReducer,
  megaFilter: MegaFilterReducer,
  location: LocationReducer,
  listTasks: ListTasksReducer,
  patientTasks: PatientTasksReducer,
  dashboardTasks: DashboardTasksReducer,
  dashboardStatistics: DashboardStatisticsReducer,
  globalSearch: GlobalSearchReducer,
});

export default function rootReducer(state, action) {
  if (action.type === RESET_APP) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
}
