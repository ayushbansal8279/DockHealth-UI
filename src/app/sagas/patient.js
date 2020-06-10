import { put, call, takeEvery, select } from 'redux-saga/effects';
import { getPatientById, createPatientNote } from 'api/patient-api';
import {
  FETCH_PATIENT,
  FETCH_PATIENT_SUCCESS,
  FETCH_PATIENT_ERROR,
} from 'actions/action-types';
import { locationParametersSelector } from '../location/selectors';

export const DO_GET_PATIENT = 'DO_GET_PATIENT';
export const DO_ADD_PATIENT_NOTE = 'DO_ADD_PATIENT_NOTE';

export const getPatient = () => ({
  type: DO_GET_PATIENT,
});

export const addPatientNote = payload => ({
  type: DO_ADD_PATIENT_NOTE,
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

    yield call(createPatientNote, patientIdentifier, note);

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

export default function* watchPatient() {
  yield takeEvery(DO_GET_PATIENT, doGetPatient);
  yield takeEvery(DO_ADD_PATIENT_NOTE, doAddPatientNote);
}
