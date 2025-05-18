import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

async function prepareApp() {
  try {
    const { initMocks } = await import('./mocks');
    await initMocks();

    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <RemixBrowser />
        </StrictMode>
      );
    });
  } catch (error) {
    console.error('애플리케이션 초기화 실패:', error);

    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <RemixBrowser />
        </StrictMode>
      );
    });
  }
}

void prepareApp();
