import { memo } from 'react';
import { Badge } from '~/components/ui/Badge';
import type { Job } from '~/lib/types';
import { CAREER_BADGE_VARIANTS } from '~/lib/types';

interface JobCardProps {
  job: Job;
  className?: string;
}

export const JobCard = memo<JobCardProps>(({ job, className = '' }) => {
  const calculateRemainingDays = (endDateString?: string) => {
    if (!endDateString) return '상시채용';
    
    const endDate = new Date(endDateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '마감됨';
    if (diffDays === 0) return '오늘 마감';
    return `${diffDays}일 남음`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '미정';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const remainingDays = calculateRemainingDays(job.endDate);
  const isExpired = job.endDate && new Date(job.endDate) < new Date();

  return (
    <article className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center gap-6">
        <div className="flex-shrink-0">
          <div className="h-16 w-16 rounded-lg overflow-hidden bg-white p-2">
            <img
              src={`/images/companies/${job.company.toLowerCase()}.svg`}
              alt={`${job.company} 로고`}
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/companies/default.svg';
              }}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {job.title}
              </h3>
              <p className="text-base text-gray-600 mt-1">{job.company}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {job.careers.map((career) => (
                  <Badge
                    key={career}
                    variant={CAREER_BADGE_VARIANTS[career]}
                    size="sm"
                  >
                    {career}
                  </Badge>
                ))}
                <Badge size="sm">
                  {job.employmentType}
                </Badge>
              </div>
            </div>

            <div className="text-right ml-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isExpired
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {remainingDays}
              </div>
              <div className="text-sm text-gray-500 mt-2 space-y-1">
                <div>기간: {formatDate(job.startDate)} ~ {formatDate(job.endDate)}</div>
                <div>등록: {formatDate(job.startDate)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            지원하기
            <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
});