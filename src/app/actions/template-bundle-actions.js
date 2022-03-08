import * as ActionTypes from 'actions/action-types';

export function updateTemplateBundle({ bundle, dataToUpdate }) {
  return {
    type: ActionTypes.UPDATE_TEMPLATE_BUNDLE,
    bundle,
    dataToUpdate,
  };
}

export function moveWorkflowToList(
  identifier,
  taskListIdentifier,
  taskGroupIdentifier,
) {
  return {
    type: ActionTypes.MOVE_WORKFLOW_TO_DIFFERENT_LIST,
    identifier,
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
  unassign = false,
}) {
  return {
    type: ActionTypes.APPLY_TEMPLATE,
    taskTemplateIdentifier,
    taskListIdentifier,
    taskGroupIdentifier,
    patientIdentifier,
    options: {
      unassign,
    },
  };
}

export function getTasksForWorkflow(workflowIdentifier) {
  return {
    type: ActionTypes.GET_TASKS_FOR_WORKFLOW,
    workflowIdentifier,
  };
}
