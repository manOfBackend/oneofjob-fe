import { memo } from 'react';

import { JobCard } from './JobCard';

import type { Job } from '~/lib/types';

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
  onClearFilters?: () => void;
  className?: string;
}

export const JobList = memo<JobListProps>(
  ({ jobs, isLoading = false, onClearFilters, className = '' }) => {
    if (isLoading) {
      return (
        <div className={`flex items-center justify-center py-12 ${className}`}>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600' />
          <span className='ml-2 text-gray-600'>검색 중...</span>
        </div>
      );
    }

    if (jobs.length === 0) {
      return (
        <div className={`text-center py-12 ${className}`}>
          <div className='max-w-sm mx-auto'>
            <svg
              className='mx-auto h-12 w-12 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-6-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
              />
            </svg>
            <h3 className='mt-4 text-lg font-medium text-gray-900'>검색 결과 없음</h3>
            <p className='mt-2 text-gray-500'>
              조건에 맞는 채용공고가 없습니다.
              <br />
              필터를 조정해서 다시 시도해보세요.
            </p>
            {onClearFilters && (
              <button
                onClick={onClearFilters}
                className='mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors'
              >
                모든 필터 초기화
              </button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={`space-y-4 ${className}`}>
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    );
  }
);
