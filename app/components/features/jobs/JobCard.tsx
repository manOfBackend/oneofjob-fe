import { memo, useState } from 'react';
import { Badge } from '~/components/ui/Badge';
import type { Job } from '~/lib/types';
import { CAREER_BADGE_VARIANTS } from '~/lib/types';

interface JobCardProps {
  job: Job;
  className?: string;
}

// 컴포넌트 로고 분리로 재사용성과 에러 처리 강화
const CompanyLogo = memo<{ company: string; size?: 'sm' | 'md' | 'lg' }>(
  ({ company, size = 'md' }) => {
    const [logoError, setLogoError] = useState(false);
    
    const sizeClasses = {
      sm: 'h-10 w-10',
      md: 'h-16 w-16',
      lg: 'h-20 w-20'
    };

    return (
      <div className={`${sizeClasses[size]} rounded-lg overflow-hidden bg-gray-50 p-2 flex-shrink-0`}>
        <img
          src={logoError ? '/images/companies/default.svg' : `/images/companies/${company.toLowerCase()}.svg`}
          alt={`${company} 로고`}
          className="h-full w-full object-contain"
          onError={() => setLogoError(true)}
          loading="lazy"
        />
      </div>
    );
  }
);

export const JobCard = memo<JobCardProps>(({ job, className = '' }) => {
  const calculateRemainingDays = (endDateString?: string) => {
    if (!endDateString) return null;
    
    const endDate = new Date(endDateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 1년(365일) 이상인 경우 기한 없음으로 처리
    if (diffDays > 365) return '기한 없음';
    if (diffDays < 0) return '마감됨';
    if (diffDays === 0) return '오늘 마감';
    if (diffDays === 1) return '내일 마감';
    return `${diffDays}일 남음`;
  };

  const formatDate = (dateString?: string, options?: { short?: boolean }) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const formatOptions: Intl.DateTimeFormatOptions = options?.short
      ? { month: 'short', day: 'numeric' }
      : { year: 'numeric', month: 'long', day: 'numeric' };
    
    return new Intl.DateTimeFormat('ko-KR', formatOptions).format(date);
  };

  // 마감 정보 계산 (개선된 로직)
  const getDeadlineInfo = () => {
    if (job.period?.includes('채용 마감 기한 없음') || job.period?.includes('상시채용')) {
      return '상시채용';
    }
    
    if (job.period) {
      return job.period;
    }
    
    const remainingDays = calculateRemainingDays(job.endDate);
    return remainingDays || '상시채용';
  };

  // 기간 정보 표시 (모바일용 단축 버전 포함)
  const getDateRangeInfo = (short = false) => {
    if (job.period?.includes('채용 마감 기한 없음')) {
      return '상시채용';
    }
    
    if (job.period) {
      return job.period;
    }
    
    const startDate = formatDate(job.startDate, { short });
    const endDate = formatDate(job.endDate, { short });
    
    if (startDate && endDate) {
      return short ? `${startDate} ~ ${endDate}` : `${startDate} ~ ${endDate}`;
    } else if (startDate) {
      return `${startDate}부터`;
    } else if (endDate) {
      return `${endDate}까지`;
    } else {
      return '상시채용';
    }
  };

  const deadlineInfo = getDeadlineInfo();
  const dateRangeInfo = getDateRangeInfo();
  const dateRangeInfoShort = getDateRangeInfo(true);
  const isExpired = job.endDate && new Date(job.endDate) < new Date();
  const isUrgent = deadlineInfo.includes('일 남음') && 
    parseInt(deadlineInfo.match(/\d+/)?.[0] || '999') <= 7;

  // 마감 상태에 따른 스타일 결정
  const getDeadlineStyle = () => {
    if (isExpired) return 'bg-red-100 text-red-800 border border-red-200';
    if (isUrgent) return 'bg-orange-100 text-orange-800 border border-orange-200';
    if (deadlineInfo === '상시채용' || deadlineInfo === '기한 없음') {
      return 'bg-green-100 text-green-800 border border-green-200';
    }
    return 'bg-blue-100 text-blue-800 border border-blue-200';
  };

  return (
    <article className={`
      bg-white rounded-lg shadow-sm border border-gray-200 
      hover:shadow-md hover:border-gray-300 
      transition-all duration-200 ease-in-out
      ${className}
    `}>
      {/* 데스크톱 레이아웃 */}
      <div className="hidden sm:block p-6">
        <div className="flex items-center gap-6">
          <CompanyLogo company={job.company} size="md" />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-base text-gray-600 mt-1 font-medium">{job.company}</p>
                
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
                  <Badge size="sm" variant="default">
                    {job.employmentType}
                  </Badge>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className={`
                  inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                  ${getDeadlineStyle()}
                `}>
                  <span className="relative">
                    {deadlineInfo}
                    {isUrgent && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-2 space-y-1">
                  <div>기간: {dateRangeInfo}</div>
                  {job.startDate && (
                    <div>등록: {formatDate(job.startDate)}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${job.title} 채용공고 지원하기`}
              className="
                inline-flex items-center px-4 py-2 
                border border-transparent text-sm font-medium rounded-lg 
                text-white bg-blue-600 
                hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 transition-all duration-200
                shadow-sm hover:shadow
              "
            >
              지원하기
              <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="block sm:hidden p-4">
        <div className="space-y-4">
          {/* 헤더: 로고 + 회사명 + 마감정보 */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <CompanyLogo company={job.company} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">{job.company}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  등록: {formatDate(job.startDate, { short: true }) || '날짜 미정'}
                </p>
              </div>
            </div>
            <div className={`
              px-2.5 py-1 rounded-full text-xs font-medium text-center
              ${getDeadlineStyle()}
            `}>
              <span className="relative">
                {deadlineInfo}
                {isUrgent && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                )}
              </span>
            </div>
          </div>

          {/* 제목 */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
              {job.title}
            </h3>
          </div>

          {/* 태그들 */}
          <div className="flex flex-wrap gap-1.5">
            {job.careers.map((career) => (
              <Badge
                key={career}
                variant={CAREER_BADGE_VARIANTS[career]}
                size="sm"
              >
                {career}
              </Badge>
            ))}
            <Badge size="sm" variant="default">
              {job.employmentType}
            </Badge>
          </div>

          {/* 기간 정보 */}
          <div className="text-xs text-gray-500">
            기간: {dateRangeInfoShort}
          </div>

          {/* 지원 버튼 */}
          <div className="pt-2">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${job.title} 채용공고 지원하기`}
              className="
                w-full inline-flex items-center justify-center px-4 py-2.5
                border border-transparent text-sm font-medium rounded-lg 
                text-white bg-blue-600 
                hover:bg-blue-700 active:bg-blue-800
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-all duration-200
                shadow-sm
              "
            >
              지원하기
              <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
});

CompanyLogo.displayName = 'CompanyLogo';
JobCard.displayName = 'JobCard';