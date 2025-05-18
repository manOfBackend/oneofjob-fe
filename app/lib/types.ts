
/**
 * 채용 공고 경력 타입
 */
export type CareerType = "신입" | "경력" | "인턴";

/**
 * 채용 공고 고용 형태
 */
export type EmploymentType = "정규직" | "비정규직";

/**
 * 채용 공고 정보
 */
export interface Job {
  id: string;
  title: string;
  company: string;
  careers: CareerType[];
  employmentType: EmploymentType;
  startDate?: string;
  endDate?: string;
  url: string;
}

/**
 * 채용 공고 필터 파라미터
 * 새로운 구조로 업데이트
 */
export interface JobFilter {
  companies: string[];
  careers: CareerType[];
  keyword: string;
}

/**
 * 정렬 옵션
 */
export type SortOption = 'recent' | 'deadline' | 'company';

/**
 * 정렬 옵션 정의
 */
export interface SortOptionConfig {
  value: SortOption;
  label: string;
}

/**
 * 회사 정보
 */
export interface Company {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * API 응답 타입
 */
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * 에러 응답 타입
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * 로딩 상태 타입
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Badge 컴포넌트 variant 타입
 */
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';

/**
 * Badge 컴포넌트 size 타입
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * 경력 타입별 배지 variant 매핑
 */
export const CAREER_BADGE_VARIANTS: Record<CareerType, BadgeVariant> = {
  '신입': 'success',
  '경력': 'primary',
  '인턴': 'warning',
};

/**
 * 정렬 옵션 설정
 */
export const SORT_OPTIONS: SortOptionConfig[] = [
  { value: 'recent', label: '최신 등록순' },
  { value: 'deadline', label: '마감 임박순' },
  { value: 'company', label: '회사명순' },
];

/**
 * 경력 옵션 목록
 */
export const CAREER_OPTIONS: CareerType[] = ['신입', '경력', '인턴'];