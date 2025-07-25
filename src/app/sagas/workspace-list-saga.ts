import { call, put, takeEvery } from 'redux-saga/effects';

import { showGlobalAlert, showGlobalErrorAlert } from '../alert/actions';
import * as ActionTypes from 'actions/action-types';
import * as WorkspaceListApi from '../api/workspace-list-api';
import AlertMessages from '../alert/AlertMessages';

function* getAllUserWorkspacesSaga(): any {
  try {
    yield put({ type: ActionTypes.GET_ALL_USER_WORKSPACES_REQUEST });
    const workspaces = yield call(WorkspaceListApi.getAllUserWorkspaces);
    yield put({ type: ActionTypes.GET_ALL_USER_WORKSPACES_SUCCESS, workspaces });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.GET_ALL_USER_WORKSPACES_FAILURE });
  }
}

function* updateWorkspaceSaga(action: any): any {
  try {
    yield put({ type: ActionTypes.UPDATE_WORKSPACE_REQUEST });
    const updated = yield call(WorkspaceListApi.updateWorkspace, action.payload);
    yield put({
      type: ActionTypes.UPDATE_WORKSPACE_SUCCESS,
      payload: updated,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.UPDATE_WORKSPACE_FAILURE });
  }
}

function* deleteWorkspaceSaga(action: any): any {
  try {
    yield put({ type: ActionTypes.DELETE_WORKSPACE_REQUEST });
    yield call(WorkspaceListApi.removeWorkspace, action.workspaceIdentifier);
    yield put({
      type: ActionTypes.DELETE_WORKSPACE_SUCCESS,
      workspaceIdentifier: action.workspaceIdentifier,
    });
    yield put(showGlobalAlert(AlertMessages.DELETED));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.DELETE_WORKSPACE_FAILURE });
  }
}

export default function* watchWorkspaceList() {
  yield takeEvery(ActionTypes.GET_ALL_USER_WORKSPACES, getAllUserWorkspacesSaga);
  yield takeEvery(ActionTypes.UPDATE_WORKSPACE, updateWorkspaceSaga);
  yield takeEvery(ActionTypes.DELETE_WORKSPACE, deleteWorkspaceSaga);
}