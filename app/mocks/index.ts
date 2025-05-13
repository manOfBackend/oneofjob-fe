const ENABLE_MOCKS = import.meta.env.DEV;

export async function initMocks() {
  if (ENABLE_MOCKS) {
    if (typeof window === "undefined") {
      // 서버 환경
      const { startServer } = await import("./server");
      startServer();
    } else {
      // 브라우저 환경
      const { startMSW } = await import("./browser");
      startMSW();
    }
  }
}

// if (ENABLE_MOCKS && typeof window !== "undefined") {
//   initMocks().catch(console.error);
// }
