import * as ActionTypes from 'actions/action-types';

export function moveTemplate({
  parentTaskTemplateIdentifier,
  taskTemplateIdentifier,
}) {
  return {
    type: ActionTypes.MOVE_TASK_TEMPLATE,
    payload: {
      parentTaskTemplateIdentifier,
      taskTemplateIdentifier,
    },
  };
}

export function addTemplate(template) {
  return {
    type: ActionTypes.ADD_TASK_TEMPLATE,
    template: { ...template, type: 'WORKFLOW' },
  };
}

export function addSmartFlow(template, history) {
  return {
    type: ActionTypes.ADD_TASK_TEMPLATE,
    template: { ...template, type: 'SMARTFLOW' },
    history,
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
    type: ActionTypes.ADD_TASK_TEMPLATE_FOLDER,
    template: { ...template, parentIdentifier, type: 'FOLDER' },
  };
}

export function updateTaskTemplateSuccess(
  taskTemplateIdentifier,
  dataToUpdate,
) {
  return {
    type: ActionTypes.UPDATE_TASK_TEMPLATE_SUCCESS,
    taskTemplateIdentifier,
    dataToUpdate,
  };
}

export function goToTaskTemplateFolder(taskTemplateFolderIdentifier = null) {
  return {
    type: ActionTypes.GO_TO_TASK_TEMPLATE_FOLDER,
    payload: { taskTemplateFolderIdentifier },
  };
}

export function deleteTemplate(taskTemplateIdentifier) {
  return {
    type: ActionTypes.DELETE_TASK_TEMPLATE,
    taskTemplateIdentifier,
  };
}

export function switchTemplatePublic(taskTemplateIdentifier, flagPublic) {
  return {
    type: ActionTypes.SWITCH_TEMPLATE_PUBLIC,
    taskTemplateIdentifier,
    flagPublic,
  };
}

export function duplicateTemplate(taskTemplateIdentifier, includeAttachments) {
  return {
    type: ActionTypes.DUPLICATE_TASK_TEMPLATE,
    taskTemplateIdentifier,
    includeAttachments,
  };
}

export function updateTemplate(taskTemplateIdentifier, dataToUpdate) {
  return {
    type: ActionTypes.UPDATE_TASK_TEMPLATE,
    taskTemplateIdentifier,
    dataToUpdate,
  };
}

export function getAllTemplatesForOrganization(searchPhrase = null) {
  return {
    type: ActionTypes.GET_ALL_TASK_TEMPLATES,
    searchPhrase,
  };
}

export function getTemplates(searchPhrase = null) {
  return {
    type: ActionTypes.GET_TASK_TEMPLATES,
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
    type: ActionTypes.TOGGLE_TASK_TEMPLATE_OPEN,
    taskTemplateIdentifier,
  };
}

export function reorderTasksForTemplate({
  taskTemplateIdentifier,
  source,
  destination,
}) {
  return {
    type: ActionTypes.REORDER_TASKS_FOR_TEMPLATE,
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
  return { type: ActionTypes.RELOAD_OPENED_TEMPLATE_TASKS };
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

export function addNewTaskElement(position) {
  return {
    type: ActionTypes.ADD_NEW_TASK_ELEMENT,
    position,
  };
}

export function addNewDecisionTaskElement(position) {
  return {
    type: ActionTypes.ADD_NEW_DECISION_TASK_ELEMENT,
    position,
  };
}

export function addTemporaryElements(elements) {
  return {
    type: ActionTypes.ADD_TEMPORARY_ELEMENTS,
    elements,
  };
}

export function addDecisionBranch(sourceTaskIdentifier) {
  return {
    type: ActionTypes.ADD_DECISION_BRANCH,
    sourceTaskIdentifier,
  };
}

export function deleteTemporaryElement(elementId) {
  return {
    type: ActionTypes.DELETE_TEMPORARY_ELEMENT,
    elementId,
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

export function addTemporaryLink(
  sourceId,
  targetId,
  sourceHandle,
  targetHandle,
) {
  return {
    type: ActionTypes.ADD_TEMPORARY_LINK,
    sourceId,
    targetId,
    sourceHandle,
    targetHandle,
  };
}

export function getCurrentTaskTemplate() {
  return {
    type: ActionTypes.GET_CURRENT_TASK_TEMPLATE,
  };
}
