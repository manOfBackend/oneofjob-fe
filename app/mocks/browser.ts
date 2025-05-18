
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { shouldUseMSW } from "~/lib/env";

export const worker = setupWorker(...handlers);

// 서비스 워커 초기화 함수
export async function startMSW() {
  if (!shouldUseMSW()) {
    return;
  }
  const options = { onUnhandledRequest: "bypass" as const };

  await worker.start(options);

  console.log(
    "%c[MSW] Mock Service Worker 활성화 됨",
    "color:green;font-weight:bold;"
  );
}