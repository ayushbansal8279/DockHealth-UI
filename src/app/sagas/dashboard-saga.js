import { put, call, takeEvery, select, delay } from 'redux-saga/effects';
import { hashHistory } from 'react-router';
import {
  REQUEST_DASHBOARD_TASKS,
  REQUEST_DASHBOARD_TASKS_SUCCESS,
  REQUEST_DASHBOARD_TASKS_FAILURE,
  UPDATE_TASK_SUCCESS,
} from 'actions/action-types';
import { userProfileSelector } from 'selectors/user-selectors';
import { getDashboardTasks, reorderTasksInGroup } from 'api/dashboard-api';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { toggleTaskCompletedStatus } from 'helpers/task-update-helper';

const INITIALIZE_DASHBOARD_VIEW = 'INITIALIZE_DASHBOARD_VIEW';
const FETCH_DASHBOARD_TASKS = 'FETCH_DASHBOARD_TASKS';
const RELOAD_DASHBOARD_TASKS = 'RELOAD_DASHBOARD_TASKS';
const TOGGLE_DASHBOARD_TASK_COMPLETE = 'TOGGLE_DASHBOARD_TASK_COMPLETE';
const QUICK_ADD_DASHBOARD_TASK = 'QUICK_ADD_DASHBOARD_TASK';
const REDIRECT_TO_PARENT_TASK = 'REDIRECT_TO_PARENT_TASK';
const SORT_DASHBOARD_TASKS = 'SORT_DASHBOARD_TASKS';

export const initializeDashboardView = () => ({
  type: INITIALIZE_DASHBOARD_VIEW,
});

export const fetchDashboardTasks = () => ({ type: FETCH_DASHBOARD_TASKS });
export const reloadDashboardTasks = () => ({ type: RELOAD_DASHBOARD_TASKS });
export const redirectToParentTask = (
  taskListIdentifier,
  taskIdentifer,
  taskStatus,
) => ({
  type: REDIRECT_TO_PARENT_TASK,
  taskListIdentifier,
  taskIdentifer,
  taskStatus,
});

export const toggleDashboardTaskComplete = task => ({
  type: TOGGLE_DASHBOARD_TASK_COMPLETE,
  task,
});

export const sortDashboardTasks = (taskGroupImplicitType, tasksOrder) => ({
  type: SORT_DASHBOARD_TASKS,
  taskGroupImplicitType,
  tasksOrder,
});

export const quickAddDashboardTask = (
  taskName,
  taskListIdentifier,
  assignedToIdentifier,
) => ({
  type: QUICK_ADD_DASHBOARD_TASK,
  payload: {
    description: taskName,
    taskListIdentifier,
    assignedToIdentifier,
  },
});

function* doFetchDashboardTasks() {
  try {
    yield put({ type: REQUEST_DASHBOARD_TASKS });
    const tasksList = yield getDashboardTasks();
    yield put({
      type: REQUEST_DASHBOARD_TASKS_SUCCESS,
      tasksList,
    });
  } catch (error) {
    yield put({
      type: REQUEST_DASHBOARD_TASKS_FAILURE,
    });
  }
}

function* doReloadDashboardTasks() {
  try {
    const tasksList = yield getDashboardTasks();
    yield put({
      type: REQUEST_DASHBOARD_TASKS_SUCCESS,
      tasksList,
    });
  } catch (error) {
    yield put({
      type: REQUEST_DASHBOARD_TASKS_FAILURE,
    });
  }
}

function* doToggleDashboardTaskComplete({ task }) {
  if (task.status === 'COMPLETE') return;

  try {
    const currentUser = yield select(userProfileSelector);

    const updatedTask = toggleTaskCompletedStatus(task, currentUser);

    yield put({ type: UPDATE_TASK_SUCCESS, task: updatedTask });

    yield call(TaskApi.markComplete, task);
    yield delay(1000);
    yield call(doReloadDashboardTasks);

    yield put(AlertActions.showGlobalAlert(AlertMessages.TASK_COMPLETED));
  } catch (error) {
    yield call(doReloadDashboardTasks);
  }
}

function* doRedirectToParentTask({
  taskListIdentifier,
  taskIdentifer,
  taskStatus,
}) {
  try {
    yield call(
      hashHistory.push,
      `tasks/${taskListIdentifier}/${taskStatus}/${taskIdentifer}`,
    );
  } catch (error) {
    console.log(error);
  }
}

function* doSortDashboardTasks({ taskGroupImplicitType, tasksOrder }) {
  try {
    yield reorderTasksInGroup({ tasksOrder, taskGroupImplicitType });
    yield call(doReloadDashboardTasks);
  } catch (error) {
    console.log(error);
  }
}

function* doInitializeDashboardView() {
  yield call(doFetchDashboardTasks);
}

function* doQuickAddDahboardTask({ payload }) {
  const { description, taskListIdentifier, assignedToIdentifier } = payload;

  try {
    yield call(TaskApi.addTask, {
      description,
      taskListIdentifier,
      assignedToIdentifier,
    });
    yield call(doReloadDashboardTasks);
    yield put(AlertActions.showGlobalAlert(AlertMessages.TASK_CREATED));
  } catch (error) {
    yield call(doReloadDashboardTasks);
  }
}

export default function* watchDashboard() {
  yield takeEvery(INITIALIZE_DASHBOARD_VIEW, doInitializeDashboardView);
  yield takeEvery(FETCH_DASHBOARD_TASKS, doFetchDashboardTasks);
  yield takeEvery(RELOAD_DASHBOARD_TASKS, doReloadDashboardTasks);
  yield takeEvery(QUICK_ADD_DASHBOARD_TASK, doQuickAddDahboardTask);
  yield takeEvery(
    TOGGLE_DASHBOARD_TASK_COMPLETE,
    doToggleDashboardTaskComplete,
  );
  yield takeEvery(REDIRECT_TO_PARENT_TASK, doRedirectToParentTask);
  yield takeEvery(SORT_DASHBOARD_TASKS, doSortDashboardTasks);
}
