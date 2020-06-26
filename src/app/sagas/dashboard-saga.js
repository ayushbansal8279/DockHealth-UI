import { all, put, call, takeEvery, takeLatest } from 'redux-saga/effects';
import {
  REQUEST_DASHBOARD_TASKS,
  REQUEST_DASHBOARD_TASKS_SUCCESS,
  REQUEST_DASHBOARD_TASKS_FAILURE,
} from 'actions/action-types';
import * as TemplateActions from 'actions/template-actions';
import { getDashboardTasks } from 'api/dashboard-api';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';

const INITIALIZE_DASHBOARD_VIEW = 'INITIALIZE_DASHBOARD_VIEW';
const LEAVE_DASHBOARD_VIEW = 'LEAVE_DASHBOARD_VIEW';
const FETCH_DASHBOARD_TASKS = 'FETCH_DASHBOARD_TASKS';
const RELOAD_DASHBOARD_TASKS = 'RELOAD_DASHBOARD_TASKS';
const TOGGLE_DASHBOARD_TASK_COMPLETE = 'TOGGLE_DASHBOARD_TASK_COMPLETE';
const QUICK_ADD_DASHBOARD_TASK = 'QUICK_ADD_DASHBOARD_TASK';

export const initializeDashboardView = () => ({
  type: INITIALIZE_DASHBOARD_VIEW,
});

export const leaveDashboardView = () => ({
  type: LEAVE_DASHBOARD_VIEW,
});

export const fetchDashboardTasks = () => ({ type: FETCH_DASHBOARD_TASKS });

export const toggleDashboardTaskComplete = task => ({
  type: TOGGLE_DASHBOARD_TASK_COMPLETE,
  task,
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
  try {
    yield call(TaskApi.markComplete, task);
    yield call(doReloadDashboardTasks);

    yield put(AlertActions.showGlobalAlert(AlertMessages.TASK_COMPLETED));
  } catch (error) {
    yield call(doReloadDashboardTasks);
  }
}

function* doInitializeDashboardView() {
  yield all([
    put(TemplateActions.hideHeader()),
    put(TemplateActions.enableNavbarFullMode()),
    put(TemplateActions.hideNavbarSettings()),
    put(TemplateActions.setCustomNavbarWidth(380)),
    put(TemplateActions.hideNavbar()),
    call(doFetchDashboardTasks),
  ]);
}

function* doLeaveDashboardView() {
  yield all([
    put(TemplateActions.showHeader()),
    put(TemplateActions.disableNavbarFullMode()),
    put(TemplateActions.showNavbarSettings()),
    put(TemplateActions.resetCustomNavbarWidth()),
    put(TemplateActions.showNavbar()),
  ]);
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
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield call(doReloadDashboardTasks);
  }
}

export default function* watchDashboard() {
  yield takeEvery(INITIALIZE_DASHBOARD_VIEW, doInitializeDashboardView);
  yield takeEvery(LEAVE_DASHBOARD_VIEW, doLeaveDashboardView);
  yield takeEvery(FETCH_DASHBOARD_TASKS, doFetchDashboardTasks);
  yield takeEvery(RELOAD_DASHBOARD_TASKS, doReloadDashboardTasks);
  yield takeEvery(QUICK_ADD_DASHBOARD_TASK, doQuickAddDahboardTask);
  yield takeLatest(
    TOGGLE_DASHBOARD_TASK_COMPLETE,
    doToggleDashboardTaskComplete,
  );
}
