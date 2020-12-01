import { all } from 'redux-saga/effects';
import store, { saga } from './store';
import watchTasksGroupsList from './sagas/list-details-saga';
import watchPatientTasks from './sagas/patient-tasks-saga';
import watchPatient from './sagas/patient-saga';
import watchDashboard from './sagas/dashboard-saga';
import watchTemplate from './sagas/template-saga';
import watchGlobalSearch from './sagas/global-search-saga';
import watchTasklist from './sagas/tasklist-saga';

function* rootSaga() {
  yield all([
    watchTasksGroupsList(),
    watchPatientTasks(),
    watchPatient(),
    watchDashboard(),
    watchTemplate(),
    watchGlobalSearch(),
    watchTasklist(),
  ]);
}

saga.run(rootSaga);

export default function configureStore() {
  return store;
}
