import * as ActionTypes from 'actions/action-types';

export function duplicateWorkflow(identifier, includeAttachments) {
  return {
    type: ActionTypes.DUPLICATE_WORKFLOW,
    identifier,
    includeAttachments,
  };
}

export function deleteWorkflow(identifier) {
  return {
    type: ActionTypes.DELETE_WORKFLOW,
    identifier,
  };
}

export function suspendWorkflow(taskWorkflowIdentifier) {
  return {
    type: ActionTypes.SUSPEND_WORKFLOW,
    taskWorkflowIdentifier,
  };
}

export function addWorkflowComment(workflowIdentifier, commentText) {
  return {
    type: ActionTypes.ADD_WORKFLOW_COMMENT,
    workflowIdentifier,
    commentText,
  };
}

export function addWorkflowCommentSuccess(workflowIdentifier, comment) {
  return {
    type: ActionTypes.ADD_WORKFLOW_COMMENT_SUCCESS,
    workflowIdentifier,
    comment,
  };
}

export function addWorkflowCommentFailure(workflowIdentifier) {
  return {
    type: ActionTypes.ADD_WORKFLOW_COMMENT_FAILURE,
    workflowIdentifier,
  };
}

export function updateWorkflowComment(
  workflowIdentifier,
  commentIdentifier,
  commentText,
) {
  return {
    type: ActionTypes.UPDATE_WORKFLOW_COMMENT,
    workflowIdentifier,
    commentIdentifier,
    commentText,
  };
}

export function updateWorkflowCommentSuccess(
  workflowIdentifier,
  commentIdentifier,
  comment,
) {
  return {
    type: ActionTypes.UPDATE_WORKFLOW_COMMENT_SUCCESS,
    workflowIdentifier,
    commentIdentifier,
    comment,
  };
}

export function updateWorkflowCommentFailure(
  workflowIdentifier,
  commentIdentifier,
) {
  return {
    type: ActionTypes.UPDATE_WORKFLOW_COMMENT_FAILURE,
    workflowIdentifier,
    commentIdentifier,
  };
}

export function deleteWorkflowComment(workflowIdentifier, commentIdentifier) {
  return {
    type: ActionTypes.DELETE_WORKFLOW_COMMENT,
    workflowIdentifier,
    commentIdentifier,
  };
}

export function deleteWorkflowCommentSuccess(
  workflowIdentifier,
  commentIdentifier,
) {
  return {
    type: ActionTypes.DELETE_WORKFLOW_COMMENT_SUCCESS,
    workflowIdentifier,
    commentIdentifier,
  };
}

export function deleteWorkflowCommentFailure(
  workflowIdentifier,
  commentIdentifier,
) {
  return {
    type: ActionTypes.DELETE_WORKFLOW_COMMENT_FAILURE,
    workflowIdentifier,
    commentIdentifier,
  };
}

export function addWorkflowAttachmentSuccess(workflowIdentifier, attachment) {
  return {
    type: ActionTypes.ADD_WORKFLOW_ATTACHMENT_SUCCESS,
    workflowIdentifier,
    attachment,
  };
}

export function updateWorkflowAttachment(
  taskWorkflowIdentifier,
  attachmentIdentifier,
  fileName
) {
  return {
    type: ActionTypes.UPDATE_WORKFLOW_ATTACHMENT,
    taskWorkflowIdentifier,
    attachmentIdentifier,
    fileName
  };
}

export function updateWorkflowAttachmentSuccess(
  taskWorkflowIdentifier,
  attachmentIdentifier,
  fileName
) {
  return {
    type: ActionTypes.UPDATE_WORKFLOW_ATTACHMENT_SUCCESS,
    taskWorkflowIdentifier,
    attachmentIdentifier,
    fileName
  };
}

export function updateWorkflowAttachmentFailure(
  taskWorkflowIdentifier,
  attachmentIdentifier,
  fileName
) {
  return {
    type: ActionTypes.UPDATE_WORKFLOW_ATTACHMENT_FAILURE,
    taskWorkflowIdentifier,
    attachmentIdentifier,
    fileName
  };
}

export function deleteWorkflowAttachment(
  workflowIdentifier,
  attachmentIdentifier,
) {
  return {
    type: ActionTypes.DELETE_WORKFLOW_ATTACHMENT,
    workflowIdentifier,
    attachmentIdentifier,
  };
}

export function deleteWorkflowAttachmentSuccess(
  workflowIdentifier,
  attachmentIdentifier,
) {
  return {
    type: ActionTypes.DELETE_WORKFLOW_ATTACHMENT_SUCCESS,
    workflowIdentifier,
    attachmentIdentifier,
  };
}

export function deleteWorkflowAttachmentFailure(
  workflowIdentifier,
  attachmentIdentifier,
) {
  return {
    type: ActionTypes.DELETE_WORKFLOW_ATTACHMENT_FAILURE,
    workflowIdentifier,
    attachmentIdentifier,
  };
}

export function reorderWorkflowTasks({
  source,
  destination,
  workflow,
  completedTasksShown = true,
  incompleteTasksShown = true,
}) {
  return {
    type: ActionTypes.REORDER_WORKFLOW_TASKS,
    source,
    destination,
    workflow,
    completedTasksShown,
    incompleteTasksShown,
  };
}
