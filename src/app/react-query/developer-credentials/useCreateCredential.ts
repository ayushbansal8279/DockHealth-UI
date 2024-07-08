import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Credential } from 'types/developer';
import { createDeveloperCredential } from '@/app/api/developers-api';
import { ApiError, UseExtendedMutationOptions } from '../types';
import { developerCredentialQueryKey } from './useCredentialsQuery';

interface Config {
  orgId: string;
  options?: UseExtendedMutationOptions<Credential, ApiError, unknown>;
}

export const useCreateCredential = ({ orgId, options = {} }: Config) => {
  const queryClient = useQueryClient();

  const mutationFn = createDeveloperCredential;

  const defaultOptions: UseExtendedMutationOptions<
    Credential,
    ApiError,
    unknown
  > = {
    onSuccess: (data) => {
      queryClient.setQueryData(
        developerCredentialQueryKey(orgId),
        (oldData: Credential[]) => [...oldData, data],
      );
    },
  };

  return useMutation<Credential, ApiError>({
    mutationFn,
    ...defaultOptions,
    ...options,
  });
};
