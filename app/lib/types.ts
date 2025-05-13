/**
 * 채용 공고 경력 타입
 */
export type CareerType = "신입" | "경력" | "인턴";

/**
 * 채용 공고 고용 형태
 */
export type EmploymentType = "정규직" | "비정규직";

/**
 * 채용 공고 필터 파라미터
 */
export interface JobFilter {
  career?: CareerType;
  company?: string;
  employmentType?: EmploymentType;
  period?: string;
  title?: string;
}

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
