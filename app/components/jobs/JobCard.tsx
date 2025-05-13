import { Link } from '@remix-run/react';
import type { Job } from '~/lib/types';

const companyLogos: Record<string, string> = {
  'NAVER': '/images/companies/naver.svg',
  'KAKAO': '/images/companies/kakao.svg',
  'LINE': '/images/companies/line.svg',
  'default': '/images/companies/default.svg',
};

interface JobCardProps {
  job: Job;
  className?: string;
}

export default function JobCard({ job, className = '' }: JobCardProps) {
  const {
    id,
    title,
    company,
    careers,
    employmentType,
    endDate,
  } = job;

  // 마감 일자 계산 및 표시
  const formatDeadline = () => {
    if (!endDate) return '상시 채용';
    
    const deadline = new Date(endDate);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    
    if (diffDays < 0) return '마감됨';
    if (diffDays === 0) return '오늘 마감';
    return `${diffDays}일 남음`;
  };

  const companyLogo = companyLogos[company] || companyLogos.default;

  const careerBadgeStyles: Record<string, string> = {
    '신입': 'bg-green-100 text-green-800',
    '경력': 'bg-blue-100 text-blue-800',
    '인턴': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Link 
      to={`/jobs/${id}`}
      className={`block group rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src={companyLogo}
                alt={`${company} 로고`}
                className="h-full w-full object-contain p-1"
              />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600 line-clamp-1">
                {title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{company}</p>
            </div>
          </div>
          <div className="ml-2 text-sm text-right">
            <span className={`
              inline-flex rounded-full px-2.5 py-0.5 font-medium
              ${endDate && new Date(endDate) < new Date() ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}
            `}>
              {formatDeadline()}
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {careers.map((career) => (
            <span
              key={career}
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${careerBadgeStyles[career] || 'bg-gray-100 text-gray-800'}`}
            >
              {career}
            </span>
          ))}
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {employmentType}
          </span>
        </div>
      </div>
    </Link>
  );
}