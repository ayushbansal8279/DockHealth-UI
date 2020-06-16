import moment from 'moment';
import {
  put,
  call,
  takeLatest,
  select,
  all,
  takeEvery,
} from 'redux-saga/effects';
import * as PatientTasksApi from 'api/patient-tasks-api';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import AlertMessages from 'alert/AlertMessages';
import {
  REQUEST_PATIENT_STATS_SUCCESS,
  REQUEST_PATIENT_STATS_FAILURE,
  REQUEST_PATIENT_TASKS,
  REQUEST_PATIENT_TASKS_SUCCESS,
  REQUEST_PATIENT_TASKS_FAILURE,
  UPDATE_PATIENT_TASK,
  FETCH_MEGA_FILTERS_SUCCESS,
  FETCH_MEGA_FILTERS_FAILURE,
  SET_PATIENT_TASK_SEARCH_VALUE,
} from 'actions/action-types';
import { TaskListTabName } from 'components/taskView/Toolbar/config';

import { userProfileSelector } from 'selectors/user-selectors';
import {
  patientTaskListsActiveTabSelector,
  currentPatientIdentifierSelector,
} from 'selectors/patient-tasks-selectors';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import { isEmpty } from 'ramda';

export const DO_FETCH_STATS_FOR_PATIENT_TASKS =
  'DO_FETCH_STATS_FOR_PATIENT_TASKS';
export const DO_FETCH_PATIENT_TASKS = 'DO_FETCH_PATIENT_TASKS';
export const DO_REFRESH_PATIENT_TASKS = 'DO_REFRESH_PATIENT_TASKS';
export const DO_TOGGLE_PATIENT_TASK_STATUS = 'DO_TOGGLE_PATIENT_TASK_STATUS';
export const DO_TOGGLE_PATIENT_TASK_PRIORITY =
  'DO_TOGGLE_PATIENT_TASK_PRIORITY';
export const DO_REASSIGN_TASK = 'DO_REASSIGN_TASK';
export const DO_UPDATE_DUE_DATE = 'DO_UPDATE_DUE_DATE';
export const DO_UPDATE_PATIENT_WORKFLOW_STATUS =
  'DO_UPDATE_PATIENT_WORKFLOW_STATUS';
export const DO_QUICK_ADD_PATIENT_TASK = 'DO_QUICK_ADD_PATIENT_TASK';
export const DO_FETCH_PATIENT_FILTERS = 'DO_FETCH_PATIENT_FILTERS';
export const DO_UPDATE_PATIENT_TASKS_FILTERS =
  'DO_UPDATE_PATIENT_TASKS_FILTERS';
export const DO_INITIALIZE_SAVED_FILTERS_FOR_PATIENT =
  'DO_INITIALIZE_SAVED_FILTERS_FOR_PATIENT';
export const DO_SET_PATIENT_TASK_SEARCH_VALUE =
  'DO_SET_PATIENT_TASK_SEARCH_VALUE';

export const quickAddPatientTask = (description, taskListIdentifier) => ({
  type: DO_QUICK_ADD_PATIENT_TASK,
  payload: {
    description,
    taskListIdentifier,
  },
});

export const fetchStatsForPatientTasks = () => ({
  type: DO_FETCH_STATS_FOR_PATIENT_TASKS,
});

export const fetchPatientFilters = () => ({
  type: DO_FETCH_PATIENT_FILTERS,
});

export const fetchPatientTasks = () => ({
  type: DO_FETCH_PATIENT_TASKS,
});

export const refreshPatientTasks = () => ({
  type: DO_REFRESH_PATIENT_TASKS,
});

export const togglePatientTaskStatus = task => ({
  type: DO_TOGGLE_PATIENT_TASK_STATUS,
  payload: {
    task,
  },
});

export const togglePatientTaskPriority = task => ({
  type: DO_TOGGLE_PATIENT_TASK_PRIORITY,
  payload: { task },
});

export const updatePatientTask = (taskIdentifier, newTaskData) => ({
  type: UPDATE_PATIENT_TASK,
  payload: {
    taskIdentifier,
    newTaskData,
  },
});

export const reassignPatientTask = (taskIdentifier, userId) => ({
  type: DO_REASSIGN_TASK,
  payload: {
    taskIdentifier,
    userId,
  },
});

export const updatePatientTaskDueDate = (task, dueDate) => ({
  type: DO_UPDATE_DUE_DATE,
  payload: {
    task,
    dueDate,
  },
});

export const updatePatientTaskWorkflowStatus = (task, workflowStatus) => ({
  type: DO_UPDATE_PATIENT_WORKFLOW_STATUS,
  payload: {
    task,
    workflowStatus,
  },
});

