import { combineReducers } from 'redux';
import { RESET_APP } from 'actions/action-types';
import ModalReducer from 'modal/reducers';
import LocationReducer from 'location/reducers';
import AlertChipReducer from 'alert/reducer';
import AuthBaseReducer from './auth-base-reducer';
import FormReducer from './form-reducer';
import MegaFilterReducer from './mega-filter-reducer';
import notification from './notification-reducer';
import OrganizationReducer from './organization-reducer';
import UserGroupsReducer from './user-groups-reducer';
import TaskDrawerReducer from './task-drawer-reducer';
import TaskListReducer from './task-list-reducer';
import UserReducer from './user-reducer';
import ListDetailsReducer from './list-details-reducer';
import PatientDetailsReducer from './patient-details-reducer';
import TemplateReducer from './template-reducer';
import DashboardReducer from './dashboard-reducer';
import GlobalSearchReducer from './global-search-reducer';
import ActiveUsersReducer from './active-users-reducer';
import PersonDetailsReducer from './person-details-reducer';
import TaskTemplateReducer from './task-template-reducer';
import PatientsReducer from './patients-reducer';
import AnalyticsReducer from './analytics-reducer';
import WorkflowDrawerReducer from './workflow-drawer-reducer';

const appReducer = combineReducers({
  templateState: TemplateReducer,
  userState: UserReducer,
  notification,
  taskList: TaskListReducer,
  userGroups: UserGroupsReducer,
  form: FormReducer,
  organizationState: OrganizationReducer,
  taskDrawerState: TaskDrawerReducer,
  authBase: AuthBaseReducer,
  modal: ModalReducer,
  alertChip: AlertChipReducer,
  megaFilter: MegaFilterReducer,
  location: LocationReducer,
  listDetails: ListDetailsReducer,
  patientDetails: PatientDetailsReducer,
  dashboardTasks: DashboardReducer,
  globalSearch: GlobalSearchReducer,
  activeUsers: ActiveUsersReducer,
  personDetails: PersonDetailsReducer,
  taskTemplate: TaskTemplateReducer,
  patients: PatientsReducer,
  analytics: AnalyticsReducer,
  workflowDrawer: WorkflowDrawerReducer,
});

export default function rootReducer(state, action) {
  if (action.type === RESET_APP) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
}
