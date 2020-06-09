import moment from 'moment';
import {
  put,
  call,
  takeLatest,
  takeEvery,
  select,
  all,
} from 'redux-saga/effects';
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
  TOGGLE_TASK_STATUS,
} from 'actions/action-types';
import { TaskListTabName } from 'components/taskView/Toolbar/config';

export const DO_FETCH_STATS_FOR_PATIENT_TASKS =
  'DO_FETCH_STATS_FOR_PATIENT_TASKS';
export const DO_FETCH_PATIENT_TASKS = 'DO_FETCH_PATIENT_TASKS';
export const DO_REFRESH_PATIENT_TASKS = 'DO_REFRESH_PATIENT_TASKS';
export const DO_TOGGLE_PATIENT_TASK_STATUS = 'DO_TOGGLE_PATIENT_TASK_STATUS';

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

export const PatientTasksActions = {
  fetchStatsForPatientTasks,
  fetchPatientTasks,
  refreshPatientTasks,
  toggleTaskStatus,
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
  yield put({
    type: TOGGLE_TASK_STATUS,
    payload: {
      taskIdentifier: task.taskIdentifier,
      newTaskData,
    },
  });

  try {
    yield TaskApi[apiEndpoint](task);
    yield put(AlertActions.showGlobalAlert(successMessage));
    yield all([put(refreshPatientTasks()), put(fetchStatsForPatientTasks())]);
  } catch (error) {
    yield put(refreshPatientTasks());
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

export default function* watchPatientTasks() {
  yield takeLatest(
    DO_FETCH_STATS_FOR_PATIENT_TASKS,
    doFetchStatsForPatientTasks,
  );
  yield takeLatest(DO_FETCH_PATIENT_TASKS, doFetchPatientTasks);
  yield takeEvery(DO_TOGGLE_PATIENT_TASK_STATUS, doToggleTaskCompleteStatus);
  yield takeLatest(DO_REFRESH_PATIENT_TASKS, doRefreshPatientTasks);
}
