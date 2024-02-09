import axios from './axios-heydoc';
import {
  TApiKey,
  TApiKeyQueryParams,
  TCreateApiKeyMutationParams,
} from 'types/developer';

export function createApiKey({
  organizationIdentifier,
  sendEmail = true,
}: TCreateApiKeyMutationParams) {
  return axios
    .post<TApiKey>(
      `developer/create/${organizationIdentifier}?sendEmail=${
        sendEmail ? 'true' : 'false'
      }`,
    )
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getApiKey({ organizationIdentifier }: TApiKeyQueryParams) {
  return axios
    .get<TApiKey>(`developers/${organizationIdentifier}`)
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function updateApiKey({ organizationIdentifier }: TApiKeyQueryParams) {
  return axios
    .put<TApiKey>(`developers/${organizationIdentifier}`)
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function deleteApiKey({ organizationIdentifier }: TApiKeyQueryParams) {
  return axios
    .delete(`developers/${organizationIdentifier}`)
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}