export const patientTasksFilterChange = selectedFilters => ({
  type: DO_UPDATE_PATIENT_TASKS_FILTERS,
  payload: {
    selectedFilters,
  },
});

export const initalizeSavedFilters = () => ({
  type: DO_INITIALIZE_SAVED_FILTERS_FOR_PATIENT,
});

export const setPatientTaskSearch = value => ({
  type: DO_SET_PATIENT_TASK_SEARCH_VALUE,
  payload: {
    value,
  },
});

export const PatientTasksSagaActions = {
  fetchStatsForPatientTasks,
  fetchPatientTasks,
  refreshPatientTasks,
  togglePatientTaskStatus,
  togglePatientTaskPriority,
  updatePatientTask,
  reassignPatientTask,
  updatePatientTaskDueDate,
  updatePatientTaskWorkflowStatus,
  quickAddPatientTask,
  patientTasksFilterChange,
  initalizeSavedFilters,
  setPatientTaskSearch,
};

function* getPatientLists() {
  const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);
  const patientIdentifier = yield select(currentPatientIdentifierSelector);
  const activeTab = yield select(patientTaskListsActiveTabSelector);
  const status =
    activeTab === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

  let lists;
  if (!selectedFilters || !isEmpty(selectedFilters)) {
    lists = yield call(
      PatientTasksApi.fetchPatientTasksByPatientIdentifierWithFilters,
      patientIdentifier,
      selectedFilters,
      status,
    );
  } else {
    lists = yield call(
      PatientTasksApi.fetchPatientTasksByPatientIdentifier,
      patientIdentifier,
      status,
    );
  }
  return lists;
}

function* doFetchPatientTasks() {
  try {
    yield put({ type: REQUEST_PATIENT_TASKS });
    const lists = yield getPatientLists();
    yield put({
      type: REQUEST_PATIENT_TASKS_SUCCESS,
      payload: { lists },
    });
  } catch (error) {
    yield put({
      type: REQUEST_PATIENT_TASKS_FAILURE,
    });
  }
}

function* doRefreshPatientTasks() {
  try {
    const lists = yield getPatientLists();

    yield put({
      type: REQUEST_PATIENT_TASKS_SUCCESS,
      payload: { lists },
    });
  } catch (error) {
    yield put({
      type: REQUEST_PATIENT_TASKS_FAILURE,
    });
  }
}

function* doFetchStatsForPatientTasks() {
  try {
    const patientIdentifier = yield select(currentPatientIdentifierSelector);

    const stats = yield call(
      PatientTasksApi.fetchStatsForPatientTasks,
      patientIdentifier,
    );
    const successPayload = {};
    successPayload.incompleteTasksCount = stats.find(
      stat => stat.metricName === 'INCOMPLETE_TASKS_COUNT',
    )?.metricValue;
    successPayload.completeTasksCount = stats.find(
      stat => stat.metricName === 'COMPLETE_TASKS_COUNT',
    )?.metricValue;

    yield put({ type: REQUEST_PATIENT_STATS_SUCCESS, payload: successPayload });
  } catch (error) {
    yield put({ type: REQUEST_PATIENT_STATS_FAILURE });
  }
}

function* doFetchPatientFilters() {
  const patientIdentifier = yield select(currentPatientIdentifierSelector);
  const activeTab = yield select(patientTaskListsActiveTabSelector);
  const status =
    activeTab === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

  try {
    const filters = yield call(
      PatientTasksApi.fetchPatientFilters,
      patientIdentifier,
      status,
    );
    yield put({
      type: FETCH_MEGA_FILTERS_SUCCESS,
      filters,
    });
  } catch (error) {
    yield put({
      type: FETCH_MEGA_FILTERS_FAILURE,
    });
  }
}

