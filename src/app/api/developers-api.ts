import axios from './axios-heydoc';
import { Credential } from 'types/developer';

export function getDeveloperCredentials() {
  return axios
    .get<Credential[]>('organization/settings/developer/credential')
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err?.response?.data?.errorMessage);
    });
}

export function createDeveloperCredential() {
  return axios
    .post<Credential>('organization/settings/developer/credential')
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function deleteDeveloperCredential(apiKey: string) {
  return axios
    .delete(`organization/settings/developer/credential/${apiKey}`)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err?.response?.data?.errorMessage);
    });
}
