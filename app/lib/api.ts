import type { Job, JobFilter } from "./types";

/**
 * API 환경 설정
 */
const API_BASE_URL = process.env.API_URL || "http://localhost:3000";

/**
 * 필터 쿼리 파라미터로 변환
 */
function convertFilterToQueryParams(filter?: JobFilter): string {
  if (!filter) return "";

  const params = new URLSearchParams();

  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, value.toString());
    }
  });

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
    const url = `${API_BASE_URL}/jobs${queryParams ? `?${queryParams}` : ""}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.status}`);
    }

    return response.json();
  },

  /**
   * 특정 채용 공고 조회
   */
  async getById(id: string): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch job: ${response.status}`);
    }

    return response.json();
  },

  /**
   * 회사별 채용 공고 조회
   */
  async getByCompany(company: string): Promise<Job[]> {
    return this.getAll({ company });
  },

  /**
   * 경력 타입별 채용 공고 조회
   */
  async getByCareer(career: string): Promise<Job[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.getAll({ career: career as any });
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
    // 현재는 하드코딩된 회사명 목록 리턴
    return ["NAVER", "KAKAO", "LINE"];
  },
};
