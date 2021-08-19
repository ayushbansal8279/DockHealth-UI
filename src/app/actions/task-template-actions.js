/* eslint-disable import/prefer-default-export */
import * as ActionTypesSaga from './action-types-saga';
import * as ActionTypes from './action-types';

export function addTemplate(template) {
  return {
    type: ActionTypesSaga.ADD_TASK_TEMPLATE,
    template,
  };
}

export function deleteTemplate(taskTemplateIdentifier) {
  return {
    type: ActionTypesSaga.DELETE_TASK_TEMPLATE,
    taskTemplateIdentifier,
  };
}

export function duplicateTemplate(taskTemplateIdentifier, includeAttachments) {
  return {
    type: ActionTypesSaga.DUPLICATE_TASK_TEMPLATE,
    taskTemplateIdentifier,
    includeAttachments,
  };
}

export function updateTemplate(taskTemplateIdentifier, dataToUpdate) {
  return {
    type: ActionTypesSaga.UPDATE_TASK_TEMPLATE,
    taskTemplateIdentifier,
    dataToUpdate,
  };
}

export function getTemplates() {
  return {
    type: ActionTypesSaga.GET_TASK_TEMPLATES,
  };
}

export function getTemplateTasks(taskTemplateIdentifier, withLoader = true) {
  return {
    type: ActionTypes.GET_TASK_TEMPLATE_TASKS,
    taskTemplateIdentifier,
    withLoader,
  };
}

export function toggleTemplateOpen(taskTemplateIdentifier) {
  return {
    type: ActionTypesSaga.TOGGLE_TASK_TEMPLATE_OPEN,
    taskTemplateIdentifier,
  };
}

export function reorderTasksForTemplate({
  taskTemplateIdentifier,
  source,
  destination,
}) {
  return {
    type: ActionTypesSaga.REORDER_TASKS_FOR_TEMPLATE,
    taskTemplateIdentifier,
    source,
    destination,
  };
}

export function addTaskToTemplate(task, elementId, position) {
  return {
    type: ActionTypes.ADD_TASK_TO_TEMPLATE,
    task,
    elementId,
    position,
  };
}

export function reloadOpenedTemplateTasks() {
  return { type: ActionTypesSaga.RELOAD_OPENED_TEMPLATE_TASKS };
}

export function selectTaskTemplate(taskTemplateIdentifier) {
  return {
    type: ActionTypes.SELECT_TASK_TEMPLATE,
    taskTemplateIdentifier,
  };
}

export function unselectTaskTemplate() {
  return {
    type: ActionTypes.UNSELECT_TASK_TEMPLATE,
  };
}

export function saveTaskTemplateLayout(layout) {
  return {
    type: ActionTypes.SAVE_TASK_TEMPLATE_LAYOUT,
    layout,
  };
}

export function addNewTaskElement() {
  return {
    type: ActionTypes.ADD_NEW_TASK_ELEMENT,
  };
}

export function addNewDecisionTaskElement() {
  return {
    type: ActionTypes.ADD_NEW_DECISION_TASK_ELEMENT,
  };
}

export function deleteNewTaskElement(elementId) {
  return {
    type: ActionTypes.DELETE_NEW_TASK_ELEMENT,
    elementId,
  };
}

export function updateTaskPositionInLayout(taskIdentifier, position) {
  return {
    type: ActionTypes.UPDATE_TASK_POSITION_IN_LAYOUT,
    taskIdentifier,
    position,
  };
}

export function linkTasks(source, target, isDependent = false) {
  return {
    type: ActionTypes.LINK_TASKS,
    source,
    target,
    isDependent,
  };
}

export function addTaskOutcome(outcomeName, taskIdentifier, link = null) {
  return {
    type: ActionTypes.ADD_TASK_OUTCOME,
    outcomeName,
    taskIdentifier,
    link,
  };
}

export function updateTaskOutcome(
  taskOutcomeIdentifier,
  taskIdentifier,
  outcomeName,
) {
  return {
    type: ActionTypes.UPDATE_TASK_OUTCOME,
    taskOutcomeIdentifier,
    taskIdentifier,
    outcomeName,
  };
}

export function updateTasksLink(link) {
  return {
    type: ActionTypes.UPDATE_TASKS_LINK,
    link,
  };
}

export function deleteTasksLink(sourceTaskIdentifier, targetTaskIdentifier) {
  return {
    type: ActionTypes.DELETE_TASKS_LINK,
    sourceTaskIdentifier,
    targetTaskIdentifier,
  };
}
