/**
 * 채용 공고 경력 타입
 */
export type CareerType = '신입' | '경력' | '인턴';

/**
 * 채용 공고 고용 형태
 */
export type EmploymentType = '정규직' | '비정규직';

/**
 * Firebase Timestamp 타입
 */
export interface FirebaseTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

/**
 * 서버에서 오는 원본 채용 공고 데이터 (정규화 전)
 */
export interface RawJobFromServer {
  id: string;
  title: string;
  company: string;
  // career 또는 careers 필드가 혼재할 수 있음
  career?: CareerType;
  careers?: CareerType[];
  employmentType: EmploymentType;
  // 날짜는 Firebase Timestamp 객체 또는 문자열 형태
  startDate?: FirebaseTimestamp | string;
  endDate?: FirebaseTimestamp | string;
  // 일부 공고는 period 문자열만 가짐
  period?: string;
  url: string;
}

/**
 * 클라이언트에서 사용하는 정규화된 채용 공고 정보
 */
export interface Job {
  id: string;
  title: string;
  company: string;
  careers: CareerType[];
  employmentType: EmploymentType;
  startDate?: string; // ISO 문자열 형태로 정규화
  endDate?: string; // ISO 문자열 형태로 정규화
  period?: string; // 원본 period 필드 (예: "채용 마감 기한 없음")
  url: string;
}

/**
 * 채용 공고 필터 파라미터
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
  신입: 'success',
  경력: 'primary',
  인턴: 'warning',
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

/**
 * Firebase Timestamp를 Date 객체로 변환
 */
export function convertFirebaseTimestamp(
  timestamp: FirebaseTimestamp | string | undefined
): Date | undefined {
  if (!timestamp) return undefined;

  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }

  // Firebase Timestamp 객체인 경우
  if (typeof timestamp === 'object' && '_seconds' in timestamp) {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
  }

  return undefined;
}

/**
 * 서버에서 온 원본 Job 데이터를 클라이언트용으로 정규화
 */
export function normalizeJob(rawJob: RawJobFromServer): Job {
  // career 또는 careers 필드를 배열로 정규화
  let careers: CareerType[];
  if (rawJob.careers && Array.isArray(rawJob.careers)) {
    careers = rawJob.careers;
  } else if (rawJob.career) {
    careers = [rawJob.career];
  } else {
    careers = ['경력']; // 기본값
  }

  // Firebase Timestamp를 문자열로 변환
  const startDate = convertFirebaseTimestamp(rawJob.startDate);
  const endDate = convertFirebaseTimestamp(rawJob.endDate);

  return {
    id: rawJob.id,
    title: rawJob.title,
    company: rawJob.company,
    careers,
    employmentType: rawJob.employmentType,
    startDate: startDate ? startDate.toISOString() : undefined,
    endDate: endDate ? endDate.toISOString() : undefined,
    period: rawJob.period,
    url: rawJob.url,
  };
}
