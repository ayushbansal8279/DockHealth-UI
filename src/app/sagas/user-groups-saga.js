import { all, put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import { showGlobalErrorAlert, showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as ActionTypes from 'actions/action-types';
import * as UserGroupsActions from 'actions/user-groups-actions';
import * as UserGroupsApi from 'api/user-groups-api';

function* setCurrentUserGroup({ groupIdentifier }) {
  try {
    yield put(UserGroupsActions.getUserGroupDetails(groupIdentifier));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* getUserGroups() {
  try {
    const groups = yield call(UserGroupsApi.getAllUserGroups);
    yield put(UserGroupsActions.getUserGroupsSuccess(groups));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put(UserGroupsActions.getUserGroupsFailure());
  }
}

function* getUserGroupDetails({ groupIdentifier }) {
  try {
    const userGroupDetails = yield call(
      UserGroupsApi.getUserGroupDetails,
      groupIdentifier,
    );
    yield put(
      UserGroupsActions.getUserGroupDetailsSuccess(
        groupIdentifier,
        userGroupDetails,
      ),
    );
  } catch {
    yield put(showGlobalErrorAlert());
    yield put(UserGroupsActions.getUserGroupDetailsFailure(groupIdentifier));
  }
}

function* saveUserGroupAvatar(userGroupIdentifier, avatarData) {
  const response = yield fetch(avatarData);
  const arrayBuffer = yield response.arrayBuffer();
  yield call(
    UserGroupsApi.createUserGroupAvatar,
    userGroupIdentifier,
    arrayBuffer,
  );
}

function* createUserGroup({ userGroup, onSuccessCallback }) {
  try {
    const createUserGroupData = { ...userGroup };
    delete createUserGroupData.avatar;

    let createdUserGroup = yield call(
      UserGroupsApi.createUserGroup,
      createUserGroupData,
    );

    if (userGroup.avatar) {
      yield saveUserGroupAvatar(createdUserGroup.identifier, userGroup.avatar);
      createdUserGroup = yield call(
        UserGroupsApi.getUserGroupDetails,
        createdUserGroup.identifier,
      );
    }

    onSuccessCallback(createdUserGroup.identifier);
    yield put(UserGroupsActions.createUserGroupSuccess(createdUserGroup));
    yield put(showGlobalAlert(AlertMessages.CREATED));
  } catch (error) {
    yield put(showGlobalErrorAlert());
    yield put(UserGroupsActions.createUserGroupFailure());
  }
}

function* updateUserGroup({ userGroupIdentifier, userGroupData }) {
  try {
    const { avatar, ...userGroupDataToUpdate } = userGroupData;

    yield all([
      call(
        UserGroupsApi.updateUserGroup,
        userGroupIdentifier,
        userGroupDataToUpdate,
      ),
      avatar && call(saveUserGroupAvatar, userGroupIdentifier, avatar),
      avatar === null &&
        call(UserGroupsApi.deleteUserGroupAvatar, userGroupIdentifier),
    ]);

    const userGroupAfterUpdate = yield call(
      UserGroupsApi.getUserGroupDetails,
      userGroupIdentifier,
    );

    yield put(showGlobalAlert(AlertMessages.UPDATED));
    yield put(
      UserGroupsActions.updateUserGroupSuccess(
        userGroupIdentifier,
        userGroupAfterUpdate,
      ),
    );
  } catch {
    yield put(showGlobalErrorAlert());
    yield put(UserGroupsActions.updateUserGroupFailure(userGroupIdentifier));
  }
}

function* updateUsersInGroup({ userGroupIdentifier, userIdentifiers }) {
  try {
    const updatedGroup = yield call(
      UserGroupsApi.updateUserGroup,
      userGroupIdentifier,
      { userIdentifiers },
    );
    yield put(showGlobalAlert(AlertMessages.UPDATED));
    yield put(
      UserGroupsActions.updateUsersInGroupSuccess(
        userGroupIdentifier,
        updatedGroup.users,
      ),
    );
  } catch {
    yield put(showGlobalErrorAlert());
    yield put(UserGroupsActions.updateUsersInGroupFailure(userGroupIdentifier));
  }
}

function* deleteUserGroup({ userGroupIdentifier }) {
  try {
    yield call(UserGroupsApi.deleteUserGroup, userGroupIdentifier);
    yield put(showGlobalAlert(AlertMessages.DELETED));
    yield put(UserGroupsActions.deleteUserGroupSuccess(userGroupIdentifier));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put(UserGroupsActions.deleteUserGroupFailure(userGroupIdentifier));
  }
}

function* deleteUserGroupFailure() {
  yield put(UserGroupsActions.getUserGroups());
}

export default function* watchUserGroups() {
  yield takeLatest(ActionTypes.GET_USER_GROUPS, getUserGroups);
  yield takeLatest(ActionTypes.SET_CURRENT_USER_GROUP, setCurrentUserGroup);
  yield takeEvery(ActionTypes.GET_USER_GROUP_DETAILS, getUserGroupDetails);
  yield takeEvery(ActionTypes.CREATE_USER_GROUP, createUserGroup);
  yield takeEvery(ActionTypes.UPDATE_USER_GROUP, updateUserGroup);
  yield takeEvery(ActionTypes.DELETE_USER_GROUP, deleteUserGroup);
  yield takeEvery(ActionTypes.UPDATE_USERS_IN_GROUP, updateUsersInGroup);
  yield takeEvery(
    ActionTypes.DELETE_USER_GROUP_FAILURE,
    deleteUserGroupFailure,
  );
}
