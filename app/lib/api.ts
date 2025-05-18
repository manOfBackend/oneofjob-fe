import type { Job, JobFilter, RawJobFromServer } from "./types";
import { normalizeJob } from "./types";
import { getApiUrl, validateEnvironment } from "./env";

// 환경변수 검증 (앱 시작 시)
validateEnvironment();

/**
 * API 클라이언트 설정
 */
const API_CONFIG = {
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * HTTP 클라이언트 클래스
 */
class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: typeof API_CONFIG) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = config.headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status.toString(),
          { url, config }
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // 네트워크 에러 등
      throw new ApiError(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'NETWORK_ERROR',
        { url, config, originalError: error }
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * HTTP 클라이언트 인스턴스
 */
const httpClient = new HttpClient(API_CONFIG);

/**
 * 필터 쿼리 파라미터로 변환
 */
function convertFilterToQueryParams(filter?: JobFilter): Record<string, string> {
  if (!filter) return {};

  const params: Record<string, string> = {};

  if (filter.keyword) {
    params.keyword = filter.keyword;
  }

  if (filter.companies.length > 0) {
    // 여러 값 처리 - API 설계에 따라 조정 필요
    filter.companies.forEach((company, index) => {
      params[`company[${index}]`] = company;
    });
  }

  if (filter.careers.length > 0) {
    // 여러 값 처리 - API 설계에 따라 조정 필요
    filter.careers.forEach((career, index) => {
      params[`career[${index}]`] = career;
    });
  }

  return params;
}

/**
 * 채용 공고 API 클라이언트
 */
export const JobsApi = {
  /**
   * 모든 채용 공고 조회
   */
  async getAll(filter?: JobFilter): Promise<Job[]> {
    const params = convertFilterToQueryParams(filter);
    const rawJobs = await httpClient.get<RawJobFromServer[]>('/jobs', params);
    
    // 서버 데이터를 클라이언트용으로 정규화
    return rawJobs.map(normalizeJob);
  },

  /**
   * 특정 채용 공고 조회
   */
  async getById(id: string): Promise<Job> {
    const rawJob = await httpClient.get<RawJobFromServer>(`/jobs/${id}`);
    return normalizeJob(rawJob);
  },

  /**
   * 회사별 채용 공고 조회
   */
  async getByCompany(company: string): Promise<Job[]> {
    return this.getAll({ 
      companies: [company], 
      careers: [], 
      keyword: '' 
    });
  },

  /**
   * 경력 타입별 채용 공고 조회
   */
  async getByCareer(career: string): Promise<Job[]> {
    return this.getAll({ 
      companies: [], 
      careers: [career as any], 
      keyword: '' 
    });
  },
};

/**
 * 회사 API 클라이언트
 */
export const CompaniesApi = {
  /**
   * 지원하는 모든 회사 목록 조회
   */
  async getAll(): Promise<string[]> {
    try {
      return await httpClient.get<string[]>('/companies');
    } catch (error) {
      console.warn('Failed to fetch companies from server, using fallback:', error);
      
      // 실패 시 하드코딩된 회사명 목록 리턴
      return ["NAVER", "KAKAO", "LINE"];
    }
  },
};

/**
 * API 클라이언트 전체 내보내기
 */
export const api = {
  jobs: JobsApi,
  companies: CompaniesApi,
} as const;

// 디버깅용 - 개발 환경에서만
if (import.meta.env.DEV) {
  (globalThis as any).__api__ = api;
  console.log('🔗 API client initialized:', API_CONFIG.baseURL);
}