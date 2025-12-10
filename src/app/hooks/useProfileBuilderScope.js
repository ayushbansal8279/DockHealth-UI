import { useMemo } from 'react';
import useSearchParams from './use-search-params';

export function useProfileBuilderScope() {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const scopeParam = searchParams.scope;
    const scopeIdParam = searchParams.scopeId;

    const scope =
      scopeParam === 'workspace'
        ? 'workspace'
        : scopeParam === 'org'
        ? 'org'
        : 'org';

    const scopeId = scope === 'workspace' && scopeIdParam ? scopeIdParam : null;

    return {
      scope,
      scopeId,
    };
  }, [searchParams.scope, searchParams.scopeId]);
}

