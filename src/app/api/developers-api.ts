import axios from './axios-heydoc';
import { TApiKey, TCreateApiKeyMutationParams } from 'types/developer';

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
      throw new Error(error?.respnose?.data?.errorMessage);
    });
}
