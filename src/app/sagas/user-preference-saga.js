import { all, put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as ActionTypes from 'actions/action-types';
import * as UserPreferenceApi from 'api/user-preference-api';

function* getUserPreferences({ contextType, contextIdentifier }) {
  try {
    const preferences = yield call(
      UserPreferenceApi.getUserPreference,
      contextType,
      contextIdentifier,
    );
    yield put({
      type: ActionTypes.GET_USER_PREFERENCES_SUCCESS,
      preferences,
    });
  } catch (error) {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.GET_USER_PREFERENCES_FAILURE,
    });
  }
}

function* updateUserPreferences({
  contextType,
  contextIdentifier,
  partialDetails,
}) {
  try {
    const preferences = yield call(
      UserPreferenceApi.updateUserPreference,
      contextType,
      contextIdentifier,
      partialDetails,
    );
    yield put({
      type: ActionTypes.UPDATE_USER_PREFERENCES_SUCCESS,
      preferences,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.UPDATE_USER_PREFERENCES_FAILURE,
    });
  }
}

function* updateTaskListStatus({ contextType, contextIdentifier, status }) {
  yield* updateUserPreferences({
    contextType,
    contextIdentifier,
    partialDetails: { status },
  });
}

export default function* watchUserPreferences() {
  yield all([
    takeEvery(ActionTypes.GET_USER_PREFERENCES, getUserPreferences),
    takeEvery(ActionTypes.UPDATE_USER_PREFERENCES, updateUserPreferences),
    takeEvery(ActionTypes.UPDATE_TASK_LIST_STATUS, updateTaskListStatus),
  ]);
}
