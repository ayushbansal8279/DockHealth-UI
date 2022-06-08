import { put, call, takeEvery } from 'redux-saga/effects';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as ActionTypes from 'actions/action-types';
import * as UserApi from 'api/user-api';

function* updateUser({ user }) {
  try {
    yield call(UserApi.updateUser, user);
    yield put(showGlobalAlert(AlertMessages.UPDATED));
    yield put({ type: ActionTypes.UPDATE_USER_SUCCESS });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.UPDATE_USER_FAILURE });
  }
}

export default function* watchPersonDetails() {
  yield takeEvery(ActionTypes.UPDATE_USER, updateUser);
}
