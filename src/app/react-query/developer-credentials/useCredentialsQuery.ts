import { Credential } from 'types/developer';
import { getDeveloperCredentials } from '@/app/api/developers-api';
import { ApiError, UseExtendedQueryOptions } from '../types';
import { useExtendedQuery } from '../useExtendedQuery';

export const developerCredentialQueryKey = (orgId: string) => [
  'developer_credential',
  orgId,
];

interface Config {
  orgId: string;
  options?: UseExtendedQueryOptions<Credential[]>;
}

export const useCredentialsQuery = ({ orgId, options = {} }: Config) => {
  const queryFn = getDeveloperCredentials;

  return useExtendedQuery<Credential[], ApiError>({
    queryKey: developerCredentialQueryKey(orgId),
    queryFn,
    ...options,
  });
};
