import { takeEvery, put, call } from 'redux-saga/effects';
import * as patientBulkApi from 'api/patient-bulk-api';
import * as ActionTypes from 'actions/action-types';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as PatientsActions from 'actions/patients-actions';

function* addBulkTask({ payload }) {
  try {
    yield call(patientBulkApi.patientBulkCreateTask, payload);
    yield put(showGlobalAlert(AlertMessages.TASK_CREATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* addBulkWorkflow({ payload }) {
  try {
    yield call(patientBulkApi.patientBulkCreateWorkflow, payload);
    yield put(showGlobalAlert(AlertMessages.WORKFLOW_CREATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* deleteBulkPatient({ payload }) {
  const { assignedPatients, listIdentifier } = payload;
  try {
    yield call(patientBulkApi.patientBulkDeletePatient, assignedPatients);
    yield put({
      type: ActionTypes.CLEAR_SELECTED_PATIENTS_LIST,
    });
    yield put({
      type: ActionTypes.INITIALIZE_PATIENTS_LIST_STATE,
      patientsListIdentifier: listIdentifier,
    });
    yield put({
      type: ActionTypes.ActionTypes.GET_CURRENT_PATIENTS,
    });
    yield put(showGlobalAlert(AlertMessages.DELETED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

export default function* watchPatientBulk() {
  yield takeEvery(ActionTypes.PATIENT_BULK_CREATE_TASK, addBulkTask);
  yield takeEvery(ActionTypes.PATIENT_BULK_CREATE_WORKFLOW, addBulkWorkflow);
  yield takeEvery(ActionTypes.PATIENT_BULK_DELETE_PATIENTS, deleteBulkPatient);
}
