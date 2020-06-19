import { put, call, takeEvery, takeLatest, select } from 'redux-saga/effects';
import {
  getPatientById,
  updatePatient as updatePatientApi,
  createPatientNote,
  deletePatientNote as deletePatientNoteApi,
  updatePatientNote as updatePatientNoteApi,
} from 'api/patient-api';
import {
  FETCH_PATIENT,
  FETCH_PATIENT_SUCCESS,
  FETCH_PATIENT_ERROR,
} from 'actions/action-types';
import { closeModal } from 'modal/actions';
import { locationParametersSelector } from '../location/selectors';

export const DO_GET_PATIENT = 'DO_GET_PATIENT';
export const DO_ADD_PATIENT_NOTE = 'DO_ADD_PATIENT_NOTE';
export const DO_EDIT_PATIENT_NOTE = 'DO_EDIT_PATIENT_NOTE';
export const DO_DELETE_PATIENT_NOTE = 'DO_DELETE_PATIENT_NOTE';
export const DO_UPDATE_PATIENT = 'DO_UPDATE_PATIENT';

export const getPatient = () => ({
  type: DO_GET_PATIENT,
});

export const addPatientNote = payload => ({
  type: DO_ADD_PATIENT_NOTE,
  ...payload,
});

export const editPatientNote = payload => ({
  type: DO_EDIT_PATIENT_NOTE,
  ...payload,
});

export const deletePatientNote = payload => ({
  type: DO_DELETE_PATIENT_NOTE,
  ...payload,
});

export const updatePatient = payload => ({
  type: DO_UPDATE_PATIENT,
  ...payload,
});

export function* doGetPatient() {
  try {
    const { patientIdentifier } = yield select(locationParametersSelector);

    yield put({ type: FETCH_PATIENT });
    const details = yield call(getPatientById, patientIdentifier);

    yield put({
      type: FETCH_PATIENT_SUCCESS,
      details,
    });
  } catch (error) {
    yield put({ type: FETCH_PATIENT_ERROR, error });
  }
}

export function* doAddPatientNote(payload) {
  const { note } = payload;
  try {
    const { patientIdentifier } = yield select(locationParametersSelector);

    yield call(createPatientNote, patientIdentifier, { description: note });

    yield put({ type: FETCH_PATIENT });
    const details = yield call(getPatientById, patientIdentifier);

    yield put({
      type: FETCH_PATIENT_SUCCESS,
      details,
    });
  } catch (error) {
    yield put({ type: FETCH_PATIENT_ERROR, error });
  }
}

export function* doEditPatientNote(payload) {
  const { note, patientNoteIdentifier } = payload;
  try {
    const { patientIdentifier } = yield select(locationParametersSelector);

    yield call(updatePatientNoteApi, {
      patientNoteIdentifier,
      description: note,
    });

    yield put({ type: FETCH_PATIENT });
    const details = yield call(getPatientById, patientIdentifier);

    yield put({
      type: FETCH_PATIENT_SUCCESS,
      details,
    });
  } catch (error) {
    yield put({ type: FETCH_PATIENT_ERROR, error });
  }
}

export function* doDeletePatientNote(payload) {
  const { patientNoteIdentifier } = payload;
  try {
    const { patientIdentifier } = yield select(locationParametersSelector);
    yield call(deletePatientNoteApi, patientNoteIdentifier);
    yield put(closeModal());

    yield put({ type: FETCH_PATIENT });
    const details = yield call(getPatientById, patientIdentifier);

    yield put({
      type: FETCH_PATIENT_SUCCESS,
      details,
    });
  } catch (error) {
    yield put(closeModal());

    yield put({ type: FETCH_PATIENT_ERROR, error });
  }
}

export function* doUpdatePatient(payload) {
  const { patient } = payload;
  try {
    const { patientIdentifier } = yield select(locationParametersSelector);

    yield put({ type: FETCH_PATIENT });

    yield call(updatePatientApi, patient);

    const details = yield call(getPatientById, patientIdentifier);

    yield put({
      type: FETCH_PATIENT_SUCCESS,
      details,
    });
  } catch (error) {
    yield put({ type: FETCH_PATIENT_ERROR, error });
  }
}

export default function* watchPatient() {
  yield takeEvery(DO_GET_PATIENT, doGetPatient);
  yield takeLatest(DO_ADD_PATIENT_NOTE, doAddPatientNote);
  yield takeLatest(DO_EDIT_PATIENT_NOTE, doEditPatientNote);
  yield takeLatest(DO_DELETE_PATIENT_NOTE, doDeletePatientNote);
  yield takeLatest(DO_UPDATE_PATIENT, doUpdatePatient);
}
