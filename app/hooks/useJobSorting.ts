
import { useState, useMemo } from 'react';
import type { Job, SortOption } from '~/lib/types';

export function useJobSorting(jobs: Job[]) {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  
  const sortedJobs = useMemo(() => {
    const jobsCopy = [...jobs];
    
    switch (sortBy) {
      case 'recent':
        return jobsCopy.sort((a, b) => {
          // startDate가 없으면 오래된 것으로 간주
          const dateA = a.startDate ? new Date(a.startDate) : new Date('1970-01-01');
          const dateB = b.startDate ? new Date(b.startDate) : new Date('1970-01-01');
          return dateB.getTime() - dateA.getTime();
        });
        
      case 'deadline':
        return jobsCopy.sort((a, b) => {
          // 마감일이 없거나 period가 "상시채용"/"채용 마감 기한 없음"인 경우
          const hasNoDeadlineA = !a.endDate || a.period?.includes('채용 마감 기한 없음');
          const hasNoDeadlineB = !b.endDate || b.period?.includes('채용 마감 기한 없음');
          
          // 둘 다 마감일이 없으면 최신순
          if (hasNoDeadlineA && hasNoDeadlineB) {
            const dateA = a.startDate ? new Date(a.startDate) : new Date('1970-01-01');
            const dateB = b.startDate ? new Date(b.startDate) : new Date('1970-01-01');
            return dateB.getTime() - dateA.getTime();
          }
          
          // 하나만 마감일이 없으면 마감일이 있는 것을 앞에
          if (hasNoDeadlineA) return 1;
          if (hasNoDeadlineB) return -1;
          
          // 둘 다 마감일이 있으면 마감일 순
          const dateA = new Date(a.endDate!);
          const dateB = new Date(b.endDate!);
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