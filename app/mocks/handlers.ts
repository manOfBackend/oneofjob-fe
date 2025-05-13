/* eslint-disable @typescript-eslint/no-explicit-any */
import { delay, http, HttpResponse } from "msw";
import { mockCompanies, mockJobs } from "./data";

// API 경로 설정
const API_URL = "http://localhost:3000";

export const handlers = [
  // 모든 채용공고 조회
  http.get(`${API_URL}/jobs`, async ({ request }) => {
    // 1초 지연 (로딩 상태 테스트용)
    await delay(1000);

    const url = new URL(request.url);
    const company = url.searchParams.get("company");
    const career = url.searchParams.get("career");
    const employmentType = url.searchParams.get("employmentType");
    const title = url.searchParams.get("title");

    // 필터링 로직
    let filteredJobs = [...mockJobs];

    if (company) {
      filteredJobs = filteredJobs.filter((job) => job.company === company);
    }

    if (career) {
      filteredJobs = filteredJobs.filter((job) =>
        job.careers.includes(career as any)
      );
    }

    if (employmentType) {
      filteredJobs = filteredJobs.filter(
        (job) => job.employmentType === employmentType
      );
    }

    if (title) {
      filteredJobs = filteredJobs.filter((job) =>
        job.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    return HttpResponse.json(filteredJobs);
  }),

  // 특정 ID의 채용공고 조회
  http.get(`${API_URL}/jobs/:id`, async ({ params }) => {
    // 0.5초 지연
    await delay(500);

    const { id } = params;
    const job = mockJobs.find((job) => job.id === id);

    if (!job) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(job);
  }),

  // 회사 목록 조회
  http.get(`${API_URL}/companies`, async () => {
    await delay(500);
    return HttpResponse.json(mockCompanies);
  }),
];
