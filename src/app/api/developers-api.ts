import { showAlert } from '../helpers/utility-functions';
import axios from './axios-heydoc';
import { Credential } from 'types/developer';

export function getDeveloperCredentials() {
  return axios
    .get<Credential[]>('organization/settings/developer/credential')
    .then(({ data }) => data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error in Fetching Credentials. Please try again.',
      });
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function createDeveloperCredential() {
  return axios
    .post<Credential>('organization/settings/developer/credential')
    .then(({ data }) => data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error in Creating Credentials. Please try again.',
      });

      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function deleteDeveloperCredential(apiKey: string) {
  return axios
    .delete(`organization/settings/developer/credential/${apiKey}`)
    .then(({ data }) => data)
    .catch((error) => {
      showAlert({
        status: 'error',
        title: 'Error',
        text:
          error?.response?.data?.errorMessage ??
          'Error in Deleting Credentials. Please try again.',
      });
      throw new Error(error?.response?.data?.errorMessage);
    });
}
