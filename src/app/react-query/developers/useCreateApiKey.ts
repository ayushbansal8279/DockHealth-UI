import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { TApiKey, TCreateApiKeyMutationParams } from 'types/developer';
import { createApiKey } from '@/app/api/developers-api';

interface CreateApiKeyConfig {
  options?: UseMutationOptions<TApiKey, Error, TCreateApiKeyMutationParams>;
}

export const useCreateApiKey = ({ options = {} }: CreateApiKeyConfig = {}) => {
  const queryClient = useQueryClient();

  return useMutation<TApiKey, Error, TCreateApiKeyMutationParams>({
    mutationFn: (params: TCreateApiKeyMutationParams) => createApiKey(params),
    onSuccess: (data, params) => {
      queryClient.setQueryData(
        ['developer_api_key', params.organizationIdentifier],
        data,
      );
    },
    ...options,
  });
};
