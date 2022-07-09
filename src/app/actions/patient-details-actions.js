import * as ActionTypes from 'actions/action-types';

export function initializePatientState(patientIdentifier) {
  return {
    type: ActionTypes.INITIALIZE_PATIENT_STATE,
    patientIdentifier,
  };
}
export function clearPatientState() {
  return {
    type: ActionTypes.CLEAR_PATIENT_STATE,
  };
}

export function getCurrentPatient() {
  return {
    type: ActionTypes.GET_CURRENT_PATIENT,
  };
}

export function getCurrentPatientLabels() {
  return {
    type: ActionTypes.GET_CURRENT_PATIENT_LABELS,
  };
}

export function getCurrentPatientAttachments() {
  return {
    type: ActionTypes.GET_CURRENT_PATIENT_ATTACHMENTS,
  };
}

export function getCurrentPatientTasks(taskStatus) {
  return {
    type: ActionTypes.GET_CURRENT_PATIENT_TASKS,
    payload: {
      taskStatus,
    },
  };
}

export function getPatientFilterOptions() {
  return {
    type: ActionTypes.GET_PATIENT_FILTER_OPTIONS,
  };
}

export function changePatientTasksFilters(selectedFilters) {
  return {
    type: ActionTypes.CHANGE_PATIENT_TASKS_FILTERS,
    selectedFilters,
  };
}

export const updatePatientNote = (patientNoteIdentifier, note) => ({
  type: ActionTypes.UPDATE_PATIENT_NOTE,
  payload: { patientNoteIdentifier, note },
});

export const updatePatientDetails = (patientIdentifier, details) => ({
  type: ActionTypes.UPDATE_PATIENT_DETAILS,
  payload: { patientIdentifier, details },
});

export const addPatientNote = note => ({
  type: ActionTypes.ADD_PATIENT_NOTE,
  payload: { note },
});

export const deletePatientNote = patientNoteIdentifier => ({
  type: ActionTypes.REMOVE_PATIENT_NOTE,
  payload: { patientNoteIdentifier },
});

export const pinPatientNote = patientNoteIdentifier => ({
  type: ActionTypes.PIN_PATIENT_NOTE,
  payload: { patientNoteIdentifier },
});

export const unpinPatientNote = patientNoteIdentifier => ({
  type: ActionTypes.UNPIN_PATIENT_NOTE,
  payload: { patientNoteIdentifier },
});

export function togglePatientCompleteTasksVisible() {
  return {
    type: ActionTypes.TOGGLE_PATIENT_COMPLETE_TASKS_VISIBLE,
  };
}

export function getPatientTasksStats() {
  return {
    type: ActionTypes.GET_PATIENT_TASKS_STATS,
  };
}

export const setCurrentListTasksStatus = taskStatus => ({
  type: ActionTypes.SELECT_PATIENT_LIST_TASK_STATUS,
  taskStatus,
});

export function mergePatient(fromPatient, toPatient, onSuccess) {
  return {
    type: ActionTypes.MERGE_PATIENT,
    fromPatient,
    toPatient,
    onSuccess,
  };
}

export function updatePatientAttachment(attachment, dataToUpdate) {
  return {
    type: ActionTypes.UPDATE_PATIENT_ATTACHMENT,
    attachment,
    dataToUpdate,
  };
}

export function movePatientAttachment(attachment, destinationFolderIdentifier) {
  return {
    type: ActionTypes.MOVE_PATIENT_ATTACHMENT,
    attachment,
    destinationFolderIdentifier,
  };
}

export function deletePatientAttachment(patientIdentifier, identifier) {
  return {
    type: ActionTypes.DELETE_PATIENT_ATTACHMENT,
    patientIdentifier,
    identifier,
  };
}

export function createPatientAttachmentFolder(
  patientIdentifier,
  name,
  folderIdentifier = null,
) {
  return {
    type: ActionTypes.ADD_PATIENT_ATTACHMENT_FOLDER,
    patientIdentifier,
    name,
    folderIdentifier,
  };
}

export const createPatientAttachment = (
  patientIdentifier,
  folderIdentifier,
  fileData,
  additionalConfig,
  setCurrentlyUploadedAttachment,
  onAttachmentFileInputChange,
  restAttachments,
) => ({
  type: ActionTypes.ADD_PATIENT_ATTACHMENT,
  patientIdentifier,
  folderIdentifier,
  fileData,
  additionalConfig,
  setCurrentlyUploadedAttachment,
  onAttachmentFileInputChange,
  restAttachments,
});

export const createPatientAttachmentReference = (
  patientIdentifier,
  name,
  url,
  mimeType,
  referenceType,
  folderIdentifier = null,
) => ({
  type: ActionTypes.ADD_PATIENT_ATTACHMENT_REFERENCE,
  patientIdentifier,
  name,
  url,
  mimeType,
  referenceType,
  folderIdentifier,
});

export function initializePatientAttachmentsFolder(folderIdentifier) {
  return {
    type: ActionTypes.INITIALIZE_PATIENT_ATTACHMENTS_FOLDER,
    folderIdentifier,
  };
}