function* doToggleTaskCompleteStatus({ payload }) {
  const { task } = payload;

  try {
    const currentUser = yield select(userProfileSelector);
    const { apiEndpoint, newStatus, successMessage } =
      task.status === 'INCOMPLETE'
        ? {
            apiEndpoint: 'markComplete',
            newStatus: 'COMPLETE',
            successMessage: AlertMessages.TASK_COMPLETED,
          }
        : {
            apiEndpoint: 'markIncomplete',
            newStatus: 'INCOMPLETE',
            successMessage: AlertMessages.TASK_REACTIVATED,
          };

    const newTaskData = {
      status: newStatus,
      completedBy: newStatus === 'COMPLETE' ? currentUser : null,
      completedDt:
        newStatus === 'COMPLETE'
          ? moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
          : null,
    };
    yield put(updatePatientTask(task.taskIdentifier, newTaskData));

    yield call(TaskApi[apiEndpoint], task);
    yield put(AlertActions.showGlobalAlert(successMessage));
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doToggleTaskPriority({ payload }) {
  const {
    task: { taskIdentifier, priority },
  } = payload;

  const { newPriority, apiEndpoint } =
    !priority || priority === 'NONE' || priority === 'LOW' || priority === null
      ? { newPriority: 'HIGH', apiEndpoint: 'markHighPriority' }
      : { newPriority: 'LOW', apiEndpoint: 'markLowPriority' };

  const newTaskData = { priority: newPriority };
  try {
    yield put(updatePatientTask(taskIdentifier, newTaskData));

    yield call(TaskApi[apiEndpoint], taskIdentifier);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doReassignTask({ payload }) {
  const { taskIdentifier, userId } = payload;

  try {
    yield call(TaskApi.assignOrReassignTask, { taskIdentifier }, userId);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doUpdateDueDate({ payload }) {
  const { task, dueDate } = payload;

  try {
    yield put(updatePatientTask(task?.taskIdentifier, { dueDate }));

    yield call(TaskApi.updateDueDate, task?.taskIdentifier, dueDate);
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doUpdatePatientTaskWorkflowStatus({ payload }) {
  const { workflowStatus, task } = payload;
  try {
    yield put(updatePatientTask(task?.taskIdentifier, { workflowStatus }));

    yield call(
      TaskApi.updateWorkflowStatus,
      task.taskIdentifier,
      workflowStatus,
    );
    yield put(AlertActions.showGlobalAlert(AlertMessages.UPDATED));
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doQuickAddPatientTask({ payload }) {
  const { description, taskListIdentifier } = payload;

  try {
    const patientIdentifier = yield select(currentPatientIdentifierSelector);

    yield call(TaskApi.addTask, {
      description,
      taskListIdentifier,
      patientIdentifier,
    });
    yield put(AlertActions.showGlobalAlert(AlertMessages.TASK_CREATED));
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doUpdatePatientTasksFilters({ payload }) {
  const { selectedFilters } = payload;
  const patientIdentifier = yield select(currentPatientIdentifierSelector);
  const activeTab = yield select(patientTaskListsActiveTabSelector);
  const status =
    activeTab === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

  yield put(
    MegaFilterActions.selectFiltersForMegaFilter(
      selectedFilters,
      patientIdentifier,
      status,
    ),
  );
  yield put(refreshPatientTasks());
}

function* doInitializeSavedFiltersForPatient() {
  const patientIdentifier = yield select(currentPatientIdentifierSelector);
  const activeTab = yield select(patientTaskListsActiveTabSelector);
  const status =
    activeTab === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';
  yield put(
    MegaFilterActions.selectFiltersFromLocalStorage(patientIdentifier, status),
  );
}

function* doSetPatientTaskSearch({ payload }) {
  yield put({ type: SET_PATIENT_TASK_SEARCH_VALUE, payload });
}

export default function* watchPatientTasks() {
  yield takeLatest(
    DO_FETCH_STATS_FOR_PATIENT_TASKS,
    doFetchStatsForPatientTasks,
  );
  yield takeLatest(DO_FETCH_PATIENT_TASKS, doFetchPatientTasks);
  yield takeLatest(DO_TOGGLE_PATIENT_TASK_STATUS, doToggleTaskCompleteStatus);
  yield takeLatest(DO_REFRESH_PATIENT_TASKS, doRefreshPatientTasks);
  yield takeLatest(DO_TOGGLE_PATIENT_TASK_PRIORITY, doToggleTaskPriority);
  yield takeLatest(DO_REASSIGN_TASK, doReassignTask);
  yield takeLatest(DO_UPDATE_DUE_DATE, doUpdateDueDate);
  yield takeLatest(
    DO_UPDATE_PATIENT_WORKFLOW_STATUS,
    doUpdatePatientTaskWorkflowStatus,
  );
  yield takeEvery(DO_QUICK_ADD_PATIENT_TASK, doQuickAddPatientTask);
  yield takeLatest(DO_FETCH_PATIENT_FILTERS, doFetchPatientFilters);
  yield takeLatest(
    DO_UPDATE_PATIENT_TASKS_FILTERS,
    doUpdatePatientTasksFilters,
  );
  yield takeLatest(
    DO_INITIALIZE_SAVED_FILTERS_FOR_PATIENT,
    doInitializeSavedFiltersForPatient,
  );
  yield takeLatest(DO_SET_PATIENT_TASK_SEARCH_VALUE, doSetPatientTaskSearch);
}
