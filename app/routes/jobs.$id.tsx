import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Button from '~/components/ui/Button';
import MainLayout from '~/components/layout/MainLayout';
import { JobsApi } from '~/lib/api';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.job) {
    return [
      { title: '채용공고를 찾을 수 없습니다 - OneOfJob' },
      { name: 'description', content: '요청하신 채용공고를 찾을 수 없습니다.' },
    ];
  }
  
  return [
    { title: `${data.job.title} - ${data.job.company} | OneOfJob` },
    { name: 'description', content: `${data.job.company}의 ${data.job.title} 채용 정보를 확인하세요.` },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  
  if (!id) {
    throw new Response('Not Found', { status: 404 });
  }
  
  try {
    const job = await JobsApi.getById(id);
    return json({ job });
  } catch (error) {
    throw new Response('Not Found', { status: 404 });
  }
}

export default function JobDetail() {
  const { job } = useLoaderData<typeof loader>();
  
  // 날짜 형식화 함수
  const formatDate = (dateString?: string) => {
    if (!dateString) return '미정';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  // 남은 기간 계산
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
  
  // 회사 로고 URL
  const companyLogoUrl = `/images/companies/${job.company.toLowerCase()}.svg`;
  
  // 경력 타입에 따른 배지 스타일
  const careerBadgeStyles: Record<string, string> = {
    '신입': 'bg-green-100 text-green-800',
    '경력': 'bg-blue-100 text-blue-800',
    '인턴': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* 채용 정보 헤더 */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={companyLogoUrl}
                  alt={`${job.company} 로고`}
                  className="h-full w-full object-contain p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/companies/default.svg';
                  }}
                />
              </div>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="mt-1 text-lg text-gray-600">{job.company}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.careers.map((career) => (
                    <span
                      key={career}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${careerBadgeStyles[career] || 'bg-gray-100 text-gray-800'}`}
                    >
                      {career}
                    </span>
                  ))}
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                    {job.employmentType}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`
                  inline-flex rounded-md px-3 py-1 text-sm font-medium
                  ${job.endDate && new Date(job.endDate) < new Date() ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}
                `}>
                  {calculateRemainingDays(job.endDate)}
                </div>
              </div>
            </div>
          </div>
          
          {/* 채용 정보 상세 */}
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <h2 className="text-lg font-medium text-gray-900">지원 정보</h2>
                <dl className="mt-4 space-y-3">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">회사</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{job.company}</dd>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">경력</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{job.careers.join(', ')}</dd>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">고용형태</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{job.employmentType}</dd>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">접수기간</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {formatDate(job.startDate)} ~ {formatDate(job.endDate)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                자세한 내용은 아래 채용공고 원문을 확인하세요.
              </p>
            </div>
            
            <div className="mt-8 flex justify-center">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button size="lg">
                  채용공고 원문 보기
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}