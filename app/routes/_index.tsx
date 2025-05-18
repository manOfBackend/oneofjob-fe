import { json } from '@remix-run/node';
import { useLoaderData, useNavigation } from '@remix-run/react';
import { Suspense, useState } from 'react';

import { FilterPanel } from '~/components/features/jobs/FilterPanel';
import { JobList } from '~/components/features/jobs/JobList';
import { SearchBar } from '~/components/features/jobs/SearchBar';
import { SortControls } from '~/components/features/jobs/SortControls';
import { Header } from '~/components/layout/Header';
import { Badge } from '~/components/ui/Badge';
import { useJobFilters } from '~/hooks/useJobFilters';
import { useJobSorting } from '~/hooks/useJobSorting';
import { getCachedCompanies, getCachedJobs, getCacheInfo } from '~/lib/cache.server';
import { CAREER_OPTIONS } from '~/lib/types';

import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import type { CareerType } from '~/lib/types';

export const meta: MetaFunction = () => {
  return [
    { title: 'OneOfJob - IT 기업 채용 정보' },
    {
      name: 'description',
      content: '네이버, 카카오, 라인 등 IT 기업의 최신 채용 정보를 한눈에 확인하세요.',
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // URL에서 필터 파라미터 추출
  const companies = url.searchParams.getAll('company');
  const careers = url.searchParams.getAll('career') as CareerType[];
  const keyword = url.searchParams.get('keyword') || '';

  // 🚀 캐시된 데이터 사용 (Firebase 호출 최소화)
  const startTime = performance.now();
  const [allJobs, allCompanies] = await Promise.all([getCachedJobs(), getCachedCompanies()]);
  const loadTime = performance.now() - startTime;

  // 서버에서 필터링 (클라이언트 번들 크기 최적화)
  let filteredJobs = allJobs;

  if (companies.length > 0) {
    filteredJobs = filteredJobs.filter(job => companies.includes(job.company));
  }

  if (careers.length > 0) {
    filteredJobs = filteredJobs.filter(job => job.careers.some(career => careers.includes(career)));
  }

  if (keyword) {
    const searchTerm = keyword.toLowerCase();
    filteredJobs = filteredJobs.filter(
      job =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm)
    );
  }

  // 캐시 정보와 성능 메트릭 포함
  return json({
    jobs: filteredJobs,
    allCompanies,
    totalCount: allJobs.length,
    cacheInfo: getCacheInfo(),
    performanceMetrics: {
      loadTime: Math.round(loadTime),
      timestamp: new Date().toISOString(),
    },
  });
}

export default function IndexPage() {
  const { jobs, allCompanies, totalCount, cacheInfo, performanceMetrics } =
    useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [localKeyword, setLocalKeyword] = useState('');

  const { filters, toggleFilter, setKeyword, clearAllFilters } = useJobFilters();
  const { sortBy, setSortBy, sortedJobs } = useJobSorting(jobs);

  const hasActiveFilters =
    filters.companies.length > 0 || filters.careers.length > 0 || filters.keyword;

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header totalCount={totalCount} filteredCount={sortedJobs.length} />

      {/* 캐시 상태 표시 (개발 환경에서만) */}
      {process.env.NODE_ENV === 'development' && (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
          <CacheStatusBanner cacheInfo={cacheInfo} performanceMetrics={performanceMetrics} />
        </div>
      )}

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <section className='mb-8 space-y-6'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
                    <svg
                      className='w-5 h-5 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className='text-lg font-semibold text-gray-900'>검색 & 필터</h2>
                    <p className='text-sm text-gray-500'>
                      {sortedJobs.length}개의 채용공고 {hasActiveFilters && '필터링됨'}
                    </p>
                  </div>
                </div>

                {/* Compact filter display when collapsed */}
                {!isFilterExpanded && hasActiveFilters && (
                  <div className='flex items-center gap-2 flex-wrap'>
                    {filters.keyword && (
                      <Badge variant='primary' size='sm'>
                        "{filters.keyword}"
                      </Badge>
                    )}
                    {filters.companies.slice(0, 2).map(company => (
                      <Badge key={company} variant='primary' size='sm'>
                        {company}
                      </Badge>
                    ))}
                    {filters.companies.length > 2 && (
                      <Badge size='sm'>+{filters.companies.length - 2}개 회사</Badge>
                    )}
                    {filters.careers.map(career => (
                      <Badge key={career} variant='success' size='sm'>
                        {career}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <SearchBar
              keyword={localKeyword}
              onKeywordChange={keyword => {
                setLocalKeyword(keyword);
                setKeyword(keyword);
              }}
              onFocus={() => setIsFilterExpanded(true)}
              className='mt-4'
            />
          </div>

          <Suspense fallback={<div>Loading filters...</div>}>
            <FilterPanel
              isExpanded={isFilterExpanded}
              filters={filters}
              companies={allCompanies}
              careers={CAREER_OPTIONS}
              onToggleFilter={toggleFilter}
              onClearAll={() => {
                clearAllFilters();
                setLocalKeyword('');
              }}
              onCollapse={() => setIsFilterExpanded(false)}
            />
          </Suspense>
        </section>

        <section>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-gray-900'>채용공고 {sortedJobs.length}건</h2>

            <SortControls sortBy={sortBy} onSortChange={setSortBy} />
          </div>

          <Suspense fallback={<div className='text-center py-12'>Loading jobs...</div>}>
            <JobList
              jobs={sortedJobs}
              isLoading={isLoading}
              onClearFilters={() => {
                clearAllFilters();
                setLocalKeyword('');
              }}
            />
          </Suspense>
        </section>
      </main>
    </div>
  );
}

// 캐시 상태 배너 컴포넌트 (개발용)
function CacheStatusBanner({
  cacheInfo,
  performanceMetrics,
}: {
  cacheInfo: any;
  performanceMetrics: any;
}) {
  return (
    <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <span className='font-medium text-blue-900'>🚀 성능 정보</span>
          <span className='text-blue-700'>
            로드 시간: <strong>{performanceMetrics.loadTime}ms</strong>
          </span>
          <span className='text-blue-700'>
            캐시: <strong>{cacheInfo.jobs.cached ? 'HIT' : 'MISS'}</strong>
          </span>
          <span className='text-blue-700'>
            데이터: <strong>{cacheInfo.jobs.size}개 공고</strong>
          </span>
        </div>
        <span className='text-blue-600 text-xs'>
          다음 업데이트: {new Date(cacheInfo.nextUpdate).toLocaleString('ko-KR')}
        </span>
      </div>
    </div>
  );
}
