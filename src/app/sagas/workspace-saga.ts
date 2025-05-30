import { takeLatest, call, put, takeEvery, select } from 'redux-saga/effects';
import { showGlobalAlert, showGlobalErrorAlert } from '../alert/actions';
import AlertMessages from '../alert/AlertMessages';
import * as ActionTypes from 'actions/action-types';
import * as WorkspaceApi from '../api/workspace-api';
import * as WorkspaceActions from 'actions/workspace-actions';
import { createWorkspacePayload } from '../types/workspace';
import { SagaIterator } from 'redux-saga';

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

export default function* watchWorkspaces() {
  // @ts-ignore
  yield takeEvery(ActionTypes.GET_SELECTED_WORKSPACE, getCurrentWorkspace);
  yield takeLatest(
    ActionTypes.UPDATE_SELECTED_WORKSPACE,
    updateCurrentWorkspace,
  );
}
