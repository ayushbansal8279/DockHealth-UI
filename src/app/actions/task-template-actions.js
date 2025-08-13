import * as ActionTypes from 'actions/action-types';
import { transformTaskMetadata } from '../helpers/task-helpers';

export function initializeWorkflowLibraryState(
  folderIdentifier,
  workspaceIdentifier,
) {
  return {
    type: ActionTypes.INITIALIZE_WORKFLOW_LIBRARY_STATE,
    folderIdentifier,
    workspaceIdentifier,
  };
}

export function clearWorkflowLibraryState() {
  return {
    type: ActionTypes.CLEAR_WORKFLOW_LIBRARY_STATE,
  };
}

export function moveWorkflowToFolder(identifier, parentTaskWorkflowIdentifier) {
  return {
    type: ActionTypes.MOVE_WORKFLOW_TO_FOLDER,
    identifier,
    parentTaskWorkflowIdentifier,
  };
}

export function copyWorkflowToOrganization(
  identifier,
  targetOrganizationIdentifiers,
) {
  return {
    type: ActionTypes.COPY_WORKFLOW_TO_ORGANIZATION,
    identifier,
    targetOrganizationIdentifiers,
  };
}

export function shareWorkflowWithOrganization(
  identifier,
  targetOrganizationIdentifiers,
) {
  return {
    type: ActionTypes.SHARE_WORKFLOW_WITH_ORGANIZATION,
    identifier,
    targetOrganizationIdentifiers,
  };
}

export function addTemplate(template, workspaceIdentifier) {
  return {
    type: ActionTypes.ADD_TASK_TEMPLATE,
    template: { ...template, templateType: 'WORKFLOW' },
    workspaceIdentifier,
  };
}

export function addSmartFlow(template, history, workspaceIdentifier) {
  return {
    type: ActionTypes.ADD_TASK_TEMPLATE,
    template: { ...template, templateType: 'SMARTFLOW' },
    history,
    workspaceIdentifier,
  };
}

export function addTemplateFolder(
  template,
  parentIdentifier = null,
  workspaceIdentifier,
) {
  return {
    type: ActionTypes.ADD_TASK_TEMPLATE_FOLDER,
    template: { ...template, parentIdentifier, templateType: 'FOLDER' },
    workspaceIdentifier,
  };
}

export function switchTemplatePublic(taskTemplateIdentifier, flagPublic) {
  return {
    type: ActionTypes.SWITCH_TEMPLATE_PUBLIC,
    taskTemplateIdentifier,
    flagPublic,
  };
}

export function updatePartialWorkflow(taskWorkflowIdentifier, dataToUpdate) {
  const transformedDataToUpdate = transformTaskMetadata(dataToUpdate);

  return {
    type: ActionTypes.UPDATE_PARTIAL_WORKFLOW,
    taskWorkflowIdentifier,
    dataToUpdate: transformedDataToUpdate,
  };
}

export function getWorkflowFolder(searchPhrase = null, workspaceIdentifier) {
  return {
    type: ActionTypes.GET_WORKFLOW_FOLDER,
    searchPhrase,
    workspaceIdentifier,
  };
}

export function getWorkflowDetails(taskWorkflowIdentifier) {
  return {
    type: ActionTypes.GET_WORKFLOW_DETAILS,
    taskWorkflowIdentifier,
  };
}

