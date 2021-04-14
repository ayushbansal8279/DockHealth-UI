/* eslint-disable import/prefer-default-export */
import * as ActionTypesSaga from './action-types-saga';

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

export function addTaskToTemplate(task) {
  return {
    type: ActionTypesSaga.ADD_TASK_TO_TEMPLATE,
    task,
  };
}

export function reloadOpenedTemplateTasks() {
  return { type: ActionTypesSaga.RELOAD_OPENED_TEMPLATE_TASKS };
}

export function applyTaskTemplate(
  taskTemplateIdentifier,
  taskGroupIdentifier,
  taskListIdentifier,
) {
  return {
    type: ActionTypesSaga.APPLY_TASK_TEMPLATE,
    taskTemplateIdentifier,
    taskGroupIdentifier,
    taskListIdentifier,
  };
}

export function duplicateTemplateBundle(
  taskTemplateIdentifier,
  taskGroupIdentifier,
  includeAttachments,
) {
  return {
    type: ActionTypesSaga.DUPLICATE_TEMPLATE_BUNDLE,
    taskTemplateIdentifier,
    taskGroupIdentifier,
    includeAttachments,
  };
}

export function deleteTemplateBundle(
  taskTemplateIdentifier,
  taskGroupIdentifier,
) {
  return {
    type: ActionTypesSaga.DELETE_TEMPLATE_BUNDLE,
    taskTemplateIdentifier,
    taskGroupIdentifier,
  };
}
