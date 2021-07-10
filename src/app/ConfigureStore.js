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
import watchTemplateBundle from './sagas/template-bundle-saga';
import watchOrganization from './sagas/organization-saga';

function* rootSaga() {
  yield all([
    watchTasksGroupsList(),
    watchPatientDetails(),
    watchDashboard(),
    watchTemplate(),
    watchGlobalSearch(),
    watchTasklist(),
    watchTaskTemplate(),
    watchTask(),
    watchTemplateBundle(),
    watchOrganization(),
  ]);
}

saga.run(rootSaga);

export default function configureStore() {
  return store;
}
