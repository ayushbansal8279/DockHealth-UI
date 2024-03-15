import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteApiKey } from '@/app/api/developers-api';
import { ApiError, UseExtendedMutationOptions } from '../types';
import { apiKeyQueryKey } from './useApiKeyQuery';

type Options = UseExtendedMutationOptions<unknown, ApiError, string>;

interface Config {
  options?: Options;
}

export const useDeleteApiKey = ({ options = {} }: Config = {}) => {
  const queryClient = useQueryClient();

  const mutationFn = (orgId: string) => deleteApiKey(orgId);

  const defaultOptions: Options = {
    onSuccess: (_, orgId) => {
      queryClient.setQueryData(apiKeyQueryKey(orgId), null);
    },
  };

  return useMutation<unknown, ApiError, string>({
    mutationFn,
    ...defaultOptions,
    ...options,
  });
};
