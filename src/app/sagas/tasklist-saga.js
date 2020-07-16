import { GET_TASKLIST_SUCCESS } from 'actions/action-types';
import { getTaskListForUser } from 'api/tasklist-api';
import { takeLatest, call, put } from 'redux-saga/effects';

const DO_FETCH_TASKLIST_FOR_USER = 'DO_FETCH_TASKLIST_FOR_USER';

export const fetchTasklistForUser = () => ({
  type: DO_FETCH_TASKLIST_FOR_USER,
});

function* doFetchTasklistForUser() {
  try {
    const tasklist = yield call(getTaskListForUser);
    yield put({ type: GET_TASKLIST_SUCCESS, tasklist });
  } catch (error) {
    console.error('error', error);
  }
}

export default function* watchTasklist() {
  yield takeLatest(DO_FETCH_TASKLIST_FOR_USER, doFetchTasklistForUser);
}
