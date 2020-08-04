import { put, call, takeEvery, select, delay } from 'redux-saga/effects';
import { hashHistory } from 'react-router';
import {
  REQUEST_DASHBOARD_TASKS,
  REQUEST_DASHBOARD_TASKS_SUCCESS,
  REQUEST_DASHBOARD_TASKS_FAILURE,
  UPDATE_TASK_SUCCESS,
} from 'actions/action-types';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  getDashboardMyTasks,
  getDashboardAllTasks,
  reorderTasksInGroup,
} from 'api/dashboard-api';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import {
  toggleTaskCompletedStatus,
  setDueDate as setDueDateHelper,
} from 'helpers/task-update-helper';
import { fetchTasklistForUser } from 'sagas/tasklist-saga';

const INITIALIZE_MY_TASKS_DASHBOARD_VIEW = 'INITIALIZE_MY_TASKS_DASHBOARD_VIEW';
const INITIALIZE_ALL_TASKS_DASHBOARD_VIEW =
  'INITIALIZE_ALL_TASKS_DASHBOARD_VIEW';
const FETCH_DASHBOARD_MY_TASKS = 'FETCH_DASHBOARD_MY_TASKS';
const FETCH_DASHBOARD_ALL_TASKS = 'FETCH_DASHBOARD_ALL_TASKS';

const RELOAD_DASHBOARD_TASKS = 'RELOAD_DASHBOARD_TASKS';
const TOGGLE_DASHBOARD_TASK_COMPLETE = 'TOGGLE_DASHBOARD_TASK_COMPLETE';
const QUICK_ADD_DASHBOARD_TASK = 'QUICK_ADD_DASHBOARD_TASK';
const REDIRECT_TO_PARENT_TASK = 'REDIRECT_TO_PARENT_TASK';
const SORT_DASHBOARD_TASKS = 'SORT_DASHBOARD_TASKS';
const DO_UPDATE_DASHBOARD_TASK_DUE_DATE = 'DO_UPDATE_DASHBOARD_TASK_DUE_DATE';

export const initializeMyTasksDashboardView = () => ({
  type: INITIALIZE_MY_TASKS_DASHBOARD_VIEW,
});

export const initializeAllTasksDashboardView = () => ({
  type: INITIALIZE_ALL_TASKS_DASHBOARD_VIEW,
});

export const fetchDashboardMyTasks = () => ({ type: FETCH_DASHBOARD_MY_TASKS });
export const fetchDashboardAllTasks = () => ({
  type: FETCH_DASHBOARD_ALL_TASKS,
});
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

export const updateDashboardTaskDueDate = (task, dueDate) => ({
  type: DO_UPDATE_DASHBOARD_TASK_DUE_DATE,
  payload: {
    task,
    dueDate,
  },
});

const getTasksType = () => {
  const location = window.location?.hash?.split('/');
  const tab = location.slice(-1)[0];

  switch (tab) {
    case 'all-tasks':
      return 'all-tasks';
    case 'my-tasks':
      return 'my-tasks';
    default:
      return '';
  }
};

function* doFetchDashboardMyTasks() {
  try {
    yield put({ type: REQUEST_DASHBOARD_TASKS });
    const tasksList = yield getDashboardMyTasks();
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

function* doFetchDashboardAllTasks() {
  try {
    yield put({ type: REQUEST_DASHBOARD_TASKS });
    const tasksList = yield getDashboardAllTasks();
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
    const isAllTasks = getTasksType() === 'all-tasks';
    const tasksList = isAllTasks
      ? yield getDashboardAllTasks()
      : yield getDashboardMyTasks();
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
    console.error(error);
  }
}

function* doSortDashboardTasks({ taskGroupImplicitType, tasksOrder }) {
  try {
    yield reorderTasksInGroup({ tasksOrder, taskGroupImplicitType });
    yield call(doReloadDashboardTasks);
  } catch (error) {
    console.error(error);
  }
}

function* doInitializeMyTasksDashboardView() {
  yield call(doFetchDashboardMyTasks);
}

function* doInitializeAllTasksDashboardView() {
  yield call(doFetchDashboardAllTasks);
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
    yield put(fetchTasklistForUser());

    yield put(AlertActions.showGlobalAlert(AlertMessages.TASK_CREATED));
  } catch (error) {
    yield call(doReloadDashboardTasks);
  }
}

function* doUpdateDashboardTaskDueDate({ payload }) {
  const { task, dueDate } = payload;

  try {
    const updatedTask = setDueDateHelper(task, dueDate);
    yield put({ type: UPDATE_TASK_SUCCESS, task: updatedTask });

    yield call(TaskApi.updateDueDate, task?.taskIdentifier, dueDate);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield put(reloadDashboardTasks());
  } catch (error) {
    console.error(error);
    yield put(reloadDashboardTasks());
  }
}

export default function* watchDashboard() {
  yield takeEvery(
    INITIALIZE_MY_TASKS_DASHBOARD_VIEW,
    doInitializeMyTasksDashboardView,
  );
  yield takeEvery(
    INITIALIZE_ALL_TASKS_DASHBOARD_VIEW,
    doInitializeAllTasksDashboardView,
  );
  yield takeEvery(FETCH_DASHBOARD_MY_TASKS, doFetchDashboardMyTasks);
  yield takeEvery(FETCH_DASHBOARD_ALL_TASKS, doFetchDashboardAllTasks);
  yield takeEvery(RELOAD_DASHBOARD_TASKS, doReloadDashboardTasks);
  yield takeEvery(QUICK_ADD_DASHBOARD_TASK, doQuickAddDahboardTask);
  yield takeEvery(
    TOGGLE_DASHBOARD_TASK_COMPLETE,
    doToggleDashboardTaskComplete,
  );
  yield takeEvery(REDIRECT_TO_PARENT_TASK, doRedirectToParentTask);
  yield takeEvery(SORT_DASHBOARD_TASKS, doSortDashboardTasks);
  yield takeEvery(
    DO_UPDATE_DASHBOARD_TASK_DUE_DATE,
    doUpdateDashboardTaskDueDate,
  );
}
