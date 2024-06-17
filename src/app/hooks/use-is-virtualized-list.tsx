import { useMemo } from 'react';
import useSearchParams from './use-search-params';

export const useIsVirtualizedList = () => {
  const searchParams = useSearchParams();
  const isVirtualizedList = useMemo(
    () => !window.disabledVirtualTaskList && searchParams.print !== 'true',
    [searchParams],
  );

  return isVirtualizedList;
};
