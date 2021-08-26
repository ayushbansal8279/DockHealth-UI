/* eslint-disable import/prefer-default-export */
import * as ActionTypes from 'actions/action-types';
import * as ActionTypesSaga from './action-types-saga';

export function moveTemplate({
  parentTaskTemplateIdentifier,
  taskTemplateIdentifier,
}) {
  return {
    type: ActionTypesSaga.MOVE_TASK_TEMPLATE,
    payload: {
      parentTaskTemplateIdentifier,
      taskTemplateIdentifier,
    },
  };
}

export function addTemplate(template) {
  return {
    type: ActionTypesSaga.ADD_TASK_TEMPLATE,
    template: { ...template, type: 'WORKFLOW' },
  };
}

export function pushToBreadcrumbs(
  taskTemplateFolder,
  taskTemplateFolderIdentifier,
) {
  return {
    type: ActionTypes.PUSH_TO_TEMPLATES_BREADCRUMBS,
    payload: {
      breadcrumb: { name: taskTemplateFolder, taskTemplateFolderIdentifier },
    },
  };
}

export function cleanAndPushToBreadcrumbs(breadcrumbs) {
  return {
    type: ActionTypes.CLEAN_AND_PUSH_TEMPLATES_BREADCRUMBS,
    payload: { breadcrumbs },
  };
}

export function cleanBreadcrumbs() {
  return {
    type: ActionTypes.CLEAN_TEMPLATES_BREADCRUMBS,
  };
}

export function addTemplateFolder(template, parentIdentifier = null) {
  return {
    type: ActionTypesSaga.ADD_TASK_TEMPLATE_FOLDER,
    template: { ...template, parentIdentifier, type: 'FOLDER' },
  };
}

export function goToTaskTemplateFolder(taskTemplateFolderIdentifier = null) {
  return {
    type: ActionTypesSaga.GO_TO_TASK_TEMPLATE_FOLDER,
    payload: { taskTemplateFolderIdentifier },
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

export function getAllTemplatesForOrganization(searchPhrase = null) {
  return {
    type: ActionTypesSaga.GET_ALL_TASK_TEMPLATES,
    searchPhrase,
  };
}

export function getTemplates(searchPhrase = null) {
  return {
    type: ActionTypesSaga.GET_TASK_TEMPLATES,
    searchPhrase,
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

export function addNewTaskElement(viewPosition) {
  return {
    type: ActionTypes.ADD_NEW_TASK_ELEMENT,
    viewPosition,
  };
}

export function addNewDecisionTaskElement(viewPosition) {
  return {
    type: ActionTypes.ADD_NEW_DECISION_TASK_ELEMENT,
    viewPosition,
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

export function linkTasks(source, target) {
  return {
    type: ActionTypes.LINK_TASKS,
    source,
    target,
  };
}
