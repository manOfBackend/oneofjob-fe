/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, useNavigation, useSearchParams } from '@remix-run/react';
import type { JobFilter } from '~/lib/types';
import Button from '~/components/common/Button';

interface JobFilterProps {
  companies: string[];
}

export default function JobFilter({ companies }: JobFilterProps) {
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === 'submitting';
  
  // 현재 URL의 쿼리 파라미터에서 필터 값 가져오기
  const currentFilter: JobFilter = {
    company: searchParams.get('company') || undefined,
    career: searchParams.get('career') as any || undefined,
    employmentType: searchParams.get('employmentType') as any || undefined,
    title: searchParams.get('title') || undefined,
  };

  return (
    <Form method="get" className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 회사 필터 */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            회사
          </label>
          <select
            id="company"
            name="company"
            defaultValue={currentFilter.company}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="">전체</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        {/* 경력 필터 */}
        <div>
          <label htmlFor="career" className="block text-sm font-medium text-gray-700">
            경력
          </label>
          <select
            id="career"
            name="career"
            defaultValue={currentFilter.career}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="">전체</option>
            <option value="신입">신입</option>
            <option value="경력">경력</option>
            <option value="인턴">인턴</option>
          </select>
        </div>

        {/* 고용 형태 필터 */}
        <div>
          <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
            고용 형태
          </label>
          <select
            id="employmentType"
            name="employmentType"
            defaultValue={currentFilter.employmentType}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="">전체</option>
            <option value="정규직">정규직</option>
            <option value="비정규직">비정규직</option>
          </select>
        </div>

        {/* 검색어 필터 */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            검색어
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={currentFilter.title}
            placeholder="공고 제목 검색"
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button
          type="reset"
          variant="outline"
          onClick={() => {
            setTimeout(() => {
              document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }, 0);
          }}
        >
          초기화
        </Button>
        <Button 
          type="submit" 
          isLoading={isSubmitting}
        >
          적용
        </Button>
      </div>
    </Form>
  );
}