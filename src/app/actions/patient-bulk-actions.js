import * as ActionTypes from './action-types';

export function patientBulkCreateTask(payload) {
  return {
    type: ActionTypes.PATIENT_BULK_CREATE_TASK,
    payload,
  };
}

export function patientBulkCreateWorkflow(payload) {
  return {
    type: ActionTypes.PATIENT_BULK_CREATE_WORKFLOW,
    payload,
  };
}

export function patientBulkDeletePatient(payload) {
  return {
    type: ActionTypes.PATIENT_BULK_DELETE_PATIENTS,
    payload,
  };
}
