import axios from './axios-heydoc';
import * as AlertActions from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as ActionTypes from 'actions/action-types';

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
