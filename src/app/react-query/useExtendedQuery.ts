import { useQuery, QueryKey, UseQueryOptions } from '@tanstack/react-query';

import { UseExtendedQueryResult } from './types';

export function useExtendedQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryKey,
  queryFn,
  ...options
}: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>): UseExtendedQueryResult<TData, TError> {
  const query: any = useQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryKey,
    queryFn,
    ...options,
  });

  if (query.status === 'success') {
    // 1.) Inject meta key from response payload to query object
    if (query.data?.meta) {
      query.meta = query.data.meta;
    }

    // 2.) Flatten data key
    if (query.data?.data) {
      query.data = query.data.data;
    }
  }

  return query;
}
