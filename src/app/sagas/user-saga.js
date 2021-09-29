import { all, put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import * as UserActions from 'actions/user-actions';
import * as OrganizationApi from 'api/organization-api';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as ActionTypes from 'actions/action-types';
import * as UserApi from 'api/user-api';

function* getCurrentUserNotificationPreferences() {
  try {
    const userNotificationPreferences = yield call(
      UserApi.getCurrentUserNotificationPreferences,
    );
    yield put({
      type: ActionTypes.GET_CURRENT_USER_NOTIFICATION_PREFERENCES_SUCCESS,
      userNotificationPreferences,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.GET_CURRENT_USER_NOTIFICATION_PREFERENCES_FAILURE,
    });
  }
}

function* updateCurrentUserPreferences({ preferences }) {
  try {
    yield call(UserApi.updateCurrentUserPreferences, preferences);
    yield put({
      type: ActionTypes.UPDATE_CURRENT_USER_PREFERENCES_SUCCESS,
      preferences,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.UPDATE_CURRENT_USER_PREFERENCES_FAILURE,
    });
  }
}

function* getCurrentUser() {
  try {
    const user = yield call(UserApi.getUserById, sessionStorage.userIdentifier);
    yield put({
      type: ActionTypes.GET_CURRENT_USER_SUCCESS,
      user,
    });
  } catch (error) {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.GET_CURRENT_USER_FAILURE });
  }
}

function* saveUserAvatar(avatarData) {
  const response = yield fetch(avatarData);
  const arrayBuffer = yield response.arrayBuffer();
  yield call(UserApi.saveCurrentUserAvatar, arrayBuffer);
}

function* updateCurrentUser({ userData }) {
  try {
    const { avatar, ...userDataToUpdate } = userData;

    yield all([
      call(UserApi.updateCurrentUser, userDataToUpdate),
      avatar && call(saveUserAvatar, avatar),
      avatar === null && call(UserApi.deleteCurrentUserAvatar),
    ]);

    yield put(showGlobalAlert(AlertMessages.UPDATED));
    yield put({ type: ActionTypes.UPDATE_CURRENT_USER_SUCCESS });
  } catch (error) {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.UPDATE_CURRENT_USER_FAILURE });
  }
}

function* updateCurrentUserSuccess() {
  yield put(UserActions.getCurrentUser());
}

function* getCurrentUserOrganizations() {
  try {
    const organizations = yield call(
      OrganizationApi.getCurrentUserOrganizations,
    );
    yield put({
      type: ActionTypes.GET_CURRENT_USER_ORGANIZATIONS_SUCCESS,
      organizations,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.GET_CURRENT_USER_ORGANIZATIONS_FAILURE });
  }
}

export default function* watchUser() {
  yield takeLatest(
    ActionTypes.GET_CURRENT_USER_NOTIFICATION_PREFERENCES,
    getCurrentUserNotificationPreferences,
  );
  yield takeEvery(
    ActionTypes.UPDATE_CURRENT_USER_PREFERENCES,
    updateCurrentUserPreferences,
  );
  yield takeLatest(ActionTypes.GET_CURRENT_USER, getCurrentUser);
  yield takeLatest(
    ActionTypes.GET_CURRENT_USER_ORGANIZATIONS,
    getCurrentUserOrganizations,
  );
  yield takeEvery(ActionTypes.UPDATE_CURRENT_USER, updateCurrentUser);
  yield takeEvery(
    ActionTypes.UPDATE_CURRENT_USER_SUCCESS,
    updateCurrentUserSuccess,
  );
}
