const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === 'true' && import.meta.env.DEV;

console.log('🎭 MSW Configuration:', {
  enableMocks: ENABLE_MOCKS,
  isDev: import.meta.env.DEV,
  envVar: import.meta.env.VITE_ENABLE_MOCKS,
});

export async function initMocks() {
  // 프로덕션이거나 MSW가 비활성화된 경우 실행하지 않음
  if (!ENABLE_MOCKS) {
    console.log('🚫 MSW 비활성화됨 - 실제 API 사용');
    return;
  }

  if (typeof window === "undefined") {
    // 서버 환경 (개발 모드에서만)
    const { startServer } = await import("./server");
    startServer();
  } else {
    // 브라우저 환경 (개발 모드에서만)
    const { startMSW } = await import("./browser");
    startMSW();
  }
}