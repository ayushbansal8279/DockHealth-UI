import { all, call, takeLatest, put, select } from 'redux-saga/effects';
import * as UserApi from 'api/user-api';
import * as ActionTypes from 'actions/action-types';
import * as PersonDetailsActions from 'actions/person-details-actions';
import {
  clearFiltersForMegaFilter,
  selectFiltersForMegaFilter,
} from 'actions/mega-filter-actions';
import {
  getFiltersStorageKey,
  getQuickFilterStorageKey,
} from 'helpers/mega-filter-helper';
import { showGlobalErrorAlert } from 'alert/actions';
import {
  userIdentifierSelector,
  sortSelector,
  currentTasksStatusSelector,
} from 'selectors/person-details-selectors';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import { TaskStatus } from 'helpers/task-helpers';
import isEmpty from 'ramda/src/isEmpty';
import localStorageHelper from '../helpers/local-storage-helper';

function* initializeUserTasks(status) {
  yield put(PersonDetailsActions.getUserTaskCounters());

  const userIdentifier = yield select(userIdentifierSelector);

  const filters = localStorageHelper.getItem(
    getFiltersStorageKey(userIdentifier, status),
  );
  const selectedQuickFilter = localStorageHelper.getItem(
    getQuickFilterStorageKey(userIdentifier, status),
  );

  if (filters && !isEmpty(filters))
    yield put(
      selectFiltersForMegaFilter(
        filters,
        userIdentifier,
        status,
        selectedQuickFilter,
      ),
    );
  else {
    yield put(clearFiltersForMegaFilter());
    yield status === TaskStatus.COMPLETE
      ? put(PersonDetailsActions.getUserCompletedTasks())
      : put(PersonDetailsActions.getUserTasks());
  }
}

function* initializeUserDetailsState({ currentTasksStatus }) {
  yield all([
    put(PersonDetailsActions.getUserDetails()),
    call(initializeUserTasks, currentTasksStatus),
  ]);
}

function* changeCurrentTasksStatus({ status }) {
  yield call(initializeUserTasks, status);
}

function* getUserDetails() {
  try {
    const userIdentifier = yield select(userIdentifierSelector);
    const user = yield UserApi.getUserById(userIdentifier);

    yield put({
      type: ActionTypes.GET_USER_DETAILS_SUCCESS,
      userIdentifier,
      user,
    });
  } catch {
    yield put({
      type: ActionTypes.GET_USER_DETAILS_FAILURE,
    });
  }
}

function* getUserTaskCounters() {
  try {
    const userIdentifier = yield select(userIdentifierSelector);
    const stats = yield UserApi.getUserTaskStats(userIdentifier);

    const taskCounters = {
      incomplete: stats
        ? stats.find(
            ({ metricName }) => metricName === 'INCOMPLETE_TASKS_COUNT',
          )?.metricValue
        : 0,
      complete: stats
        ? stats.find(({ metricName }) => metricName === 'COMPLETE_TASKS_COUNT')
            ?.metricValue
        : 0,
    };
    yield put({
      type: ActionTypes.GET_USER_TASK_COUNTERS_SUCCESS,
      taskCounters,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.GET_USER_TASK_COUNTERS_FAILURE,
    });
  }
}

function* getTasks(status) {
  const [userIdentifier, filters, sort] = yield all([
    select(userIdentifierSelector),
    select(selectedFiltersInMegaFilterSelector),
    select(sortSelector),
  ]);

  return yield filters && !isEmpty(filters)
    ? call(UserApi.getUserFilteredTasks, userIdentifier, sort, filters, status)
    : call(UserApi.getUserTasks, userIdentifier, sort, status);
}

function* getUserTasks() {
  try {
    const tasks = yield call(getTasks, TaskStatus.INCOMPLETE);
    yield put({ type: ActionTypes.GET_USER_TASKS_SUCCESS, tasks });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.GET_USER_TASKS_FAILURE });
  }
}

function* getUserCompletedTasks() {
  try {
    const tasks = yield call(getTasks, TaskStatus.COMPLETE);
    yield put({ type: ActionTypes.GET_USER_COMPLETED_TASKS_SUCCESS, tasks });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.GET_USER_COMPLETED_TASKS_FAILURE });
  }
}

function* selectFiltersFromMegaFilter({ id, status }) {
  const [userIdentifier, currentStatus] = yield all([
    select(userIdentifierSelector),
    select(currentTasksStatusSelector),
  ]);
  if (userIdentifier === id && currentStatus === status) {
    yield all([
      // put(PersonDetailsActions.getUserTaskFilterOptions()),
      status === TaskStatus.COMPLETE
        ? put(PersonDetailsActions.getUserCompletedTasks())
        : put(PersonDetailsActions.getUserTasks()),
    ]);
  }
}

function* sortUserTasks() {
  const currentStatus = yield select(currentTasksStatusSelector);

  yield currentStatus === TaskStatus.COMPLETE
    ? put(PersonDetailsActions.getUserCompletedTasks())
    : put(PersonDetailsActions.getUserTasks());
}

function* refreshUserTasks() {
  const currentStatus = yield select(currentTasksStatusSelector);
  yield put(PersonDetailsActions.getUserTaskCounters());

  yield currentStatus === TaskStatus.COMPLETE
    ? put(PersonDetailsActions.getUserCompletedTasks())
    : put(PersonDetailsActions.getUserTasks());
}

function* getUserTaskFilterOptions() {
  try {
    const [userIdentifier, currentStatus, selectedFilters] = yield all([
      select(userIdentifierSelector),
      select(currentTasksStatusSelector),
      select(selectedFiltersInMegaFilterSelector),
    ]);
    const filters = yield call(
      UserApi.getUserTaskFilterOptions,
      userIdentifier,
      currentStatus,
      selectedFilters,
    );
    yield put({
      type: ActionTypes.GET_USER_TASK_FILTER_OPTIONS_SUCCESS,
      filters,
    });
  } catch {
    yield put({ type: ActionTypes.GET_USER_TASK_FILTER_OPTIONS_FAILURE });
    yield put(showGlobalErrorAlert());
  }
}

export default function* watchUserDetails() {
  yield takeLatest(
    ActionTypes.INITIALIZE_USER_DETAILS_STATE,
    initializeUserDetailsState,
  );
  yield takeLatest(ActionTypes.GET_USER_DETAILS, getUserDetails);
  yield takeLatest(ActionTypes.GET_USER_TASK_COUNTERS, getUserTaskCounters);
  yield takeLatest(ActionTypes.GET_USER_TASKS, getUserTasks);
  yield takeLatest(ActionTypes.GET_USER_COMPLETED_TASKS, getUserCompletedTasks);
  yield takeLatest(
    ActionTypes.CHANGE_CURRENT_TASKS_STATUS,
    changeCurrentTasksStatus,
  );
  yield takeLatest(
    ActionTypes.SELECT_FILTERS_FROM_MEGA_FILTER,
    selectFiltersFromMegaFilter,
  );
  yield takeLatest(ActionTypes.SORT_USER_TASKS, sortUserTasks);
  yield takeLatest(ActionTypes.REFRESH_USER_TASKS, refreshUserTasks);
  yield takeLatest(
    ActionTypes.GET_USER_TASK_FILTER_OPTIONS,
    getUserTaskFilterOptions,
  );
}
