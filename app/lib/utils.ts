/**
 * 날짜 형식화
 * @param dateString 날짜 문자열
 * @param options 포맷 옵션
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(
  dateString?: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  if (!dateString) return "미정";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", options).format(date);
  } catch (error) {
    console.error("날짜 형식화 오류:", error);
    return "날짜 오류";
  }
}

/**
 * 남은 날짜 계산
 * @param endDateString 종료일 문자열
 * @returns 남은 날짜 표시 문자열
 */
export function calculateRemainingDays(endDateString?: string): string {
  if (!endDateString) return "상시채용";

  try {
    const endDate = new Date(endDateString);
    const today = new Date();

    // 시간 부분 제거하고 날짜만 비교
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "마감됨";
    if (diffDays === 0) return "오늘 마감";
    return `${diffDays}일 남음`;
  } catch (error) {
    console.error("날짜 계산 오류:", error);
    return "날짜 오류";
  }
}

/**
 * 문자열 자르기
 * @param text 텍스트
 * @param maxLength 최대 길이
 * @returns 최대 길이로 잘린 텍스트
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * 검색어 하이라이트
 * @param text 원본 텍스트
 * @param query 검색어
 * @returns 하이라이트된 HTML
 */
export function highlightText(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
}

/**
 * 회사 로고 URL 생성
 * @param company 회사명
 * @returns 로고 URL
 */
export function getCompanyLogoUrl(company: string): string {
  return `/images/companies/${company.toLowerCase()}.svg`;
}

/**
 * 경력 타입에 따른 배지 스타일 클래스
 */
export const CAREER_BADGE_STYLES: Record<string, string> = {
  신입: "bg-green-100 text-green-800",
  경력: "bg-blue-100 text-blue-800",
  인턴: "bg-yellow-100 text-yellow-800",
};

/**
 * 클래스명 결합
 * @param classes 클래스명 배열
 * @returns 결합된 클래스명
 */
export function classNames(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
