import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getCacheInfo, invalidateCache } from '~/lib/cache.server';

/**
 * 캐시 상태 조회 API
 * GET /api/cache
 */
export async function loader({ request }: LoaderFunctionArgs) {
  // 개발 환경에서만 접근 허용
  if (process.env.NODE_ENV === 'production') {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const cacheInfo = getCacheInfo();

  return json({
    success: true,
    cache: cacheInfo,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 캐시 무효화 API
 * POST /api/cache/invalidate
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  // 운영 환경에서는 더 강한 인증 필요
  if (process.env.NODE_ENV === 'production') {
    const authHeader = request.headers.get('Authorization');
    const webhookSecret = request.headers.get('X-Webhook-Secret');

    // 크롤러에서 온 웹훅인지 확인
    if (webhookSecret === process.env.CRAWLER_WEBHOOK_SECRET) {
      console.log('🤖 크롤러 웹훅으로부터 캐시 무효화 요청');
    }
    // 관리자 API 키 확인
    else if (authHeader === `Bearer ${process.env.ADMIN_API_KEY}`) {
      console.log('👨‍💼 관리자 요청으로 캐시 무효화');
    }
    // 인증 실패
    else {
      console.warn('🚨 유효하지 않은 캐시 무효화 요청');
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    // 캐시 무효화 실행
    const beforeCache = getCacheInfo();
    invalidateCache();
    const afterCache = getCacheInfo();

    console.log('✅ 캐시 무효화 완료', {
      before: beforeCache,
      after: afterCache,
      requestedBy: request.headers.get('User-Agent'),
    });

    return json({
      success: true,
      message: '캐시가 성공적으로 무효화되었습니다.',
      before: beforeCache,
      after: afterCache,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ 캐시 무효화 실패:', error);

    return json(
      {
        success: false,
        error: '캐시 무효화 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
