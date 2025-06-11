import { takeLatest, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { showGlobalAlert, showGlobalErrorAlert } from '../alert/actions';
import AlertMessages from '../alert/AlertMessages';
import * as ActionTypes from 'actions/action-types';
import * as WorkspaceApi from '../api/workspace-api';
import * as WorkspaceActions from 'actions/workspace-actions';
import { ChangeUserRolePayload, createWorkspacePayload, InvitePersonToWorkspacePayload, InviteUserToWorkspacePayload, RemoveUserFromWorkspacePayload } from '../types/workspace';
import { getWorkspaceUsers as getWorkspaceUsersAction } from '@/app/actions/workspace-actions'

function* handleSagaError(error: any, failureActionType: string) {
  yield put(showGlobalErrorAlert(error?.message));
  yield put({ type: failureActionType, error: error?.message });
}
interface GetWorkspaceProp {
  workspaceIdentifier: string;
}
function* getCurrentWorkspace({
  workspaceIdentifier,
}: GetWorkspaceProp): SagaIterator {
  try {
    const workspace = yield call(
      WorkspaceApi.getWorkspaceByIdentifier,
      workspaceIdentifier,
    );
    yield put({ type: ActionTypes.GET_SELECTED_WORKSPACE_SUCCESS, workspace });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.GET_SELECTED_WORKSPACE_FAILURE });
  }
}

interface UpdateWorkspaceProp {
  workspace: createWorkspacePayload;
}

function* updateCurrentWorkspace({ workspace }: UpdateWorkspaceProp) {
  try {
    yield call(WorkspaceApi.updateWorkspace, workspace);
    yield put(
      WorkspaceActions.getCurrentWorkspace(workspace.workspaceIdentifier),
    );
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

interface GetWorkspaceUsersProp {
  workspaceIdentifier: string;
}

function* getWorkspaceUsers({ 
  workspaceIdentifier 
}: GetWorkspaceUsersProp): SagaIterator {
  try {
    const users = yield call(WorkspaceApi.getWorkspaceUsers, workspaceIdentifier);
    yield put({ type: ActionTypes.GET_WORKSPACE_USERS_SUCCESS, payload: users });
  } catch(error) {
    yield* handleSagaError(error, ActionTypes.GET_WORKSPACE_USERS_FAILURE);
  }
}

function* changeWorkspaceUserRole({ payload }: { payload: ChangeUserRolePayload }): SagaIterator {
  try {
    yield call(WorkspaceApi.changeWorkspaceUserRole, payload);
    yield put({ type: ActionTypes.CHANGE_WORKSPACE_USER_ROLE_SUCCESS, payload });
    yield put(showGlobalAlert(AlertMessages.WORKSPACE_USER_ROLE_CHANGED));
  } catch(error) {
    yield* handleSagaError(error, ActionTypes.CHANGE_WORKSPACE_USER_ROLE_FAILURE);
  }
}

function* inviteUserToWorkspace({ payload }: { payload: InviteUserToWorkspacePayload }): SagaIterator {
  const {
    userIdentifier,
    workspaceIdentifier,
    onDone
  } = payload;

  try {
    yield call(WorkspaceApi.inviteUserToWorkspace, {
      userIdentifier,
      workspaceIdentifier,
    });
    yield put(getWorkspaceUsersAction(workspaceIdentifier));
    yield put(showGlobalAlert(AlertMessages.USER_INVITED_TO_WORKSPACE));
  } catch(error) {
    yield* handleSagaError(error, ActionTypes.INVITE_USER_TO_WORKSPACE_FAILURE);
  } finally {
    if (onDone) {
      yield call(onDone);
    }
  }
}

function* removeUserFromWorkspace({ payload }: { payload: RemoveUserFromWorkspacePayload }): SagaIterator {
  const {
    userIdentifier,
    workspaceIdentifier,
    refreshListUsersAndGroups,
  } = payload;

  try {
    yield call(WorkspaceApi.removeUserFromWorkspace, {
      workspaceIdentifier,
      userIdentifier,
    });

    yield put({
      type: ActionTypes.REMOVE_USER_FROM_WORKSPACE_SUCCESS,
      payload: { userIdentifier },
    });

    yield put(showGlobalAlert(AlertMessages.USER_REMOVED_FROM_WORKSPACE));

    if (refreshListUsersAndGroups) {
      yield call(refreshListUsersAndGroups);
    }
  } catch(error) {
    yield* handleSagaError(error, ActionTypes.REMOVE_USER_FROM_WORKSPACE_FAILURE);
  }
}

function* invitePersonToWorkspaceSaga({ payload }: { payload: InvitePersonToWorkspacePayload }) {
  const { workspaceIdentifier, data, onSuccess, onFailure } = payload;

  try {
    yield call(WorkspaceApi.invitePersonToWorkspace, workspaceIdentifier, data);
    yield put(showGlobalAlert(AlertMessages.PERSON_INVITED_TO_WORKSPACE));
    if (onSuccess) onSuccess();
  } catch (error) {
    yield* handleSagaError(error, ActionTypes.INVITE_PERSON_TO_WORKSPACE_FAILURE);
    if (onFailure) onFailure(error);
  }
}

export default function* watchWorkspaces() {
  // @ts-ignore
  yield takeEvery(ActionTypes.GET_SELECTED_WORKSPACE, getCurrentWorkspace);
  yield takeLatest(
    ActionTypes.UPDATE_SELECTED_WORKSPACE,
    updateCurrentWorkspace,
  );
  yield takeEvery(ActionTypes.GET_WORKSPACE_USERS, getWorkspaceUsers);
  yield takeLatest(ActionTypes.CHANGE_WORKSPACE_USER_ROLE, changeWorkspaceUserRole);
  yield takeLatest(ActionTypes.INVITE_USER_TO_WORKSPACE, inviteUserToWorkspace);
  yield takeLatest(ActionTypes.REMOVE_USER_FROM_WORKSPACE, removeUserFromWorkspace);
  yield takeLatest(ActionTypes.INVITE_PERSON_TO_WORKSPACE, invitePersonToWorkspaceSaga);
}