export function getFolderBreadcrumbs() {
  return {
    type: ActionTypes.GET_FOLDER_BREADCRUMBS,
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

export function selectTaskTemplate(identifier) {
  return {
    type: ActionTypes.SELECT_TASK_TEMPLATE,
    identifier,
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

export function saveTaskTemplateLayoutToHistory(layout) {
  return {
    type: ActionTypes.SAVE_HISTORY_TASK_TEMPLATE_LAYOUT,
    layout,
  };
}

export function undoTaskTemplateLayout() {
  return {
    type: ActionTypes.RECOVER_HISTORY_TASK_TEMPLATE_LAYOUT,
  };
}

export function addNewTaskElement(position) {
  return {
    type: ActionTypes.ADD_NEW_TASK_ELEMENT,
    position,
  };
}

export function addNewAutomationTaskElement(position) {
  return {
    type: ActionTypes.ADD_NEW_AUTOMATION_TASK_ELEMENT,
    position,
  };
}

export function addNewDecisionTaskElement(position) {
  return {
    type: ActionTypes.ADD_NEW_DECISION_TASK_ELEMENT,
    position,
  };
}

export function addNewNestedFlowElement(position) {
  return {
    type: ActionTypes.ADD_NEW_WORKFLOW_LINK_ELEMENT,
    position,
  };
}

export function addNewEmailElement(position) {
  return {
    type: ActionTypes.ADD_NEW_EMAIL_ELEMENT,
    position,
  };
}

export function addNewWebhookElement(position) {
  return {
    type: ActionTypes.ADD_NEW_WEBHOOK_ELEMENT,
    position,
  };
}

export function addNewAIAnalyzerElement(position) {
  return {
    type: ActionTypes.ADD_NEW_AI_ANALYZER_ELEMENT,
    position,
  };
}

export function addNewAIAssistantElement(position) {
  return {
    type: ActionTypes.ADD_NEW_AI_ASSISTANT_ELEMENT,
    position,
  };
}

export function addNewSendSMSElement(position) {
  return {
    type: ActionTypes.ADD_NEW_SEND_SMS_ELEMENT,
    position,
  };
}

export function addNewCallWebhookElement(position) {
  return {
    type: ActionTypes.ADD_NEW_CALL_WEBHOOK_ELEMENT,
    position,
  };
}

export function addNewCallAPIElement(position) {
  return {
    type: ActionTypes.ADD_NEW_CALL_API_ELEMENT,
    position,
  };
}

export function addNewCreatePatientElement(position) {
  return {
    type: ActionTypes.ADD_NEW_CREATE_PATIENT_ELEMENT,
    position,
  };
}

export function addNewCreateAppointmentElement(position) {
  return {
    type: ActionTypes.ADD_NEW_CREATE_APPOINTMENT_ELEMENT,
    position,
  };
}

export function addNewUpdateAppointmentElement(position) {
  return {
    type: ActionTypes.ADD_NEW_UPDATE_APPOINTMENT_ELEMENT,
    position,
  };
}

export function addNewCreateNoteElement(position) {
  return {
    type: ActionTypes.ADD_NEW_CREATE_NOTE_ELEMENT,
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

export function editTemporaryElement(elementId, data) {
  return {
    type: ActionTypes.EDIT_TEMPORARY_ELEMENT,
    elementId,
    data,
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

export function linkTasks(source, target, options, outcomeName) {
  return {
    type: ActionTypes.LINK_TASKS,
    source,
    target,
    options,
    outcomeName,
  };
}

export function addTemporaryLink(
  linkType,
  sourceId,
  targetId,
  sourceHandle,
  targetHandle,
  indicatorType,
) {
  return {
    type: ActionTypes.ADD_TEMPORARY_LINK,
    linkType,
    sourceId,
    targetId,
    sourceHandle,
    targetHandle,
    indicatorType,
  };
}

export function getCurrentTaskTemplate() {
  return {
    type: ActionTypes.GET_CURRENT_TASK_TEMPLATE,
  };
}

export function addLabel({ labelName, labelIdentifier, identifier }) {
  return {
    type: ActionTypes.ADD_WORKFLOW_LABEL,
    labelName,
    labelIdentifier,
    identifier,
  };
}

export function editLabel({ labelName, labelIdentifier, identifier }) {
  return {
    type: ActionTypes.UPDATE_WORKFLOW_LABEL,
    labelName,
    labelIdentifier,
    identifier,
  };
}

export function removeLabelFromTask({
  labelName,
  labelIdentifier,
  identifier,
}) {
  return {
    type: ActionTypes.REMOVE_WORKFLOW_LABEL_FROM_TASK,
    labelName,
    labelIdentifier,
    identifier,
  };
}

export function removeLabel({ labelIdentifier }) {
  return {
    type: ActionTypes.REMOVE_WORKFLOW_LABEL,
    labelIdentifier,
  };
}
