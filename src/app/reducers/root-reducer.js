import { combineReducers } from 'redux';
import ModalReducer from 'modal/reducers';
import AlertChipReducer from 'alert/reducer';
import AuthBaseReducer from './auth-base-reducer';
import FormReducer from './form-reducer';
import HeaderReducer from './header-reducer';
import InvitationReducer from './invitation-reducer';
import MegaFilterReducer from './mega-filter-reducer';
import notification from './notification-reducer';
import OnboardingProgressReducer from './onboarding-progress-reducer';
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
import GlobalSearchReducer from './global-search-reducer';

export default combineReducers({
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
  onboardingProgress: OnboardingProgressReducer,
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
  globalSearch: GlobalSearchReducer,
});
