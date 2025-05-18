import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module '@remix-run/node' {
  interface Future {
    v3_singleFetch: true;
  }
}

function mswConditionalPlugin() {
  return {
    name: 'msw-conditional',
    resolveId(id: string) {
      // MSW 관련 파일들을 환경에 따라 조건부로 해석
      if (id.includes('app/mocks/index')) {
        return process.env.NODE_ENV === 'production'
          ? 'app/mocks/index.prod.ts'
          : 'app/mocks/index.dev.ts';
      }

      if (id.includes('app/mocks/server') && !id.includes('.dev') && !id.includes('.prod')) {
        return process.env.NODE_ENV === 'production'
          ? 'app/mocks/server.prod.ts'
          : 'app/mocks/server.dev.ts';
      }

      if (id.includes('app/mocks/browser') && !id.includes('.dev') && !id.includes('.prod')) {
        return process.env.NODE_ENV === 'production'
          ? 'app/mocks/browser.prod.ts'
          : 'app/mocks/browser.dev.ts';
      }

      return null;
    },
  };
}

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_singleFetch: true,
          v3_lazyRouteDiscovery: true,
        },
      }),
      tsconfigPaths(),
      mswConditionalPlugin(),
    ],

    optimizeDeps: {
      exclude: isDev ? ['msw'] : [],
    },

    server: {
      port: 5173,
      cors: true,
    },
    build: {
      sourcemap: isDev,
      minify: !isDev,

      rollupOptions: {
        external: !isDev ? ['msw', 'msw/node', 'msw/browser', /^@mswjs\//] : [],
      },
    },
    ssr: {
      external: !isDev ? ['msw', 'msw/node', 'msw/browser'] : [],
    },
  };
});
