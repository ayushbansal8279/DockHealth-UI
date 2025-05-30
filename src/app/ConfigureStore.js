import { all } from 'redux-saga/effects';
import store, { saga } from './store';
import watchTasksGroupsList from './sagas/list-details-saga';
import watchPatientDetails from './sagas/patient-details-saga';
import watchDashboard from './sagas/dashboard-saga';
import watchTemplate from './sagas/template-saga';
import watchGlobalSearch from './sagas/global-search-saga';
import watchTasklist from './sagas/task-list-saga';
import watchTaskTemplate from './sagas/task-template-saga';
import watchTask from './sagas/task-saga';
import watchTaskDrawer from './sagas/task-drawer-saga';
import watchTemplateBundle from './sagas/template-bundle-saga';
import watchOrganization from './sagas/organization-saga';
import watchUserGroups from './sagas/user-groups-saga';
import watchUser from './sagas/user-saga';
import watchUserDetails from './sagas/user-details-saga';
import watchPatients from './sagas/patients-saga';
import watchAnalytics from './sagas/analytics-saga';
import watchWorkflowDrawer from './sagas/workflow-drawer-saga';
import watchWorkflow from './sagas/workflow-saga';
import watchMegaFilters from './sagas/mega-filter-saga';
import watchPersonDetails from './sagas/person-details-saga';
import watchCustomProfileDetails from './sagas/custom-profile-details-saga';
import watchProfileDetail from './sagas/profile-saga';
import watchWorkspaces from './sagas/workspace-saga';

function* rootSaga() {
  yield all([
    watchTasksGroupsList(),
    watchProfileDetail(),
    watchPatientDetails(),
    watchDashboard(),
    watchTemplate(),
    watchGlobalSearch(),
    watchTasklist(),
    watchTaskTemplate(),
    watchTask(),
    watchTemplateBundle(),
    watchOrganization(),
    watchUserGroups(),
    watchUser(),
    watchTaskDrawer(),
    watchUserDetails(),
    watchPatients(),
    watchAnalytics(),
    watchWorkflowDrawer(),
    watchWorkflow(),
    watchMegaFilters(),
    watchPersonDetails(),
    watchCustomProfileDetails(),
    watchWorkspaces(),
  ]);
}

saga.run(rootSaga);

export default function configureStore() {
  return store;
}
