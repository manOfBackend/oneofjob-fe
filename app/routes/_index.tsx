import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useSearchParams, Form, useNavigation } from '@remix-run/react';
import { useState, useMemo } from 'react';
import { JobsApi, CompaniesApi } from '~/lib/api';
import type { Job, CareerType } from '~/lib/types';

export const meta: MetaFunction = () => {
  return [
    { title: "OneOfJob - IT 기업 채용 정보" },
    { name: "description", content: "네이버, 카카오, 라인 등 IT 기업의 최신 채용 정보를 한눈에 확인하세요." },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  
  const companies = url.searchParams.getAll('company') || [];
  const careers = url.searchParams.getAll('career') || [];
  const keyword = url.searchParams.get('keyword') || '';
  
  const allJobs = await JobsApi.getAll();
  
  let filteredJobs = allJobs;
  
  if (companies.length > 0) {
    filteredJobs = filteredJobs.filter(job => companies.includes(job.company));
  }
  
  if (careers.length > 0) {
    filteredJobs = filteredJobs.filter(job => 
      job.careers.some(career => careers.includes(career))
    );
  }
  
  if (keyword) {
    filteredJobs = filteredJobs.filter(job =>
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.company.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  const allCompanies = await CompaniesApi.getAll();
  
  return json({
    jobs: filteredJobs,
    allCompanies,
    filters: { companies, careers, keyword },
    totalCount: allJobs.length,
  });
}

const CAREER_OPTIONS: CareerType[] = ['신입', '경력', '인턴'];

const SORT_OPTIONS = [
  { value: 'recent', label: '최신 등록순' },
  { value: 'deadline', label: '마감 임박순' },
  { value: 'company', label: '회사명순' },
];

export default function Index() {
  const { jobs: serverJobs, allCompanies, filters, totalCount } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  
  const [keyword, setKeyword] = useState(filters.keyword);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  
  const jobs = useMemo(() => {
    const sortedJobs = [...serverJobs];
    
    switch (sortBy) {
      case 'recent':
        return sortedJobs.sort((a, b) => {
          const dateA = new Date(a.startDate || '1970-01-01');
          const dateB = new Date(b.startDate || '1970-01-01');
          return dateB.getTime() - dateA.getTime();
        });
      case 'deadline':
        return sortedJobs.sort((a, b) => {
          const dateA = new Date(a.endDate || '9999-12-31');
          const dateB = new Date(b.endDate || '9999-12-31');
          return dateA.getTime() - dateB.getTime();
        });
      case 'company':
        return sortedJobs.sort((a, b) => a.company.localeCompare(b.company));
      default:
        return sortedJobs;
    }
  }, [serverJobs, sortBy]);
  
  const toggleFilter = (type: 'company' | 'career', value: string) => {
    const currentValues = searchParams.getAll(type);
    const newParams = new URLSearchParams(searchParams);
    
    newParams.delete(type);
    
    if (currentValues.includes(value)) {
      currentValues.filter(v => v !== value).forEach(v => {
        newParams.append(type, v);
      });
    } else {
      [...currentValues, value].forEach(v => {
        newParams.append(type, v);
      });
    }
    
    setSearchParams(newParams);
  };
  
  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
  };
  
  const handleKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (keyword) {
      newParams.set('keyword', keyword);
    } else {
      newParams.delete('keyword');
    }
    setSearchParams(newParams);
  };
  
  const clearAllFilters = () => {
    setKeyword('');
    setSearchParams(new URLSearchParams());
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
  
  const careerBadgeStyles: Record<string, string> = {
    '신입': 'bg-green-100 text-green-800',
    '경력': 'bg-blue-100 text-blue-800',
    '인턴': 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-blue-600">OneOfJob</h1>
            <p className="text-sm text-gray-500">
              전체 {totalCount}건 | 필터링 {jobs.length}건
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!isFilterExpanded && (filters.companies.length > 0 || filters.careers.length > 0 || filters.keyword) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {filters.keyword && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        "{filters.keyword}"
                      </span>
                    )}
                    {filters.companies.slice(0, 2).map((company) => (
                      <span key={company} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {company}
                      </span>
                    ))}
                    {filters.companies.length > 2 && (
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{filters.companies.length - 2}개 회사
                      </span>
                    )}
                    {filters.careers.map((career) => (
                      <span key={career} className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {career}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleKeywordSubmit} className="mt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => setIsFilterExpanded(true)}
                  placeholder="원하는 채용공고를 검색해보세요..."
                  className="block w-full pl-12 pr-20 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-0 focus:outline-none transition-all placeholder-gray-400"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <button
                    type="submit"
                    className="h-8 w-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className={`transition-all duration-500 overflow-hidden ${
            isFilterExpanded 
              ? 'max-h-screen opacity-100 transform translate-y-0' 
              : 'max-h-0 opacity-0 transform -translate-y-4 pointer-events-none'
          }`}>
            <div className="space-y-6">
              {(filters.companies.length > 0 || filters.careers.length > 0 || filters.keyword) && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-blue-900 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.586V4z" />
                        </svg>
                        적용된 필터
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {filters.keyword && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm text-blue-800 border border-blue-200">
                            "{filters.keyword}"
                            <button
                              onClick={() => {
                                setKeyword('');
                                const newParams = new URLSearchParams(searchParams);
                                newParams.delete('keyword');
                                setSearchParams(newParams);
                              }}
                              className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        )}
                        {filters.companies.map((company) => (
                          <span key={company} className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm text-blue-800 border border-blue-200">
                            {company}
                            <button
                              onClick={() => toggleFilter('company', company)}
                              className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                        {filters.careers.map((career) => (
                          <span key={career} className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm text-blue-800 border border-blue-200">
                            {career}
                            <button
                              onClick={() => toggleFilter('career', career)}
                              className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={clearAllFilters}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      모든 필터 제거
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">회사</h3>
                    {filters.companies.length > 0 && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {filters.companies.length}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {allCompanies.map((company) => {
                      const isSelected = filters.companies.includes(company);
                      return (
                        <button
                          key={company}
                          onClick={() => toggleFilter('company', company)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {company}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM16 10h.01M16 14h.01M12 14h.01M8 14h.01M8 10h.01" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">직군</h3>
                    {filters.careers.length > 0 && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        {filters.careers.length}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {CAREER_OPTIONS.map((career) => {
                      const isSelected = filters.careers.includes(career);
                      return (
                        <button
                          key={career}
                          onClick={() => toggleFilter('career', career)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isSelected
                              ? 'bg-green-600 text-white shadow-md'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {career}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setIsFilterExpanded(false)}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <span>필터 숨기기</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            채용공고 {jobs.length}건
          </h2>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    sortBy === option.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">검색 중...</span>
          </div>
        )}

        {!isLoading && (
          <div className="space-y-4">
            {jobs.map((job: Job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
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
                            <span
                              key={career}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${careerBadgeStyles[career] || 'bg-gray-100 text-gray-800'}`}
                            >
                              {career}
                            </span>
                          ))}
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {job.employmentType}
                          </span>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          job.endDate && new Date(job.endDate) < new Date()
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {calculateRemainingDays(job.endDate)}
                        </div>
                        <div className="text-sm text-gray-500 mt-2">
                          <div>기간: {formatDate(job.startDate)} ~ {formatDate(job.endDate)}</div>
                          <div className="mt-1">등록: {formatDate(job.startDate)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      지원하기
                      <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {jobs.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-sm mx-auto">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-6-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">검색 결과 없음</h3>
                  <p className="mt-2 text-gray-500">
                    조건에 맞는 채용공고가 없습니다.<br />
                    필터를 조정해서 다시 시도해보세요.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
                  >
                    모든 필터 초기화
                  </button>
                </div>
              </div>
              )}
            </div>
          )}
        </div>
      </div>
    
  );
}