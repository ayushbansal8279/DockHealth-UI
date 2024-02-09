import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { TApiKey, TApiKeyQueryParams } from 'types/developer';
import { getApiKey } from '@/app/api/developers-api';

interface ApiKeyQueryConfig {
  options?: Omit<UseQueryOptions<TApiKey, Error>, 'queryKey'>;
  params: TApiKeyQueryParams;
}

export const useApiKeyQuery = ({ options = {}, params }: ApiKeyQueryConfig) => {
  const queryKey = ['developer_api_key', params.organizationIdentifier];
  const queryFn = () => getApiKey(params);
  return useQuery<TApiKey, Error>({
    queryKey,
    queryFn: queryFn,
    ...options,
  });
};
