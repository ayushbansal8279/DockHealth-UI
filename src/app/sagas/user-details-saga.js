import { all, call, takeLatest, put, select } from 'redux-saga/effects';
import * as UserApi from 'api/user-api';
import * as ActionTypes from 'actions/action-types';
import * as PersonDetailsActions from 'actions/person-details-actions';
import {
  clearFiltersForMegaFilter,
  selectFiltersForMegaFilter,
} from 'actions/mega-filter-actions';
import { cleanedSelectedFilters } from 'helpers/mega-filter-helper';
import { showGlobalErrorAlert } from 'alert/actions';
import {
  userIdentifierSelector,
  sortSelector,
  currentTasksStatusSelector,
} from 'selectors/person-details-selectors';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import { TaskStatus } from 'helpers/task-helpers';
import isEmpty from 'ramda/src/isEmpty';
import { UserPreferenceContextType } from '../helpers/user-prefrence-helper';
import * as UserPreferenceApi from '../api/user-preference-api';
import {
  userPreferenceSelectedFiltersSelector,
  userPreferenceSelectedQuickFilterSelector,
} from '../selectors/user-preference-selectors';
import * as MegaFilterActions from 'actions/mega-filter-actions';

function* initializeUserTasks(status) {
  yield put(PersonDetailsActions.getUserTaskCounters());

  const userIdentifier = yield select(userIdentifierSelector);
  const preferences = yield call(
    UserPreferenceApi.getUserPreference,
    UserPreferenceContextType.PERSON_LIST,
    userIdentifier,
  );
  yield put({
    type: ActionTypes.UPDATE_USER_PREFERENCES_SUCCESS,
    preferences,
  });

  const selectedFilters = yield select(userPreferenceSelectedFiltersSelector);
  const selectedQuickFilter = yield select(
    userPreferenceSelectedQuickFilterSelector,
  );

  if (selectedFilters && !isEmpty(selectedFilters))
    yield put(
      selectFiltersForMegaFilter(
        selectedFilters,
        userIdentifier,
        status,
        selectedQuickFilter,
      ),
    );
  else {
    yield put(clearFiltersForMegaFilter());
    yield put(PersonDetailsActions.getUserTasks(status));
  }
}

function* filterUserDetailsTasks(payload) {
  const { filters, userIdentifier } = payload;
  const selectedFilters = cleanedSelectedFilters(filters);

  const partialDetails = {
    selectedFilters,
  };
  const status = yield select(currentTasksStatusSelector) ||
    TaskStatus.INCOMPLETE;
  const selectedQuickFilter = null;

  const preferences = yield call(
    UserPreferenceApi.updateUserPreference,
    UserPreferenceContextType.PERSON_LIST,
    userIdentifier,
    partialDetails,
  );

  yield put({
    type: ActionTypes.UPDATE_USER_PREFERENCES_SUCCESS,
    preferences,
  });

  yield put(
    MegaFilterActions.selectFiltersForMegaFilter(
      selectedFilters,
      userIdentifier,
      status,
      selectedQuickFilter,
    ),
  );
  yield call(getUserTasks, { status });
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

function* getUserTasks({ status }) {
  try {
    const taskStatus = status || TaskStatus.INCOMPLETE;
    const tasks = yield call(getTasks, taskStatus);
    yield put({
      type: ActionTypes.GET_USER_TASKS_SUCCESS,
      tasks,
      status: taskStatus,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.GET_USER_TASKS_FAILURE });
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
      put(PersonDetailsActions.getUserTasks(status)),
    ]);
  }
}

function* sortUserTasks() {
  const currentStatus = yield select(currentTasksStatusSelector);

  yield put(PersonDetailsActions.getUserTasks(currentStatus));
}

function* refreshUserTasks() {
  const currentStatus = yield select(currentTasksStatusSelector);
  yield put(PersonDetailsActions.getUserTaskCounters());

  yield put(PersonDetailsActions.getUserTasks(currentStatus));
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
  yield takeLatest(
    ActionTypes.FILTER_USER_DETAILS_TASKS,
    filterUserDetailsTasks,
  );
}
