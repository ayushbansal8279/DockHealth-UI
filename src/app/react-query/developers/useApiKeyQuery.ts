import { TApiKey } from 'types/developer';
import { getApiKey } from '@/app/api/developers-api';
import { ApiError, UseExtendedQueryOptions } from '../types';
import { useExtendedQuery } from '../useExtendedQuery';

export const apiKeyQueryKey = (orgId: string) => ['developer_api_key', orgId];

interface Config {
  orgId: string;
  options?: UseExtendedQueryOptions<TApiKey>;
}

export const useApiKeyQuery = ({ orgId, options = {} }: Config) => {
  const queryFn = () => getApiKey(orgId);

  return useExtendedQuery<TApiKey, ApiError>({
    queryKey: apiKeyQueryKey(orgId),
    queryFn,
    ...options,
  });
};
