import { log } from 'helpers/log';
import axios from './axios-heydoc';

export function getPatientAISummary(patientIdentifier, customPrompt) {
  return axios
    .post(`/aisummary/patient/${patientIdentifier}`, customPrompt)
    .then((response) => response.data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getTaskAISummary(taskIdentifier, customPrompt) {
  return axios
    .post(`/aisummary/task/${taskIdentifier}`, customPrompt)
    .then((response) => response.data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getWorkflowAISummary(workFlowIdentifier, customPrompt) {
  return axios
    .post(`/aisummary/workflow/${workFlowIdentifier}`, customPrompt)
    .then((response) => response.data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}
