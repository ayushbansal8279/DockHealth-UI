import { log } from 'helpers/log';
import axios from './axios-heydoc';

export function getPatientAISummary(contextType, patientIdentifier) {
  return axios
    .get(`aiproxy?contextType=${contextType}&contextId=${patientIdentifier}`)
    .then((response) => response.data)
    .catch((error) => {
      log(error);
      throw new Error(error?.response?.data?.errorMessage);
    });
}
