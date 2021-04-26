/* eslint-disable import/prefer-default-export */
import * as ActionTypesSaga from 'actions/action-types-saga';

export function updateTemplateBundle({ bundle, dataToUpdate }) {
  return {
    type: ActionTypesSaga.UPDATE_TEMPLATE_BUNDLE,
    bundle,
    dataToUpdate,
  };
}

export function reorderSubtasksInTemplateBundle({
  source,
  destination,
  bundle,
  completedTasksShown,
}) {
  return {
    type: ActionTypesSaga.REORDER_TASKS_IN_TEMPLATE_BUNDLE,
    source,
    destination,
    bundle,
    completedTasksShown,
  };
}

export function duplicateTemplateBundle(bundleIdentifier, includeAttachments) {
  return {
    type: ActionTypesSaga.DUPLICATE_TEMPLATE_BUNDLE,
    bundleIdentifier,
    includeAttachments,
  };
}

export function deleteTemplateBundle(bundleIdentifier) {
  return {
    type: ActionTypesSaga.DELETE_TEMPLATE_BUNDLE,
    bundleIdentifier,
  };
}

export function moveTemplateBundle({
  bundleIdentifier,
  taskListIdentifier,
  taskGroupIdentifier,
}) {
  return {
    type: ActionTypesSaga.MOVE_TEMPLATE_BUNDLE,
    bundleIdentifier,
    taskListIdentifier,
    taskGroupIdentifier,
  };
}
