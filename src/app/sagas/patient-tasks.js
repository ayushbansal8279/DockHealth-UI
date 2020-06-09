import { put, call, takeLatest } from 'redux-saga/effects';
import * as PatientTasksApi from 'api/patient-tasks-api';
import {
  REQUEST_PATIENT_STATS_SUCCESS,
  REQUEST_PATIENT_STATS_FAILURE,
  REQUEST_PATIENT_TASKS,
  REQUEST_PATIENT_TASKS_SUCCESS,
  REQUEST_PATIENT_TASKS_FAILURE,
} from 'actions/action-types';

export const DO_GET_STATS_FOR_PATIENT_TASKS = 'DO_GET_STATS_FOR_PATIENT_TASKS';
export const DO_FETCH_PATIENT_TASKS = 'DO_FETCH_PATIENT_TASKS';

export const fetchStatsForPatientTasks = patientIdentifier => ({
  type: DO_GET_STATS_FOR_PATIENT_TASKS,
  payload: { patientIdentifier },
});

export const fetchPatientTasks = (
  patientIdentifier,
  status = 'INCOMPLETE',
) => ({
  type: DO_FETCH_PATIENT_TASKS,
  payload: {
    patientIdentifier,
    status,
  },
});

function* doFetchPatientTasks({ payload }) {
  const { patientIdentifier, status } = payload;
  yield put({ type: REQUEST_PATIENT_TASKS });

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

function* doFetchStatsForPatientTasks({ payload }) {
  const { patientIdentifier } = payload;

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

export default function* watchPatientTasks() {
  yield takeLatest(DO_GET_STATS_FOR_PATIENT_TASKS, doFetchStatsForPatientTasks);
  yield takeLatest(DO_FETCH_PATIENT_TASKS, doFetchPatientTasks);
}
