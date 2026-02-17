'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface QueryParams {
  [key: string]: string;
}

function useQueryParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParams = useMemo((): QueryParams => {
    const params: QueryParams = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  }, [searchParams]);

  const setParams = (params: QueryParams): void => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        current.set(key, params[key]);
      }
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';

    router.push(`${window.location.pathname}${query}`);
  };

  const removeParam = (paramKey: string): void => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete(paramKey);

    const search = current.toString();
    const query = search ? `?${search}` : '';

    router.push(`${window.location.pathname}${query}`);
  };

  return {
    queryParams,
    setParams,
    removeParam,
  };
}

export default useQueryParams;
