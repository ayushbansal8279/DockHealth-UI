import queryString from 'query-string';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default function useSearchParams() {
  const { search } = useLocation();

  const searchParams = useMemo(() => {
    const res = queryString.parse(search);
    return res;
  }, [search]);

  return searchParams;
}
