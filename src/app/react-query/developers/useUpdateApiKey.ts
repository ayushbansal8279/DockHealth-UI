import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TApiKey } from 'types/developer';
import { updateApiKey } from '@/app/api/developers-api';
import { ApiError, UseExtendedMutationOptions } from '../types';
import { apiKeyQueryKey } from './useApiKeyQuery';

type Options = UseExtendedMutationOptions<TApiKey, ApiError, string>;

interface Config {
  options?: Options;
}

export const useUpdateApiKey = ({ options = {} }: Config = {}) => {
  const queryClient = useQueryClient();

  const mutationFn = (orgId: string) => updateApiKey(orgId);

  const defaultOptions: Options = {
    onSuccess: (data, orgId) => {
      queryClient.setQueryData(apiKeyQueryKey(orgId), data);
    },
  };

  return useMutation<TApiKey, ApiError, string>({
    mutationFn,
    ...defaultOptions,
    ...options,
  });
};
