// @ts-nocheck
import { takeLatest, call, put, takeEvery, select } from 'redux-saga/effects';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as ActionTypes from 'actions/action-types';
import * as WorkspaceApi from 'api/workspace-api';
import { Workspace } from '../types/workspace';

function* getCurrentWorkspace({ workspaceIdentifier }) {
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

export default function* watchWorkspaces() {
  yield takeEvery(ActionTypes.GET_SELECTED_WORKSPACE, getCurrentWorkspace);
}
