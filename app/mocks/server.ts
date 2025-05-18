import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { shouldUseMSW } from "~/lib/env";

export const server = setupServer(...handlers);

export function startServer() {
  if (!shouldUseMSW()) {
    return;
  }

  server.listen({ onUnhandledRequest: "bypass" });
  console.log(
    "%c[MSW] 서버 측 Mock Service Worker 활성화 됨",
    "color:green;font-weight:bold;"
  );

  // 서버 종료 시 MSW 정리
  const cleanup = () => {
    server.close();
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", cleanup);
}