import type { Job, JobFilter } from "./types";

/**
 * API 환경 설정
 */
const getApiBaseUrl = (): string => {

  if (import.meta.env.VITE_ENABLE_MOCKS === 'true' && import.meta.env.DEV) {
    return "http://localhost:3000";
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (apiUrl) {
    return apiUrl;
  }
  
  return "";
};

const API_BASE_URL = getApiBaseUrl();

/**
 * API 요청 설정
 */
const API_CONFIG = {
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "10000", 10),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * API 요청 헬퍼 함수
 */
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;
  
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
    // 타임아웃 설정 (fetch에는 기본 타임아웃이 없음)
    signal: AbortSignal.timeout(API_CONFIG.timeout),
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      // HTTP 에러 상태 처리
      const errorMessage = `API 요청 실패: ${response.status} ${response.statusText}`;
      console.error(errorMessage, { url, status: response.status });
      throw new Error(errorMessage);
    }

    // JSON 응답 파싱
    const data = await response.json();
    return data;
  } catch (error) {
    // 네트워크 에러, 타임아웃 등 처리
    if (error instanceof Error) {
      console.error(`API 요청 오류 (${url}):`, error.message);
      throw error;
    }
    
    throw new Error(`알 수 없는 API 오류가 발생했습니다: ${endpoint}`);
  }
}

/**
 * 필터 쿼리 파라미터로 변환
 */
function convertFilterToQueryParams(filter?: JobFilter): string {
  if (!filter) return "";

  const params = new URLSearchParams();

  // companies 배열 처리
  if (filter.companies && filter.companies.length > 0) {
    filter.companies.forEach(company => {
      params.append('company', company);
    });
  }

  // careers 배열 처리  
  if (filter.careers && filter.careers.length > 0) {
    filter.careers.forEach(career => {
      params.append('career', career);
    });
  }

  // keyword 처리
  if (filter.keyword && filter.keyword.trim()) {
    params.append('keyword', filter.keyword.trim());
  }

  return params.toString();
}

/**
 * 채용 공고 API 클라이언트
 */
export const JobsApi = {
  /**
   * 모든 채용 공고 조회
   */
  async getAll(filter?: JobFilter): Promise<Job[]> {
    const queryParams = convertFilterToQueryParams(filter);
    const endpoint = `/jobs${queryParams ? `?${queryParams}` : ""}`;

    return apiRequest<Job[]>(endpoint);
  },

  /**
   * 특정 채용 공고 조회
   */
  async getById(id: string): Promise<Job> {
    return apiRequest<Job>(`/jobs/${id}`);
  },

  /**
   * 회사별 채용 공고 조회
   */
  async getByCompany(company: string): Promise<Job[]> {
    return this.getAll({ companies: [company], careers: [], keyword: "" });
  },

  /**
   * 경력 타입별 채용 공고 조회
   */
  async getByCareer(career: string): Promise<Job[]> {
    return this.getAll({ 
      companies: [], 
      careers: [career as any], 
      keyword: "" 
    });
  },
};

/**
 * 회사 API 클라이언트
 */
export const CompaniesApi = {
  /**
   * 지원하는 모든 회사 목록 조회
   * TODO: 백엔드에서 실제 엔드포인트 구현되면 수정
   */
  async getAll(): Promise<string[]> {
    try {
      // 실제 API 엔드포인트가 있다면 사용
      // return apiRequest<string[]>('/companies');
      
      // 현재는 하드코딩된 회사명 목록 리턴
      return ["NAVER", "KAKAO", "LINE", "WOOWAHAN"];
    } catch (error) {
      console.warn('회사 목록 API 호출 실패, 기본값 사용:', error);
      return ["NAVER", "KAKAO", "LINE", "WOOWAHAN"];
    }
  },
};

/**
 * API 상태 확인
 */
export const HealthApi = {
  /**
   * API 서버 상태 확인
   */
  async check(): Promise<{ status: string; timestamp: string }> {
    try {
      return apiRequest<{ status: string; timestamp: string }>('/health');
    } catch (error) {
      console.warn('Health check 실패:', error);
      return { 
        status: 'unknown', 
        timestamp: new Date().toISOString() 
      };
    }
  },
};

// 디버깅용: 현재 API 설정 로그
if (import.meta.env.DEV) {
  console.log('🔗 API Configuration:', {
    baseUrl: API_BASE_URL,
    enableMocks: import.meta.env.VITE_ENABLE_MOCKS,
    timeout: API_CONFIG.timeout,
  });
}