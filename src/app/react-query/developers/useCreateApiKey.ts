import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TApiKey, TCreateApiKeyMutationParams } from 'types/developer';
import { createApiKey } from '@/app/api/developers-api';
import { ApiError, UseExtendedMutationOptions } from '../types';
import { apiKeyQueryKey } from './useApiKeyQuery';

interface Config {
  options?: UseExtendedMutationOptions<
    TApiKey,
    ApiError,
    TCreateApiKeyMutationParams
  >;
}

export const useCreateApiKey = ({ options = {} }: Config = {}) => {
  const queryClient = useQueryClient();

  const mutationFn = (params: TCreateApiKeyMutationParams) =>
    createApiKey(params);

  const defaultOptions: UseExtendedMutationOptions<
    TApiKey,
    ApiError,
    TCreateApiKeyMutationParams
  > = {
    onSuccess: (data, params) => {
      queryClient.setQueryData(
        apiKeyQueryKey(params.organizationIdentifier),
        data,
      );
    },
  };

  return useMutation<TApiKey, ApiError, TCreateApiKeyMutationParams>({
    mutationFn,
    ...defaultOptions,
    ...options,
  });
};
