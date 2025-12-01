import { all, call, put, select, takeEvery, delay } from 'redux-saga/effects';
import pluck from 'ramda/src/pluck';
import * as TemplateBundleApi from 'api/template-bundle-api';
import { reorderTasksForWorkflow } from 'helpers/workflow-helpers';
import * as WorkflowApi from 'api/workflow-api';
import { userProfileSelector } from 'selectors/user-selectors';
import * as ActionTypes from 'actions/action-types';
import * as WorkflowActions from 'actions/workflow-actions';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { multipleTaskDetailsSelector } from '../selectors/list-details-selectors';
import { patientMultipleTaskDetailsSelector } from '../selectors/patient-details-selectors';
import {
  isWorkflowDrawerOpenSelector,
  workflowIdentifierSelector,
} from '../selectors/workflow-drawer-selectors';
import * as WorkflowDrawerActions from 'actions/workflow-drawer-actions';
import { TaskStatus } from '../helpers/task-helpers';
import * as TemplateBundleActions from 'actions/template-bundle-actions';
import { TASK_DISAPPEAR_DELAY } from '../helpers/task-update-helper';
import { userPreferenceStatusSelector } from '../selectors/user-preference-selectors';

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

function* suspendWorkflow({ taskWorkflowIdentifier }) {
  try {
    yield call(WorkflowApi.suspendWorkflow, taskWorkflowIdentifier);
    yield put({
      type: ActionTypes.SUSPEND_WORKFLOW_SUCCESS,
      taskWorkflowIdentifier,
    });
    yield put(showGlobalAlert(AlertMessages.WORKFLOW_SUSPENDED));

    const workflow = yield call(
      TemplateBundleApi.getTemplateBundle,
      taskWorkflowIdentifier,
    );

    const currentTasksStatus = yield select(userPreferenceStatusSelector);

    if (currentTasksStatus === TaskStatus.INCOMPLETE) {
      yield delay(TASK_DISAPPEAR_DELAY);
      yield put(
        TemplateBundleActions.completeTemplateBundle(taskWorkflowIdentifier),
      );
    } else {
      yield put({
        type: ActionTypes.UPDATE_TEMPLATE_BUNDLE_SUCCESS,
        bundleIdentifier: taskWorkflowIdentifier,
        dataToUpdate: workflow,
      });
    }

    const isWorkflowDrawerOpen = yield select(isWorkflowDrawerOpenSelector);
    if (isWorkflowDrawerOpen) {
      const currentWorkflowIdentifier = yield select(
        workflowIdentifierSelector,
      );
      if (currentWorkflowIdentifier === taskWorkflowIdentifier) {
        yield put(WorkflowDrawerActions.getDrawerWorkflowDetails());
      }
    }
  } catch {
    yield all([
      put({
        type: ActionTypes.SUSPEND_WORKFLOW_FAILURE,
        taskWorkflowIdentifier,
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

function* updateWorkflowAttachment({
  taskWorkflowIdentifier,
  attachmentIdentifier,
  fileName,
}) {
  try {
    yield call(WorkflowApi.updateWorkflowAttachment, {
      taskWorkflowIdentifier,
      attachmentIdentifier,
      fileName,
    });
    yield all([
      put(showGlobalAlert(AlertMessages.UPDATED)),
      put(
        WorkflowActions.updateWorkflowAttachmentSuccess(
          taskWorkflowIdentifier,
          attachmentIdentifier,
          fileName,
        ),
      ),
    ]);
  } catch {
    yield all([
      put(showGlobalErrorAlert()),
      put(
        WorkflowActions.updateWorkflowAttachmentFailure(
          taskWorkflowIdentifier,
          attachmentIdentifier,
          fileName,
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
    const isWorkflowDrawerOpen = yield select(isWorkflowDrawerOpenSelector);
    let tasks;
    if (isWorkflowDrawerOpen) {
      tasks = workflow.tasks;
    } else {
      tasks = yield select((state) => {
        const result = multipleTaskDetailsSelector(state, workflow?.tasks);
        return result?.some((task) => task === undefined)
          ? patientMultipleTaskDetailsSelector(state, workflow?.tasks)
          : result;
      });
    }

    const reorderedTasks = reorderTasksForWorkflow(
      sourceIndex,
      destinationIndex,
      incompleteTasksShown,
      completedTasksShown,
      tasks,
    );

    yield call(
      TemplateBundleApi.reorderTasksInBundle,
      workflow.identifier,
      // pluck('identifier', reorderedTasks),
      reorderedTasks,
    );
    yield all([
      // put({
      //   type: ActionTypes.REORDER_WORKFLOW_TASKS_SUCCESS,
      // }),
      put({
        // type: ActionTypes.REFRESH_TASK_BUNDLE,
        // templateBundleIdentifier: workflow.identifier,
        type: ActionTypes.GET_TASKS_FOR_WORKFLOW,
        workflowIdentifier: workflow.identifier,
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
  yield takeEvery(ActionTypes.SUSPEND_WORKFLOW, suspendWorkflow);
  yield takeEvery(ActionTypes.ADD_WORKFLOW_COMMENT, addWorkflowComment);
  yield takeEvery(ActionTypes.UPDATE_WORKFLOW_COMMENT, updateWorkflowComment);
  yield takeEvery(ActionTypes.DELETE_WORKFLOW_COMMENT, deleteWorkflowComment);
  yield takeEvery(
    ActionTypes.DELETE_WORKFLOW_ATTACHMENT,
    deleteWorkflowAttachment,
  );
  yield takeEvery(ActionTypes.REORDER_WORKFLOW_TASKS, reorderWorkflowTasks);
  yield takeEvery(
    ActionTypes.UPDATE_WORKFLOW_ATTACHMENT,
    updateWorkflowAttachment,
  );
}
