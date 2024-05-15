import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiKey } from 'types/developer';
import { createApiKey } from '@/app/api/developers-api';
import { ApiError, UseExtendedMutationOptions } from '../types';
import { apiKeyQueryKey } from './useApiKeyQuery';

interface Config {
  orgId: string;
  options?: UseExtendedMutationOptions<ApiKey, ApiError, unknown>;
}

export const useCreateApiKey = ({ orgId, options = {} }: Config) => {
  const queryClient = useQueryClient();

  const mutationFn = createApiKey;

  const defaultOptions: UseExtendedMutationOptions<ApiKey, ApiError, unknown> =
    {
      onSuccess: (data) => {
        queryClient.setQueryData(apiKeyQueryKey(orgId), data);
      },
    };

  return useMutation<ApiKey, ApiError>({
    mutationFn,
    ...defaultOptions,
    ...options,
  });
};
