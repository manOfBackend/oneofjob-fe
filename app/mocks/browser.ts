import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// 서비스 워커 설정
export const worker = setupWorker(...handlers);

// 서비스 워커 초기화 함수
export async function startMSW() {
  // 개발 환경에서만 MSW 초기화
  if (process.env.NODE_ENV === "development") {
    // 자세한 로그 출력 비활성화
    const options = { onUnhandledRequest: "bypass" as const };

    // 서비스 워커 시작
    await worker.start(options);

    console.log(
      "%c[MSW] Mock Service Worker 활성화 됨",
      "color:green;font-weight:bold;"
    );
  }
}
