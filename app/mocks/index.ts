import { shouldUseMSW } from '~/lib/env';

export async function initMocks() {
  if (!shouldUseMSW()) {
    return;
  }

  try {
    if (typeof window === 'undefined') {
      const { startServer } = await import('./server');
      startServer();
    } else {
      const { startMSW } = await import('./browser');
      await startMSW();
    }
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes('Cannot resolve module') ||
        error.message.includes('Failed to fetch')
      ) {
        console.info('🔄 MSW 모듈을 찾을 수 없어 실제 API를 사용합니다.');
      } else {
        console.warn('MSW 초기화 실패:', error.message);
      }
    } else {
      console.warn('MSW 초기화 중 알 수 없는 오류:', error);
    }
  }
}
