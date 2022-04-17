import axios from './axios-heydoc';
import AlertMessages from 'alert/AlertMessages';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';

const CREATE_TASK = 'CREATE_TASK';
const CREATE_WORKFLOW = 'CREATE_WORKFLOW';
const ADD_LABEL = 'ADD_LABEL';
const DELETE_PATIENT = 'DELETE_PATIENT';

export const patientBulkCreateTask = payload => {
  const { assignedToUsers, taskListIdentifier, description } = payload;

  const body = {
    bulkOperationType: CREATE_TASK,
    taskDescription: description,
    taskListIdentifier,
    patientIdentifiers: assignedToUsers,
  };

  axios.put(`patient/bulk`, body).catch(error => {
    throw new Error(error?.response?.data?.errorMessage);
  });
};

export const patientBulkCreateWorkflow = payload => {
  const { assignedToUsers, taskListIdentifier, workflowIdentifier } = payload;

  const body = {
    bulkOperationType: CREATE_WORKFLOW,
    workflowIdentifier,
    taskListIdentifier,
    patientIdentifiers: assignedToUsers,
  };

  axios.put(`patient/bulk`, body).catch(error => {
    throw new Error(error?.response?.data?.errorMessage);
  });
};

export const patientBulkDeletePatient = payload => {
  const body = {
    bulkOperationType: DELETE_PATIENT,
    patientIdentifiers: payload,
  };

  axios.put(`patient/bulk`, body).catch(error => {
    throw new Error(error?.response?.data?.errorMessage);
  });
};

export const patientBulkAddLabel = data => {
  const { labelIdentifier, labelName, assignedToUsers } = data;
  const body = {
    bulkOperationType: ADD_LABEL,
    labelIdentifier: labelIdentifier || null,
    labelName: labelName || null,
    patientIdentifiers: assignedToUsers,
  };

  axios
    .put(`patient/bulk`, body)
    .then(() => {
      showGlobalAlert(AlertMessages.Saved);
    })
    .catch(error => {
      showGlobalErrorAlert();
      throw new Error(error?.response?.data?.errorMessage);
    });
};
