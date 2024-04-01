import axios from './axios-heydoc';
import { TApiKey, TCreateApiKeyMutationParams } from 'types/developer';

export function createApiKey({
  organizationIdentifier,
  sendEmail = true,
}: TCreateApiKeyMutationParams) {
  return axios
    .post<TApiKey>(
      // `developer/create/${organizationIdentifier}?sendEmail=${
      //   sendEmail ? 'true' : 'false'
      // }`,
      'organization/settings/orgDeveloper',
    )
    .then(({ data }) => data)
    .catch((error) => {
      throw new Error(error?.response?.data?.errorMessage);
    });
}

export function getApiKey(orgId: string) {
  return (
    axios
      // .get<TApiKey>(`developers/${orgId}`)
      .get<TApiKey>('organization/settings/orgDeveloper')
      .then(({ data }) => data)
      .catch((error) => {
        throw new Error(error?.response?.data?.errorMessage);
      })
  );
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
