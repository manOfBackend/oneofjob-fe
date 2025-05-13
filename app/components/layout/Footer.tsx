import { Link } from '@remix-run/react';

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* 로고 및 소개 */}
          <div>
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">OneOfJob</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              개발자를 위한 채용 정보 플랫폼, 원오브잡에서 다양한 기업의 채용 정보를 한눈에 확인하세요.
            </p>
          </div>

          {/* 링크 */}
          <div>
            <h3 className="text-base font-medium text-gray-900">링크</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-blue-600">
                  홈
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-sm text-gray-600 hover:text-blue-600">
                  채용공고
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-sm text-gray-600 hover:text-blue-600">
                  회사정보
                </Link>
              </li>
            </ul>
          </div>

          {/* 회사 정보 */}
          <div>
            <h3 className="text-base font-medium text-gray-900">회사 정보</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-blue-600">
                  소개
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-blue-600">
                  이용약관
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-blue-600">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} OneOfJob. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}