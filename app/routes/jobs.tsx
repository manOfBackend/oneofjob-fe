/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import JobCard from '~/components/jobs/JobCard';
import JobFilter from '~/components/jobs/JobFilter';
import MainLayout from '~/components/layout/MainLayout';
import { CompaniesApi, JobsApi } from '~/lib/api';
import type { Job, JobFilter as JobFilterType } from '~/lib/types';

export const meta: MetaFunction = () => {
  return [
    { title: "채용공고 - OneOfJob" },
    { name: "description", content: "네이버, 카카오, 라인 등 다양한 IT 기업의 채용 정보를 한눈에 확인하세요." },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  
  // 쿼리 파라미터에서 필터 정보 추출
  const filter: JobFilterType = {
    company: url.searchParams.get('company') || undefined,
    career: url.searchParams.get('career') as any || undefined,
    employmentType: url.searchParams.get('employmentType') as any || undefined,
    title: url.searchParams.get('title') || undefined,
  };
  
  // 필터에 맞는 채용 공고 조회
  const jobs = await JobsApi.getAll(filter);
  
  // 회사 목록 조회
  const companies = await CompaniesApi.getAll();
  
  return json({
    jobs,
    companies,
    filter,
  });
}

export default function Jobs() {
  const { jobs, companies, filter } = useLoaderData<typeof loader>();
//   const [searchParams] = useSearchParams();
  
  // 필터링 조건 텍스트 생성
  const generateFilterText = (): string => {
    const filterParts = [];
    
    if (filter.company) {
      filterParts.push(`회사: ${filter.company}`);
    }
    
    if (filter.career) {
      filterParts.push(`경력: ${filter.career}`);
    }
    
    if (filter.employmentType) {
      filterParts.push(`고용형태: ${filter.employmentType}`);
    }
    
    if (filter.title) {
      filterParts.push(`제목: ${filter.title}`);
    }
    
    return filterParts.length > 0
      ? `${filterParts.join(' / ')} 조건으로 검색된 결과`
      : '전체 채용공고';
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">채용공고</h1>
          <p className="mt-2 text-gray-600">
            다양한 기업의 채용 정보를 확인하고 지원해 보세요.
          </p>
        </div>
        
        {/* 필터 섹션 */}
        <section className="mb-8">
          <JobFilter companies={companies} />
        </section>
        
        {/* 필터링 결과 정보 */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            {generateFilterText()}
          </h2>
          <p className="text-sm text-gray-500">
            총 <span className="font-medium">{jobs.length}</span>건의 채용공고
          </p>
        </div>
        
        {/* 채용공고 목록 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job: Job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        
        {/* 채용공고가 없는 경우 */}
        {jobs.length === 0 && (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              조건에 맞는 채용공고가 없습니다. 필터를 변경해서 다시 시도해 보세요.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}