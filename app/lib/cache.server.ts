import { remember } from '@epic-web/remember';
import type { Job } from '~/lib/types';

// 메모리 캐시 (서버 인스턴스 레벨)
const globalJobsCache = remember('jobs-cache', () => new Map<string, CacheEntry>());

interface CacheEntry {
  data: any;
  timestamp: Date;
  lastCrawlTime: Date;
}

/**
 * 캐시된 채용공고 조회
 * 매일 10시 크롤링 이후에만 캐시를 무효화
 */
export async function getCachedJobs(): Promise<Job[]> {
  const cacheKey = 'jobs-list';
  const cached = globalJobsCache.get(cacheKey);

  // 캐시가 유효한지 확인
  if (cached && isCacheValid(cached)) {
    console.log('🎯 Cache HIT: 서버 캐시에서 데이터 반환');
    return cached.data;
  }

  // 캐시 미스 - 새 데이터 가져오기
  console.log('🔄 Cache MISS: Firebase에서 새 데이터 가져오기');
  const { JobsApi } = await import('~/lib/api');
  const freshData = await JobsApi.getAll();

  // 캐시 갱신
  globalJobsCache.set(cacheKey, {
    data: freshData,
    timestamp: new Date(),
    lastCrawlTime: getTodayTenAM(),
  });

  return freshData;
}

/**
 * 캐시된 회사 목록 조회
 */
export async function getCachedCompanies(): Promise<string[]> {
  const cacheKey = 'companies-list';
  const cached = globalJobsCache.get(cacheKey);

  if (cached && isCacheValid(cached)) {
    console.log('🎯 Cache HIT: 회사 목록 서버 캐시 사용');
    return cached.data;
  }

  console.log('🔄 Cache MISS: 회사 목록 새로 가져오기');
  const { CompaniesApi } = await import('~/lib/api');
  const freshData = await CompaniesApi.getAll();

  globalJobsCache.set(cacheKey, {
    data: freshData,
    timestamp: new Date(),
    lastCrawlTime: getTodayTenAM(),
  });

  return freshData;
}

/**
 * 캐시 유효성 검사
 * 오늘 10시 이후 크롤링이 완료되었다면 캐시가 유효
 */
function isCacheValid(cached: CacheEntry): boolean {
  const now = new Date();
  const todayTenAM = getTodayTenAM();

  // 아직 오늘 10시가 안 됐다면 어제 캐시도 유효
  if (now < todayTenAM) {
    const yesterdayTenAM = new Date(todayTenAM);
    yesterdayTenAM.setDate(yesterdayTenAM.getDate() - 1);
    return cached.lastCrawlTime >= yesterdayTenAM;
  }

  // 오늘 10시가 지났다면 오늘 10시 이후 캐시만 유효
  return cached.lastCrawlTime >= todayTenAM;
}

/**
 * 오늘 오전 10시 시간 객체 반환
 */
function getTodayTenAM(): Date {
  const today = new Date();
  const tenAM = new Date(today);
  tenAM.setHours(10, 0, 0, 0);
  return tenAM;
}

/**
 * 캐시 무효화 (수동 트리거용)
 */
export function invalidateCache(): void {
  console.log('🗑️ 모든 캐시 무효화');
  globalJobsCache.clear();
}

/**
 * 특정 키만 무효화
 */
export function invalidateCacheKey(key: string): void {
  console.log(`🗑️ 캐시 무효화: ${key}`);
  globalJobsCache.delete(key);
}

/**
 * 캐시 상태 정보 반환
 */
export function getCacheInfo() {
  const jobsCacheEntry = globalJobsCache.get('jobs-list');
  const companiesCacheEntry = globalJobsCache.get('companies-list');

  return {
    jobs: {
      cached: !!jobsCacheEntry,
      lastUpdated: jobsCacheEntry?.timestamp,
      size: jobsCacheEntry?.data?.length || 0,
    },
    companies: {
      cached: !!companiesCacheEntry,
      lastUpdated: companiesCacheEntry?.timestamp,
      size: companiesCacheEntry?.data?.length || 0,
    },
    nextUpdate: getNextUpdateTime(),
    totalCacheSize: globalJobsCache.size,
    cacheKeys: Array.from(globalJobsCache.keys()),
  };
}

/**
 * 다음 업데이트 시간 계산
 */
function getNextUpdateTime(): Date {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  // 아직 오늘 10시가 안 지났다면 오늘 10시가 다음 업데이트
  const todayTenAM = getTodayTenAM();
  if (now < todayTenAM) {
    return todayTenAM;
  }

  return tomorrow;
}

/**
 * TTL 기반 캐시 (범용)
 */
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMinutes: number = 60
): Promise<T> {
  const cached = globalJobsCache.get(key);

  if (cached) {
    const age = Date.now() - cached.timestamp.getTime();
    const maxAge = ttlMinutes * 60 * 1000;

    if (age < maxAge) {
      console.log(`🎯 TTL Cache HIT: ${key} (${Math.round(age / 1000)}s old)`);
      return cached.data;
    }
  }

  console.log(`🔄 TTL Cache MISS: ${key} (refreshing)`);
  const freshData = await fetcher();

  globalJobsCache.set(key, {
    data: freshData,
    timestamp: new Date(),
    lastCrawlTime: new Date(),
  });

  return freshData;
}

/**
 * 캐시 통계 (모니터링용)
 */
export function getCacheStats() {
  const stats = {
    totalEntries: globalJobsCache.size,
    memoryUsage: process.memoryUsage(),
    cacheEntries: new Map<string, any>(),
  };

  for (const [key, entry] of globalJobsCache.entries()) {
    const dataSize = JSON.stringify(entry.data).length;
    const age = Date.now() - entry.timestamp.getTime();

    stats.cacheEntries.set(key, {
      size: dataSize,
      ageMs: age,
      ageHuman: `${Math.round(age / 1000)}s`,
    });
  }

  return stats;
}
