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
  toggleTaskPriority as toggleTaskPriorityHelper,
  setDueDate as setDueDateHelper,
  setWorkflowStatus as setWorkflowStatusHelper,
  assignTask as assignTaskHelper,
  TASK_DISAPPEAR_DELAY,
} from 'helpers/task-update-helper';
import { userProfileSelector } from '../selectors/user-selectors';

const DO_SEARCH_TASKS = 'DO_SEARCH_TASKS';
const DO_REFRESH_TASKS = 'DO_REFRESH_TASKS';
const DO_SET_SEARCH_COMPLETED_TASKS = 'DO_SET_SEARCH_COMPLETED_TASKS';
const DO_SET_SEARCH_VALUE = 'DO_SET_SEARCH_VALUE';
const DO_CLEAR_SEARCH_VALUE = 'DO_CLEAR_SEARCH_VALUE';
export const DO_TOGGLE_GLOBAL_SEARCH_TASK_STATUS =
  'DO_TOGGLE_GLOBAL_SEARCH_TASK_STATUS';
export const DO_TOGGLE_GLOBAL_SEARCH_TASK_PRIORITY =
  'DO_TOGGLE_GLOBAL_SEARCH_TASK_PRIORITY';
export const DO_SET_GLOBAL_SEARCH_DUE_DATE = 'DO_SET_GLOBAL_SEARCH_DUE_DATE';
export const DO_SET_GLOBAL_SEARCH_WORKFLOW_STATUS =
  'DO_SET_GLOBAL_SEARCH_WORKFLOW_STATUS';
export const DO_ASSIGN_GLOBAL_SEARCH_TASK = 'DO_ASSIGN_GLOBAL_SEARCH_TASK';

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

const toggleTaskPriority = task => ({
  type: DO_TOGGLE_GLOBAL_SEARCH_TASK_PRIORITY,
  payload: { task },
});

const setDueDate = (task, dueDate) => ({
  type: DO_SET_GLOBAL_SEARCH_DUE_DATE,
  payload: {
    task,
    dueDate,
  },
});

const setWorkflowStatus = (task, workflowStatus) => ({
  type: DO_SET_GLOBAL_SEARCH_WORKFLOW_STATUS,
  payload: {
    task,
    workflowStatus,
  },
});

const assignTask = (task, assignee) => ({
  type: DO_ASSIGN_GLOBAL_SEARCH_TASK,
  payload: {
    task,
    assignee,
  },
});

export const GlobalSearchSagaActions = {
  searchTasks,
  refreshTasks,
  setSearchValue,
  clearSearchValue,
  setSearchCompletedTasks,
  toggleTaskPriority,
  toggleTaskStatus,
  setDueDate,
  setWorkflowStatus,
  assignTask,
};

function* doRefreshTasks() {
  try {
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

function* doSearchTasks() {
  yield put(GlobalSearchActions.requestGlobalSearch());
  yield call(doRefreshTasks);
}

function* doSetSearchValue({ payload }) {
  const { value } = payload;

  yield put(GlobalSearchActions.setSearchValue(value));
  yield put(searchTasks());
}

function* doClearSearchValue() {
  yield put(GlobalSearchActions.setSearchValue(''));
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

    if (!task.parentTaskIdentifier) {
      yield delay(TASK_DISAPPEAR_DELAY);
      yield put({ type: ActionTypes.DELETE_TASK_SUCCESS, task });
    }

    yield put(AlertActions.showGlobalAlert(successMessage));
  } catch (error) {
    console.error('error', error);
    yield put(refreshTasks());
  }
}

function* doToggleTaskPriority({ payload }) {
  const { task } = payload;

  const updatedTask = toggleTaskPriorityHelper(task);

  const apiEndpoint =
    updatedTask.priority === 'HIGH' ? 'markHighPriority' : 'markLowPriority';

  try {
    yield put(GlobalSearchActions.updateGlobalSearchTask(updatedTask));

    yield call(TaskApi[apiEndpoint], updatedTask.taskIdentifier);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    console.error('error', error);
    yield put(refreshTasks());
  }
}

function* doSetDueDate({ payload }) {
  const { task, dueDate } = payload;
  try {
    const updatedTask = setDueDateHelper(task, dueDate);
    yield put(GlobalSearchActions.updateGlobalSearchTask(updatedTask));

    yield call(TaskApi.updateDueDate, task?.taskIdentifier, dueDate);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
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

function* doAssignTask({ payload }) {
  const { task, assignee } = payload;

  try {
    const currentUser = yield select(userProfileSelector);
    const updatedTask = assignTaskHelper(task, assignee, currentUser);
    yield put(GlobalSearchActions.updateGlobalSearchTask(updatedTask));
    yield call(
      TaskApi.assignOrReassignTask,
      { taskIdentifier: task.taskIdentifier },
      assignee?.userIdentifier,
    );
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put(refreshTasks());
  }
}

export default function* watchGlobalSearch() {
  yield debounce(250, DO_SET_SEARCH_VALUE, doSetSearchValue);
  yield takeEvery(DO_SEARCH_TASKS, doSearchTasks);
  yield takeEvery(DO_REFRESH_TASKS, doRefreshTasks);
  yield takeEvery(DO_SET_SEARCH_COMPLETED_TASKS, doSetSearchCompletedTasks);
  yield takeLatest(DO_TOGGLE_GLOBAL_SEARCH_TASK_PRIORITY, doToggleTaskPriority);
  yield takeLatest(
    DO_TOGGLE_GLOBAL_SEARCH_TASK_STATUS,
    doToggleTaskCompleteStatus,
  );
  yield takeLatest(DO_SET_GLOBAL_SEARCH_DUE_DATE, doSetDueDate);
  yield takeLatest(DO_SET_GLOBAL_SEARCH_WORKFLOW_STATUS, doSetWorkflowStatus);
  yield takeLatest(DO_ASSIGN_GLOBAL_SEARCH_TASK, doAssignTask);
  yield takeLatest(DO_CLEAR_SEARCH_VALUE, doClearSearchValue);
}
