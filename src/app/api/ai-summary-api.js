import { log } from 'helpers/log';
import axios from './axios-heydoc';

export function getPatientAISummary(patientIdentifier) {
  return axios
    .get(`/aisummary/patient/${patientIdentifier}`)
    .then((response) => response.data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getTaskAISummary(taskIdentifier) {
  return axios
    .get(`/aisummary/task/${taskIdentifier}`)
    .then((response) => response.data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getWorkflowAISummary(workFlowIdentifier) {
  return axios
    .get(`/aisummary/workflow/${workFlowIdentifier}`)
    .then((response) => response.data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}
