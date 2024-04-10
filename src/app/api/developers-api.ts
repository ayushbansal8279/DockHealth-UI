import axios from './axios-heydoc';
import { TApiKey } from 'types/developer';

export function createApiKey() {
  return axios
    .post<TApiKey>('organization/settings/orgDeveloper')
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getApiKey() {
  return axios
    .get<TApiKey>('organization/settings/orgDeveloper')
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function updateApiKey(orgId: string) {
  return axios
    .put<TApiKey>(`developers/${orgId}`)
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function deleteApiKey(orgId: string) {
  return axios
    .delete(`developers/${orgId}`)
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}
