import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import MainLayout from '~/components/layout/MainLayout';
import { JobsApi, CompaniesApi } from '~/lib/api';
import type { Job } from '~/lib/types';
import JobCard from '~/components/jobs/JobCard';
import Button from '~/components/common/Button';

export const meta: MetaFunction = () => {
  return [
    { title: "OneOfJob - 개발자를 위한 채용 정보 플랫폼" },
    { name: "description", content: "네이버, 카카오, 라인 등 다양한 IT 기업의 채용 정보를 한눈에 확인하세요." },
  ];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function loader({ request }: LoaderFunctionArgs) {
  // 최신 채용공고 6개 가져오기
  const jobs = await JobsApi.getAll();
  const latestJobs = jobs.slice(0, 6);
  
  // 회사 목록 가져오기
  const companies = await CompaniesApi.getAll();
  
  return json({
    latestJobs,
    companies,
  });
}

export default function Index() {
  const { latestJobs, companies } = useLoaderData<typeof loader>();
  
  return (
    <MainLayout>
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-500 py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              IT 기업 채용 정보를<br />한눈에 확인하세요
            </h1>
            <p className="mt-6 text-xl">
              네이버, 카카오, 라인 등 다양한 기업의 채용 정보를 제공합니다.
              원하는 기업의 채용 정보를 쉽고 빠르게 찾아보세요.
            </p>
            <div className="mt-10">
              <Link to="/jobs">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  채용공고 보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* 최신 채용공고 섹션 */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">최신 채용공고</h2>
            <Link 
              to="/jobs" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              전체보기 →
            </Link>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestJobs.map((job: Job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          
          {latestJobs.length === 0 && (
            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-500">
                현재 등록된 채용공고가 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* 회사별 채용정보 섹션 */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">회사별 채용정보</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            다양한 회사의 채용정보를 확인하고 지원해 보세요.
          </p>
          
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {companies.map((company) => (
              <Link
                key={company}
                to={`/jobs?company=${company}`}
                className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-sm transition-all hover:shadow-md"
              >
                <div className="h-16 w-16 rounded-full bg-gray-200 p-2">
                  <img
                    src={`/images/companies/${company.toLowerCase()}.svg`}
                    alt={`${company} 로고`}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/companies/default.svg';
                    }}
                  />
                </div>
                <h3 className="mt-4 font-medium text-gray-900">{company}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}