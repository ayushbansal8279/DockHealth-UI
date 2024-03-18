import {
  UseQueryResult,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';

import { AxiosError } from 'axios';

export type ApiError = AxiosError;

export type UseExtendedQueryOptions<T> = Omit<
  UseQueryOptions<T, ApiError>,
  'queryKey' | 'queryFn'
>;

export type UseExtendedQueryResult<TData, TError> = UseQueryResult<
  TData,
  TError
> & {
  meta?: unknown;
};

export type UseExtendedMutationOptions<TData, TError, TVariables> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  'mutationFn'
>;
