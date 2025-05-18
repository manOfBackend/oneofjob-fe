import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigation,
} from '@remix-run/react';
import { useEffect } from 'react';

import type { LinksFunction } from '@remix-run/node';

import './tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

// 페이지 전환 로딩 표시 컴포넌트
function PageTransition() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== 'idle';

  return isLoading ? (
    <div className='fixed inset-x-0 top-0 z-50 h-1'>
      <div className='h-full animate-pulse bg-blue-600' />
    </div>
  ) : null;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko' className='h-full'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='h-full'>
        <PageTransition />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();

  // 페이지 변경 시 스크롤 상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <Outlet />;
}

// 에러 처리
export function ErrorBoundary() {
  return (
    <html lang='ko'>
      <head>
        <title>오류가 발생했습니다 - OneOfJob</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className='flex h-screen flex-col items-center justify-center p-4 text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>오류가 발생했습니다</h1>
          <p className='mt-4 text-lg text-gray-600'>
            죄송합니다, 페이지를 표시하는 중에 오류가 발생했습니다.
          </p>
          <a
            href='/'
            className='mt-8 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
          >
            홈으로 돌아가기
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

// 404 처리
export function CatchBoundary() {
  return (
    <html lang='ko'>
      <head>
        <title>페이지를 찾을 수 없습니다 - OneOfJob</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className='flex h-screen flex-col items-center justify-center p-4 text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>404 - 페이지를 찾을 수 없습니다</h1>
          <p className='mt-4 text-lg text-gray-600'>
            죄송합니다, 요청하신 페이지를 찾을 수 없습니다.
          </p>
          <a
            href='/'
            className='mt-8 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
          >
            홈으로 돌아가기
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
