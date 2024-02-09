import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { TApiKey, TApiKeyQueryParams } from 'types/developer';
import { updateApiKey } from '@/app/api/developers-api';

interface UpdateApiKeyConfig {
  options?: UseMutationOptions<TApiKey, Error, TApiKeyQueryParams>;
}

export const useUpdateApiKey = ({ options = {} }: UpdateApiKeyConfig = {}) => {
  const queryClient = useQueryClient();

  return useMutation<TApiKey, Error, TApiKeyQueryParams>({
    mutationFn: (params: TApiKeyQueryParams) => updateApiKey(params),
    onSuccess: (data, params) => {
      queryClient.setQueryData(
        ['developer_api_key', params.organizationIdentifier],
        data,
      );
    },
    ...options,
  });
};
