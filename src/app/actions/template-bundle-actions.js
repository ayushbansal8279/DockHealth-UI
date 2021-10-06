import * as ActionTypes from 'actions/action-types';

export function updateTemplateBundle({ bundle, dataToUpdate }) {
  return {
    type: ActionTypes.UPDATE_TEMPLATE_BUNDLE,
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
    type: ActionTypes.REORDER_TASKS_IN_TEMPLATE_BUNDLE,
    source,
    destination,
    bundle,
    completedTasksShown,
    incompleteTasksShown,
  };
}

export function duplicateTemplateBundle(bundleIdentifier, includeAttachments) {
  return {
    type: ActionTypes.DUPLICATE_TEMPLATE_BUNDLE,
    bundleIdentifier,
    includeAttachments,
  };
}

export function deleteTemplateBundle(bundleIdentifier) {
  return {
    type: ActionTypes.DELETE_TEMPLATE_BUNDLE,
    bundleIdentifier,
  };
}

export function moveTemplateBundle({
  bundleIdentifier,
  taskListIdentifier,
  taskGroupIdentifier,
}) {
  return {
    type: ActionTypes.MOVE_TEMPLATE_BUNDLE,
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
    type: ActionTypes.CHANGE_PATIENT_FOR_TEMPLATE_BUNDLE,
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

export function applyTemplate({
  taskTemplateIdentifier,
  taskListIdentifier,
  taskGroupIdentifier,
  patientIdentifier,
}) {
  return {
    type: ActionTypes.APPLY_TEMPLATE,
    taskTemplateIdentifier,
    taskListIdentifier,
    taskGroupIdentifier,
    patientIdentifier,
  };
}
