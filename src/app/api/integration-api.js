import { showAlert } from '../helpers/utility-functions';
import axios from './axios-heydoc';

// eslint-disable-next-line import/prefer-default-export
export function getAllESignTemplates() {
  return axios
    .get(`task/communication/esign/templates`)
    .then(({ data }) => data);
}

export function getAllDockIntegrations() {
  return axios
    .get(`/reference/integration`)
    .then(({data})=> data);
}

export function getEnabledDockIntegrationsForOrg() {
  return axios
    .get(`/organization/integration`)
    .then(({data})=> data);
}

export function addIntegrationToOrg(data) {
  return axios
    .post(`/organization/integration`, data)
    .then((response) => response.data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
      });
      throw new Error(error?.response?.data?.errorMessage);
});}

export function updateIntegrationToOrg(data){
  return axios
    .patch(`/organization/integration`, data)
    .then((response) => response.data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
      });
      throw new Error(error?.response?.data?.errorMessage);
});}