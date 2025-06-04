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

export function applyTemplate({ unassign = false, ...template }) {
  return {
    type: ActionTypes.APPLY_TEMPLATE,
    template,
    unassign,
  };
}

export function getTasksForWorkflow(workflowIdentifier, status) {
  return {
    type: ActionTypes.GET_TASKS_FOR_WORKFLOW,
    workflowIdentifier,
    status,
  };
}

export function showhideCompletedTasks(workflowIdentifier, showFlag) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.WORKFLOW_SHOWHIDE_COMPLETED_TASKS,
      workflowIdentifier,
      showFlag,
    });
  };
}

export function showhideIncompleteTasks(workflowIdentifier, showFlag) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.WORKFLOW_SHOWHIDE_INCOMPLETE_TASKS,
      workflowIdentifier,
      showFlag,
    });
  };
}
