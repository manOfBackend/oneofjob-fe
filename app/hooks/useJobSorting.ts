import { useState, useMemo } from 'react';
import type { Job, SortOption } from '~/lib/types';

export function useJobSorting(jobs: Job[]) {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  
  const sortedJobs = useMemo(() => {
    const jobsCopy = [...jobs];
    
    switch (sortBy) {
      case 'recent':
        return jobsCopy.sort((a, b) => {
          const dateA = new Date(a.startDate || '1970-01-01');
          const dateB = new Date(b.startDate || '1970-01-01');
          return dateB.getTime() - dateA.getTime();
        });
      case 'deadline':
        return jobsCopy.sort((a, b) => {
          const dateA = new Date(a.endDate || '9999-12-31');
          const dateB = new Date(b.endDate || '9999-12-31');
          return dateA.getTime() - dateB.getTime();
        });
      case 'company':
        return jobsCopy.sort((a, b) => a.company.localeCompare(b.company));
      default:
        return jobsCopy;
    }
  }, [jobs, sortBy]);
  
  return {
    sortBy,
    setSortBy,
    sortedJobs,
  };
}