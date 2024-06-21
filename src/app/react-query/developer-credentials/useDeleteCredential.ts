import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDeveloperCredential } from '@/app/api/developers-api';
import { ApiError, UseExtendedMutationOptions } from '../types';
import { developerCredentialQueryKey } from './useCredentialsQuery';
import { Credential } from '@/app/types/developer';

interface Variables {
  orgId: string;
  orgDeveloperIdentifier: string;
}

type Options = UseExtendedMutationOptions<unknown, ApiError, Variables>;

interface Config {
  options?: Options;
}

export const useDeleteCredential = ({ options = {} }: Config = {}) => {
  const queryClient = useQueryClient();

  const mutationFn = ({ orgDeveloperIdentifier }: Variables) =>
    deleteDeveloperCredential(orgDeveloperIdentifier);

  const defaultOptions: Options = {
    onSuccess: (_, { orgId, orgDeveloperIdentifier }: Variables) => {
      queryClient.setQueryData(
        developerCredentialQueryKey(orgId),
        (oldData: Credential[]) => {
          const idx = oldData.findIndex(
            (credential) =>
              credential.orgDeveloperIdentifier === orgDeveloperIdentifier,
          );
          return [...oldData.slice(0, idx), ...oldData.slice(idx + 1)];
        },
      );
    },
  };

  return useMutation<unknown, ApiError, Variables>({
    mutationFn,
    ...defaultOptions,
    ...options,
  });
};
