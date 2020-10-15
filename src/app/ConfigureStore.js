import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import thunk from 'redux-thunk';
import reducers from './reducers/root-reducer';
import watchTasksGroupsList from './sagas/list-details-saga';
import watchPatientTasks from './sagas/patient-tasks-saga';
import watchPatient from './sagas/patient-saga';
import watchDashboard from './sagas/dashboard-saga';
import watchTemplate from './sagas/template-saga';
import watchGlobalSearch from './sagas/global-search-saga';
import watchTasklist from './sagas/tasklist-saga';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers =
  (process.env.NODE_ENV !== 'production' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const saga = createSagaMiddleware();

const middlewares = [saga, thunk];

function setupStore() {
  return createStore(
    reducers,
    composeEnhancers(applyMiddleware(...middlewares)),
  );
}

const store = setupStore();

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
