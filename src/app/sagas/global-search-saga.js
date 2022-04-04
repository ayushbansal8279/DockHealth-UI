import {
  takeEvery,
  select,
  put,
  debounce,
  call,
  takeLatest,
  delay,
} from 'redux-saga/effects';
import {
  isSearchingCompletedTasksSelector,
  searchValueSelector,
} from 'selectors/global-search-selectors';
import * as ActionTypes from 'actions/action-types';
import * as GlobalSearchActions from 'actions/global-search-actions';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import {
  toggleTaskCompletedStatus,
  setWorkflowStatus as setWorkflowStatusHelper,
  TASK_DISAPPEAR_DELAY,
} from 'helpers/task-update-helper';
import { userProfileSelector } from '../selectors/user-selectors';

const DO_SEARCH_TASKS = 'DO_SEARCH_TASKS';
const DO_REFRESH_TASKS = 'DO_REFRESH_TASKS';
const DO_SET_SEARCH_COMPLETED_TASKS = 'DO_SET_SEARCH_COMPLETED_TASKS';
const DO_SET_SEARCH_VALUE = 'DO_SET_SEARCH_VALUE';
const DO_CLEAR_SEARCH_VALUE = 'DO_CLEAR_SEARCH_VALUE';
const DO_SEARCH_MORE_TASKS = 'DO_SEARCH_MORE_TASKS';
export const DO_TOGGLE_GLOBAL_SEARCH_TASK_STATUS =
  'DO_TOGGLE_GLOBAL_SEARCH_TASK_STATUS';
export const DO_TOGGLE_GLOBAL_SEARCH_TASK_PRIORITY =
  'DO_TOGGLE_GLOBAL_SEARCH_TASK_PRIORITY';
export const DO_SET_GLOBAL_SEARCH_WORKFLOW_STATUS =
  'DO_SET_GLOBAL_SEARCH_WORKFLOW_STATUS';
export const DO_UPDATE_GLOBAL_SEARCH_TASK = 'DO_UPDATE_GLOBAL_SEARCH_TASK';

const searchTasks = () => ({
  type: DO_SEARCH_TASKS,
});

const refreshTasks = () => ({
  type: DO_REFRESH_TASKS,
});

const setSearchValue = value => ({
  type: DO_SET_SEARCH_VALUE,
  payload: { value },
});

const clearSearchValue = () => ({
  type: DO_CLEAR_SEARCH_VALUE,
});

const setSearchCompletedTasks = isSearchingCompletedTasks => ({
  type: DO_SET_SEARCH_COMPLETED_TASKS,
  payload: { isSearchingCompletedTasks },
});

const toggleTaskStatus = task => ({
  type: DO_TOGGLE_GLOBAL_SEARCH_TASK_STATUS,
  payload: {
    task,
  },
});

const setWorkflowStatus = (task, workflowStatus) => ({
  type: DO_SET_GLOBAL_SEARCH_WORKFLOW_STATUS,
  payload: {
    task,
    workflowStatus,
  },
});

const updateTask = (taskIdentifier, dataToUpdate) => ({
  type: DO_UPDATE_GLOBAL_SEARCH_TASK,
  payload: {
    taskIdentifier,
    dataToUpdate,
  },
});

const getMoreTasksForTaskList = (taskListIdentifier, taskCount) => ({
  type: DO_SEARCH_MORE_TASKS,
  payload: { taskListIdentifier, taskCount },
});

export const GlobalSearchSagaActions = {
  searchTasks,
  refreshTasks,
  setSearchValue,
  clearSearchValue,
  setSearchCompletedTasks,
  toggleTaskStatus,
  setWorkflowStatus,
  updateTask,
  getMoreTasksForTaskList,
};

function* doRefreshTasks() {
  try {
    const isSearchingCompletedTasks = yield select(
      isSearchingCompletedTasksSelector,
    );
    const searchValue = yield select(searchValueSelector);

    const status = isSearchingCompletedTasks ? 'COMPLETE' : 'INCOMPLETE';
    if (searchValue) {
      let taskStatus = '';
      // search for both completed and incompleted tasks
      if (status === 'INCOMPLETE') {
        taskStatus = status;
      }
      const response = yield call(TaskApi.searchTasks, searchValue, taskStatus);
      yield put(
        GlobalSearchActions.requestGlobalSearchSuccess(response.taskLists),
      );
    } else {
      yield put(GlobalSearchActions.requestGlobalSearchSuccess([]));
    }
  } catch (error) {
    yield put(GlobalSearchActions.requestGlobalSearchFailure());
  }
}

