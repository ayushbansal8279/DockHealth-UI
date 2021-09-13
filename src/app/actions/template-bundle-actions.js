/* eslint-disable import/prefer-default-export */
import * as ActionTypesSaga from 'actions/action-types-saga';
import * as ActionTypes from 'actions/action-types';

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
  completedTasksShown = true,
  incompleteTasksShown = true,
}) {
  return {
    type: ActionTypesSaga.REORDER_TASKS_IN_TEMPLATE_BUNDLE,
    source,
    destination,
    bundle,
    completedTasksShown,
    incompleteTasksShown,
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

export function changePatientForTemplateBundle(
  taskTemplateIdentifier,
  patient,
) {
  return {
    type: ActionTypesSaga.CHANGE_PATIENT_FOR_TEMPLATE_BUNDLE,
    taskTemplateIdentifier,
    patient,
  };
}

export function completeTemplateBundle(bundleIdentifier) {
  return {
    type: ActionTypes.COMPLETE_TEMPLATE_BUNDLE,
    bundleIdentifier,
  };
}
