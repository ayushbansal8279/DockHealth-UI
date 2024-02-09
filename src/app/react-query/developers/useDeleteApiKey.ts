import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { TApiKeyQueryParams } from 'types/developer';
import { deleteApiKey } from '@/app/api/developers-api';

interface DeleteApiKeyConfig {
  options?: UseMutationOptions<null, Error, TApiKeyQueryParams>;
}

export const useDeleteApiKey = ({ options = {} }: DeleteApiKeyConfig = {}) => {
  const queryClient = useQueryClient();

  return useMutation<null, Error, TApiKeyQueryParams>({
    mutationFn: (params: TApiKeyQueryParams) => deleteApiKey(params),
    onSuccess: (_, params) => {
      queryClient.setQueryData(
        ['developer_api_key', params.organizationIdentifier],
        null,
      );
    },
    ...options,
  });
};