function* doSearchTasks() {
  try {
    yield put(GlobalSearchActions.requestGlobalSearch());
    yield call(doRefreshTasks);
  } catch (error) {
    console.log(error);
  }
}

function* doGetMoreTasksForTaskList({ payload }) {
  try {
    yield put(GlobalSearchActions.requestGlobalSearchMore());
    const { taskListIdentifier, taskCount } = payload;

    const isSearchingCompletedTasks = yield select(
      isSearchingCompletedTasksSelector,
    );
    const searchValue = yield select(searchValueSelector);

    const status = isSearchingCompletedTasks ? 'COMPLETE' : 'INCOMPLETE';
    if (searchValue && taskListIdentifier) {
      let taskStatus;
      // search for both completed and incompleted tasks
      if (status === 'INCOMPLETE') {
        taskStatus = status;
      }
      const response = yield call(
        TaskApi.searchTasks,
        searchValue,
        taskStatus,
        taskListIdentifier,
        null,
        null,
        taskCount,
      );
      yield put(
        GlobalSearchActions.requestGlobalSearchMoreSuccess(response.taskLists),
      );
    }
  } catch (error) {
    yield put(GlobalSearchActions.requestGlobalSearchMoreFailure());
  }
}

function* doSetSearchValue({ payload }) {
  const { value } = payload;

  try {
    yield put(GlobalSearchActions.setSearchValue(value));
    yield put(searchTasks());
  } catch (error) {
    console.log(error);
  }
}

function* doClearSearchValue() {
  try {
    yield put(GlobalSearchActions.setSearchValue(''));
    yield put(searchTasks());
  } catch (error) {
    console.log(error);
  }
}

function* doSetSearchCompletedTasks({ payload }) {
  try {
    const { isSearchingCompletedTasks } = payload;

    if (isSearchingCompletedTasks) {
      yield put(GlobalSearchActions.searchCompletedTasks());
    } else {
      yield put(GlobalSearchActions.searchIncompletedTasks());
    }

    yield put(searchTasks());
  } catch (error) {
    console.log(error);
  }
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

    if (!task.parentTaskIdentifier) {
      yield delay(TASK_DISAPPEAR_DELAY);
      yield put({
        type: ActionTypes.DELETE_TASK,
        taskIdentifier: task.taskIdentifier,
      });
    }

    yield put(AlertActions.showGlobalAlert(successMessage));
  } catch (error) {
    yield put(refreshTasks());
  }
}

function* doSetWorkflowStatus({ payload }) {
  const { workflowStatus, task } = payload;
  try {
    const updatedTask = setWorkflowStatusHelper(task, workflowStatus);
    yield put(GlobalSearchActions.updateGlobalSearchTask(updatedTask));

    yield call(
      TaskApi.updateWorkflowStatus,
      task.taskIdentifier,
      workflowStatus,
    );
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put(refreshTasks);
  }
}

function* doUpdateTask({ payload }) {
  const { taskIdentifier, dataToUpdate } = payload;
  try {
    const updatedTask = yield call(
      TaskApi.partialUpdateTask,
      taskIdentifier,
      dataToUpdate,
    );
    yield put(GlobalSearchActions.updateGlobalSearchTask(updatedTask));
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put(refreshTasks());
  }
}

export default function* watchGlobalSearch() {
  yield takeEvery(DO_SET_SEARCH_VALUE, doSetSearchValue);
  yield debounce(500, DO_SEARCH_TASKS, doSearchTasks);
  yield takeEvery(DO_REFRESH_TASKS, doRefreshTasks);
  yield takeEvery(DO_SET_SEARCH_COMPLETED_TASKS, doSetSearchCompletedTasks);
  yield takeLatest(
    DO_TOGGLE_GLOBAL_SEARCH_TASK_STATUS,
    doToggleTaskCompleteStatus,
  );
  yield takeLatest(DO_SET_GLOBAL_SEARCH_WORKFLOW_STATUS, doSetWorkflowStatus);
  yield takeLatest(DO_UPDATE_GLOBAL_SEARCH_TASK, doUpdateTask);
  yield takeLatest(DO_CLEAR_SEARCH_VALUE, doClearSearchValue);
  yield takeLatest(DO_SEARCH_MORE_TASKS, doGetMoreTasksForTaskList);
}
