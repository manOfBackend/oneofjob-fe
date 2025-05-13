import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

export function startServer() {
  if (process.env.NODE_ENV === "development") {
    server.listen({ onUnhandledRequest: "bypass" });
    console.log(
      "%c[MSW] 서버 측 Mock Service Worker 활성화 됨",
      "color:green;font-weight:bold;"
    );

    // 서버 종료 시 MSW 정리
    process.on("SIGINT", () => {
      server.close();
    });

    process.on("SIGTERM", () => {
      server.close();
    });
  }
}
