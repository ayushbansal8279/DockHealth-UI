import { put, takeLatest, select, call, all } from 'redux-saga/effects';
import { showGlobalErrorAlert, showGlobalAlert } from 'alert/actions';
import * as ActionTypes from 'actions/action-types';
import * as WorkflowDrawerActions from 'actions/workflow-drawer-actions';
import {
  isWorkflowDrawerOpenSelector,
  workflowIdentifierSelector,
} from 'selectors/workflow-drawer-selectors';
import * as WorkflowApi from 'api/workflow-api';
import * as TaskTemplateApi from 'api/task-template-api';
import AlertMessages from '../alert/AlertMessages';

function* openDrawer() {
  yield put(WorkflowDrawerActions.getDrawerWorkflowDetails());
}

function* getWorkflowDrawerDetails() {
  try {
    const identifier = yield select(workflowIdentifierSelector);
    const workflow = yield call(TaskTemplateApi.getTemplate, identifier);
    yield put(WorkflowDrawerActions.getDrawerWorkflowDetailsSuccess(workflow));
  } catch {
    yield put(showGlobalErrorAlert());
    yield put(WorkflowDrawerActions.getDrawerWorkflowDetailsFailure());
  }
}

function* getHistory() {
  try {
    const identifier = yield select(workflowIdentifierSelector);
    const history = yield call(WorkflowApi.getWorkflowHistory, identifier);
    yield put(WorkflowDrawerActions.getHistorySuccess(history));
  } catch {
    yield all([
      put(showGlobalErrorAlert()),
      put(WorkflowDrawerActions.getHistoryFailure()),
    ]);
  }
}

function* closeDrawerIfOpen() {
  const isOpen = yield select(isWorkflowDrawerOpenSelector);

  if (isOpen) {
    yield put(WorkflowDrawerActions.closeDrawer());
  }
}

function* getLabels({ taskListIdentifier }) {
  try {
    const labels = yield call(TaskTemplateApi.getLabels, {
      taskListIdentifier,
    });
    yield put(WorkflowDrawerActions.getLabelsSuccess(labels));
  } catch {
    yield all([
      put(showGlobalErrorAlert()),
      put(WorkflowDrawerActions.getLabelsFailure()),
    ]);
  }
}

export default function* watchWorkflowDrawer() {
  yield takeLatest(ActionTypes.OPEN_WORKFLOW_DRAWER, openDrawer);
  yield takeLatest(
    ActionTypes.GET_WORKFLOW_DRAWER_DETAILS,
    getWorkflowDrawerDetails,
  );
  yield takeLatest(ActionTypes.GET_WORKFLOW_DRAWER_HISTORY, getHistory);
  yield takeLatest(
    [
      ActionTypes.DUPLICATE_WORKFLOW_SUCCESS,
      ActionTypes.DELETE_WORKFLOW_SUCCESS,
    ],
    closeDrawerIfOpen,
  );
  yield takeLatest(ActionTypes.GET_WORKFLOW_DRAWER_LABELS, getLabels);
}
