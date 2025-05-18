import { useSearchParams } from '@remix-run/react';
import { useCallback, useMemo } from 'react';
import type { JobFilter, CareerType } from '~/lib/types';

export function useJobFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filters = useMemo((): JobFilter => ({
    companies: searchParams.getAll('company'),
    careers: searchParams.getAll('career') as CareerType[],
    keyword: searchParams.get('keyword') || '',
  }), [searchParams]);
  
  const toggleFilter = useCallback((type: 'company' | 'career', value: string) => {
    const currentValues = searchParams.getAll(type);
    const newParams = new URLSearchParams(searchParams);
    
    newParams.delete(type);
    
    if (currentValues.includes(value)) {
      currentValues.filter(v => v !== value).forEach(v => {
        newParams.append(type, v);
      });
    } else {
      [...currentValues, value].forEach(v => {
        newParams.append(type, v);
      });
    }
    
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);
  
  const setKeyword = useCallback((keyword: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (keyword) {
      newParams.set('keyword', keyword);
    } else {
      newParams.delete('keyword');
    }
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);
  
  const clearAllFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);
  
  return {
    filters,
    toggleFilter,
    setKeyword,
    clearAllFilters,
  };
}