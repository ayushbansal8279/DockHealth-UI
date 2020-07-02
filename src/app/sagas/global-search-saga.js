import {
  takeEvery,
  select,
  put,
  debounce,
  call,
  takeLatest,
} from 'redux-saga/effects';
import {
  isSearchingCompletedTasksSelector,
  searchValueSelector,
} from 'selectors/global-search-selectors';
import * as GlobalSearchActions from 'actions/global-search-actions';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import {
  toggleTaskCompletedStatus,
  toggleTaskPriority,
} from 'helpers/task-update-helper';
import { userProfileSelector } from '../selectors/user-selectors';

const DO_SEARCH_TASKS = 'DO_SEARCH_TASKS';
const DO_SET_SEARCH_COMPLETED_TASKS = 'DO_SET_SEARCH_COMPLETED_TASKS';
const DO_SET_SEARCH_VALUE = 'DO_SET_SEARCH_VALUE';
export const DO_TOGGLE_GLOBAL_SEARCH_TASK_STATUS =
  'DO_TOGGLE_GLOBAL_SEARCH_TASK_STATUS';
export const DO_TOGGLE_GLOBAL_SEARCH_TASK_PRIORITY =
  'DO_TOGGLE_GLOBAL_SEARCH_TASK_PRIORITY';

const searchTasks = () => ({
  type: DO_SEARCH_TASKS,
});

const setSearchValue = value => ({
  type: DO_SET_SEARCH_VALUE,
  payload: { value },
});

const setSearchCompletedTasks = isSearchingCompletedTasks => ({
  type: DO_SET_SEARCH_COMPLETED_TASKS,
  payload: { isSearchingCompletedTasks },
});

const toggleGlobalSearchTaskStatus = task => ({
  type: DO_TOGGLE_GLOBAL_SEARCH_TASK_STATUS,
  payload: {
    task,
  },
});

const toggleGlobalSearchTaskPriority = task => ({
  type: DO_TOGGLE_GLOBAL_SEARCH_TASK_PRIORITY,
  payload: { task },
});

export const GlobalSearchSagaActions = {
  searchTasks,
  setSearchValue,
  setSearchCompletedTasks,
  toggleGlobalSearchTaskPriority,
  toggleGlobalSearchTaskStatus,
};

function* doSearchTasks() {
  try {
    yield put(GlobalSearchActions.requestGlobalSearch());
    const isSearchingCompletedTasks = yield select(
      isSearchingCompletedTasksSelector,
    );
    const searchValue = yield select(searchValueSelector);

    const status = isSearchingCompletedTasks ? 'COMPLETE' : 'INCOMPLETE';
    if (searchValue) {
      const response = yield call(TaskApi.searchTasks, searchValue, status);
      yield put(GlobalSearchActions.requestGlobalSearchSuccess(response));
    } else {
      yield put(GlobalSearchActions.requestGlobalSearchSuccess([]));
    }
  } catch (error) {
    yield put(GlobalSearchActions.requestGlobalSearchFailure());
    console.error('error', error);
  }
}

function* doSetSearchValue({ payload }) {
  const { value } = payload;

  yield put(GlobalSearchActions.setSearchValue(value));
  yield put(searchTasks());
}

function* doSetSearchCompletedTasks({ payload }) {
  const { isSearchingCompletedTasks } = payload;

  if (isSearchingCompletedTasks) {
    yield put(GlobalSearchActions.searchCompletedTasks());
  } else {
    yield put(GlobalSearchActions.searchIncompletedTasks());
  }

  yield put(searchTasks());
}

function* doToggleTaskCompleteStatus({ payload }) {
  const { task } = payload;

  try {
    const currentUser = yield select(userProfileSelector);

    const updatedTask = toggleTaskCompletedStatus(task, currentUser);

    const { apiEndpoint, successMessage } =
      updatedTask.status === 'COMPLETE'
        ? {
            apiEndpoint: 'markComplete',
            successMessage: AlertMessages.TASK_COMPLETED,
          }
        : {
            apiEndpoint: 'markIncomplete',
            successMessage: AlertMessages.TASK_REACTIVATED,
          };
    yield put(GlobalSearchActions.updateGlobalSearchTask(updatedTask));
    yield call(TaskApi[apiEndpoint], task);

    yield put(AlertActions.showGlobalAlert(successMessage));
  } catch (error) {
    // todo: refresh
  }
}

function* doToggleTaskPriority({ payload }) {
  const { task } = payload;

  const updatedTask = toggleTaskPriority(task);

  const apiEndpoint =
    updatedTask.priority === 'HIGH' ? 'markHighPriority' : 'markLowPriority';

  try {
    yield put(GlobalSearchActions.updateGlobalSearchTask(updatedTask));

    yield call(TaskApi[apiEndpoint], updatedTask.taskIdentifier);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    // todo: refresh
  }
}

export default function* watchGlobalSearch() {
  yield debounce(250, DO_SET_SEARCH_VALUE, doSetSearchValue);
  yield takeEvery(DO_SEARCH_TASKS, doSearchTasks);
  yield takeEvery(DO_SET_SEARCH_COMPLETED_TASKS, doSetSearchCompletedTasks);
  yield takeLatest(DO_TOGGLE_GLOBAL_SEARCH_TASK_PRIORITY, doToggleTaskPriority);
  yield takeLatest(
    DO_TOGGLE_GLOBAL_SEARCH_TASK_STATUS,
    doToggleTaskCompleteStatus,
  );
}
