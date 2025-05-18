import type { RawJobFromServer } from "~/lib/types";

// 목업 채용공고 데이터 (서버 응답 형태)
export const mockJobs: RawJobFromServer[] = [
  {
    id: "1",
    title: "프론트엔드 개발자",
    company: "NAVER",
    careers: ["경력"],
    employmentType: "정규직",
    startDate: "2025-04-01T00:00:00Z",
    endDate: "2025-04-30T23:59:59Z",
    url: "https://recruit.navercorp.com/naver/job/detail/developer",
  },
  {
    id: "2",
    title: "백엔드 개발자 (Python)",
    company: "NAVER",
    careers: ["신입"],
    employmentType: "정규직",
    startDate: "2025-04-01T00:00:00Z",
    endDate: "2025-04-30T23:59:59Z",
    url: "https://recruit.navercorp.com/naver/job/detail/developer",
  },
  {
    id: "3",
    title: "프론트엔드 개발자 (React)",
    company: "KAKAO",
    career: "경력", // 단수 형태 - 카카오 API 응답과 유사
    employmentType: "정규직",
    period: "채용 마감 기한 없음", // period 필드 - 카카오 API 응답과 유사
    url: "https://careers.kakao.com/jobs",
  },
  {
    id: "4",
    title: "백엔드 개발자 (Java/Spring)",
    company: "KAKAO",
    careers: ["신입", "경력"],
    employmentType: "정규직",
    startDate: "2025-04-01T00:00:00Z",
    endDate: "2025-05-15T23:59:59Z",
    url: "https://careers.kakao.com/jobs",
  },
  {
    id: "5",
    title: "데이터 엔지니어",
    company: "LINE",
    careers: ["경력"],
    employmentType: "정규직",
    startDate: "2025-04-01T00:00:00Z",
    endDate: "2025-05-30T23:59:59Z",
    url: "https://careers.linecorp.com/jobs",
  },
  {
    id: "6",
    title: "모바일 앱 개발자 (iOS)",
    company: "LINE",
    careers: ["신입"],
    employmentType: "정규직",
    startDate: "2025-04-01T00:00:00Z",
    endDate: "2025-05-30T23:59:59Z",
    url: "https://careers.linecorp.com/jobs",
  },
  {
    id: "7",
    title: "인턴 프로그래머",
    company: "NAVER",
    careers: ["인턴"],
    employmentType: "비정규직",
    // Firebase Timestamp 형태 - 네이버 API 응답과 유사
    startDate: {
      _seconds: 1747008000,
      _nanoseconds: 0
    },
    endDate: {
      _seconds: 1747526400,
      _nanoseconds: 0
    },
    url: "https://recruit.navercorp.com/naver/job/detail/developer",
  },
  {
    id: "8",
    title: "DevOps 엔지니어",
    company: "KAKAO",
    career: "경력",
    employmentType: "정규직",
    period: "상시채용",
    url: "https://careers.kakao.com/jobs",
  },
  {
    id: "9",
    title: "게임 프로그래머",
    company: "LINE",
    careers: ["신입", "경력"],
    employmentType: "정규직",
    startDate: "2025-04-01T00:00:00Z",
    endDate: "2025-06-15T23:59:59Z",
    url: "https://careers.linecorp.com/jobs",
  },
  {
    id: "10",
    title: "UX/UI 디자이너",
    company: "NAVER",
    careers: ["경력"],
    employmentType: "정규직",
    startDate: "2025-04-01T00:00:00Z",
    endDate: "2025-05-15T23:59:59Z",
    url: "https://recruit.navercorp.com/naver/job/detail/developer",
  },
  {
    id: "11",
    title: "대규모 실시간 유저 활동 데이터 서빙 시스템(ActionBase) 개발 (경력)",
    company: "KAKAO",
    career: "경력",
    employmentType: "정규직",
    period: "채용 마감 기한 없음",
    url: "https://careers.kakao.com/jobs/P-13900"
  },
  {
    id: "12",
    title: "DKOS(Kubernetes as a Service) 개발자 (경력)",
    company: "KAKAO",
    career: "경력",
    employmentType: "정규직",
    period: "채용 마감 기한 없음",
    url: "https://careers.kakao.com/jobs/P-13639"
  }
];

// 지원하는 회사 목록
export const mockCompanies = ["NAVER", "KAKAO", "LINE"];