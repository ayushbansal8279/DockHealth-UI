import { GenderIdentityOption } from '@/app/types/gender';
import { getGenderIdentityOptions } from '@/app/api/patients-api';
import { ApiError, UseExtendedQueryOptions } from '../types';
import { useExtendedQuery } from '../useExtendedQuery';

export const genderIdentitiesQueryKey = () => ['reference/genderIdentities'];

interface Config {
  options?: UseExtendedQueryOptions<GenderIdentityOption[]>;
}

export const useGenderIdentitiesQuery = ({ options = {} }: Config = {}) => {
  const queryFn = () => getGenderIdentityOptions();

  return useExtendedQuery<GenderIdentityOption[], ApiError>({
    queryKey: genderIdentitiesQueryKey(),
    queryFn,
    ...options,
  });
};
