import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import pluck from 'ramda/src/pluck';
import * as TemplateBundleApi from 'api/template-bundle-api';
import { reorderTasksForWorkflow } from 'helpers/workflow-helpers';
import * as WorkflowApi from 'api/workflow-api';
import { userProfileSelector } from 'selectors/user-selectors';
import * as ActionTypes from 'actions/action-types';
import * as WorkflowActions from 'actions/workflow-actions';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';

function* duplicateWorkflow({ identifier, includeAttachments }) {
  try {
    const workflow = yield call(
      WorkflowApi.duplicateWorkflow,
      identifier,
      includeAttachments,
    );
    yield put({ type: ActionTypes.DUPLICATE_WORKFLOW_SUCCESS, workflow });
    yield put(showGlobalAlert(AlertMessages.CREATED));
  } catch {
    yield all([
      put({ type: ActionTypes.DUPLICATE_WORKFLOW_FAILURE, identifier }),
      put(showGlobalErrorAlert()),
    ]);
  }
}

function* deleteWorkflow({ identifier }) {
  try {
    yield call(WorkflowApi.deleteWorkflow, identifier);
    yield put({
      type: ActionTypes.DELETE_WORKFLOW_SUCCESS,
      identifier,
    });
    yield put(showGlobalAlert(AlertMessages.DELETED));
  } catch {
    yield all([
      put({
        type: ActionTypes.DELETE_WORKFLOW_FAILURE,
        identifier,
      }),
      put(showGlobalErrorAlert()),
    ]);
  }
}

function* addWorkflowComment({ workflowIdentifier, commentText }) {
  try {
    const currentUser = yield select(userProfileSelector);
    const createdComment = yield call(
      WorkflowApi.addWorkflowComment,
      workflowIdentifier,
      {
        comment: commentText,
        creator: currentUser,
      },
    );

    yield all([
      put(showGlobalAlert(AlertMessages.CREATED)),
      put(
        WorkflowActions.addWorkflowCommentSuccess(
          workflowIdentifier,
          createdComment,
        ),
      ),
    ]);
  } catch {
    yield all([
      put(showGlobalErrorAlert()),
      put(WorkflowActions.addWorkflowCommentFailure(workflowIdentifier)),
    ]);
  }
}

function* updateWorkflowComment({
  workflowIdentifier,
  commentIdentifier,
  commentText,
}) {
  try {
    const updatedComment = yield call(
      WorkflowApi.updateWorkflowComment,
      commentIdentifier,
      commentText,
    );

    yield all([
      put(showGlobalAlert(AlertMessages.UPDATED)),
      put(
        WorkflowActions.updateWorkflowCommentSuccess(
          workflowIdentifier,
          commentIdentifier,
          updatedComment,
        ),
      ),
    ]);
  } catch {
    yield all([
      put(showGlobalErrorAlert()),
      put(
        WorkflowActions.updateWorkflowCommentFailure(
          workflowIdentifier,
          commentIdentifier,
        ),
      ),
    ]);
  }
}

function* deleteWorkflowComment({ workflowIdentifier, commentIdentifier }) {
  try {
    yield call(WorkflowApi.deleteWorkflowComment, commentIdentifier);

    yield all([
      put(showGlobalAlert(AlertMessages.DELETED)),
      put(
        WorkflowActions.deleteWorkflowCommentSuccess(
          workflowIdentifier,
          commentIdentifier,
        ),
      ),
    ]);
  } catch {
    yield all([
      put(showGlobalErrorAlert()),
      put(
        WorkflowActions.deleteWorkflowCommentFailure(
          workflowIdentifier,
          commentIdentifier,
        ),
      ),
    ]);
  }
}

function* deleteWorkflowAttachment({
  workflowIdentifier,
  attachmentIdentifier,
}) {
  try {
    yield call(WorkflowApi.deleteWorkflowAttachment, attachmentIdentifier);

    yield all([
      put(showGlobalAlert(AlertMessages.DELETED)),
      put(
        WorkflowActions.deleteWorkflowAttachmentSuccess(
          workflowIdentifier,
          attachmentIdentifier,
        ),
      ),
    ]);
  } catch {
    yield all([
      put(showGlobalErrorAlert()),
      put(
        WorkflowActions.deleteWorkflowAttachmentFailure(
          workflowIdentifier,
          attachmentIdentifier,
        ),
      ),
    ]);
  }
}

function* reorderWorkflowTasks(payload) {
  const {
    source: { index: sourceIndex },
    destination: { index: destinationIndex },
    workflow,
    completedTasksShown,
    incompleteTasksShown,
  } = payload;

  try {
    const reorderedTasks = reorderTasksForWorkflow(
      sourceIndex,
      destinationIndex,
      incompleteTasksShown,
      completedTasksShown,
      workflow.tasks,
    );

    yield call(
      TemplateBundleApi.reorderTasksInBundle,
      workflow.identifier,
      pluck('identifier', reorderedTasks),
    );
    yield all([
      put({
        type: ActionTypes.REORDER_WORKFLOW_TASKS_SUCCESS,
      }),
      put(showGlobalAlert(AlertMessages.UPDATED)),
    ]);
  } catch {
    yield all([
      put(showGlobalErrorAlert()),
      put({
        type: ActionTypes.REORDER_WORKFLOW_TASKS_FAILURE,
        workflow,
      }),
    ]);
  }
}

export default function* watchWorkflow() {
  yield takeEvery(ActionTypes.DUPLICATE_WORKFLOW, duplicateWorkflow);
  yield takeEvery(ActionTypes.DELETE_WORKFLOW, deleteWorkflow);
  yield takeEvery(ActionTypes.ADD_WORKFLOW_COMMENT, addWorkflowComment);
  yield takeEvery(ActionTypes.UPDATE_WORKFLOW_COMMENT, updateWorkflowComment);
  yield takeEvery(ActionTypes.DELETE_WORKFLOW_COMMENT, deleteWorkflowComment);
  yield takeEvery(
    ActionTypes.DELETE_WORKFLOW_ATTACHMENT,
    deleteWorkflowAttachment,
  );
  yield takeEvery(ActionTypes.REORDER_WORKFLOW_TASKS, reorderWorkflowTasks);
}
