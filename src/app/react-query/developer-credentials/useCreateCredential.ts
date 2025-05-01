import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Credential } from 'types/developer';
import { createDeveloperCredential, createDeveloperCredentialWithScopes } from '@/app/api/developers-api';
import { ApiError, UseExtendedMutationOptions } from '../types';
import { developerCredentialQueryKey } from './useCredentialsQuery';

interface Config {
  orgId: string;
  options?: UseExtendedMutationOptions<Credential, ApiError,  string[]>;
}

export const useCreateCredential = ({ orgId, options = {} }: Config) => {
  const queryClient = useQueryClient();

  const mutationFn = (scopes: string[]) =>
    createDeveloperCredentialWithScopes(scopes);

  const defaultOptions: UseExtendedMutationOptions<
    Credential,
    ApiError,
    string[]
  > = {
    onSuccess: (data) => {
      queryClient.setQueryData(
        developerCredentialQueryKey(orgId),
        (oldData: Credential[]) => [...oldData, data],
      );
    },
  };

  return useMutation<Credential, ApiError, string[]>({
    mutationFn,
    ...defaultOptions,
    ...options,
  });
};
