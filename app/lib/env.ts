/**
 * 환경변수 타입 정의
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ENABLE_MOCKS: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: 'development' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Vite define에서 주입된 전역 변수 타입
declare const __MSW_ENABLED__: boolean;

/**
 * 환경 설정
 */
export const ENV = {
  // 현재 환경
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,

  // API 설정
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',

  // MSW 설정 - 빌드 시점에 결정됨
  enableMocks:
    typeof __MSW_ENABLED__ !== 'undefined'
      ? __MSW_ENABLED__
      : import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCKS === 'true',
} as const;

/**
 * 필수 환경변수 검증
 */
export function validateEnvironment(): void {
  const requiredVars = {
    VITE_API_URL: ENV.apiUrl,
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
        'Please check your .env file and ensure all required variables are set.'
    );
  }

  // 개발 환경에서 환경변수 출력
  if (ENV.isDevelopment) {
    console.group('🔧 Environment Configuration');
    console.log('Mode:', ENV.mode);
    console.log('API URL:', ENV.apiUrl);
    console.log('Enable Mocks:', ENV.enableMocks);
    console.log(
      'MSW Enabled (build-time):',
      typeof __MSW_ENABLED__ !== 'undefined' ? __MSW_ENABLED__ : 'runtime-determined'
    );
    console.groupEnd();
  }
}

/**
 * MSW 사용 여부 결정
 * 빌드 타임에 결정되어 프로덕션에서는 완전히 제거됨
 */
export const shouldUseMSW = (): boolean => {
  return ENV.enableMocks;
};

/**
 * API URL 결정
 * MSW 사용 시에도 동일한 URL 사용 (MSW가 인터셉트)
 */
export const getApiUrl = (): string => {
  return ENV.apiUrl;
};
