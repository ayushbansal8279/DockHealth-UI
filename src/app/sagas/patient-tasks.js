import moment from 'moment';
import { put, call, takeLatest, select, all } from 'redux-saga/effects';
import * as PatientTasksApi from 'api/patient-tasks-api';
import * as TaskApi from 'api/task-api';
import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import {
  REQUEST_PATIENT_STATS_SUCCESS,
  REQUEST_PATIENT_STATS_FAILURE,
  REQUEST_PATIENT_TASKS,
  REQUEST_PATIENT_TASKS_SUCCESS,
  REQUEST_PATIENT_TASKS_FAILURE,
  UPDATE_PATIENT_TASK,
} from 'actions/action-types';
import { TaskListTabName } from 'components/taskView/Toolbar/config';

export const DO_FETCH_STATS_FOR_PATIENT_TASKS =
  'DO_FETCH_STATS_FOR_PATIENT_TASKS';
export const DO_FETCH_PATIENT_TASKS = 'DO_FETCH_PATIENT_TASKS';
export const DO_REFRESH_PATIENT_TASKS = 'DO_REFRESH_PATIENT_TASKS';
export const DO_TOGGLE_PATIENT_TASK_STATUS = 'DO_TOGGLE_PATIENT_TASK_STATUS';
export const DO_TOGGLE_PATIENT_TASK_PRIORITY =
  'DO_TOGGLE_PATIENT_TASK_PRIORITY';
export const DO_REASSIGN_TASK = 'DO_REASSIGN_TASK';

const getActiveTab = state => state.patientTasks.activeTab;
const getCurrentUser = state => state.userState.userProfile;
const getCurrentPatient = state => state.patientTasks.patientIdentifier;

export const fetchStatsForPatientTasks = () => ({
  type: DO_FETCH_STATS_FOR_PATIENT_TASKS,
});

export const fetchPatientTasks = () => ({
  type: DO_FETCH_PATIENT_TASKS,
});

export const refreshPatientTasks = () => ({
  type: DO_REFRESH_PATIENT_TASKS,
});

export const toggleTaskStatus = task => ({
  type: DO_TOGGLE_PATIENT_TASK_STATUS,
  payload: {
    task,
  },
});

export const toggleTaskPriority = task => ({
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

export const reassignTask = (taskIdentifier, userId) => ({
  type: DO_REASSIGN_TASK,
  payload: {
    taskIdentifier,
    userId,
  },
});

export const PatientTasksActions = {
  fetchStatsForPatientTasks,
  fetchPatientTasks,
  refreshPatientTasks,
  toggleTaskStatus,
  toggleTaskPriority,
  updatePatientTask,
  reassignTask,
};

function* doFetchPatientTasks() {
  yield put({ type: REQUEST_PATIENT_TASKS });
  const patientIdentifier = yield select(getCurrentPatient);
  const activeTab = yield select(getActiveTab);

  const status =
    activeTab === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

  try {
    const lists = yield call(
      PatientTasksApi.fetchPatientTasksByPatientIdentifier,
      patientIdentifier,
      status,
    );
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
  const patientIdentifier = yield select(getCurrentPatient);

  try {
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

function* doRefreshPatientTasks() {
  const patientIdentifier = yield select(getCurrentPatient);
  const activeTab = yield select(getActiveTab);
  const status =
    activeTab === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

  try {
    const lists = yield call(
      PatientTasksApi.fetchPatientTasksByPatientIdentifier,
      patientIdentifier,
      status,
    );
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

function* doToggleTaskCompleteStatus({ payload }) {
  const { task } = payload;
  const currentUser = yield select(getCurrentUser);

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

  try {
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
  yield put(updatePatientTask(taskIdentifier, newTaskData));

  try {
    yield call(TaskApi[apiEndpoint], taskIdentifier);
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
}

function* doReassignTask({ payload }) {
  const { taskIdentifier, userId } = payload;
  try {
    yield call(TaskApi.assignOrReassignTask, { taskIdentifier }, userId);
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  }
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
}
