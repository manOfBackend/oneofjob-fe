import { memo } from 'react';

interface HeaderProps {
  totalCount: number;
  filteredCount: number;
}

export const Header = memo<HeaderProps>(({ totalCount, filteredCount }) => {
  return (
    <header className='bg-white shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <h1 className='text-2xl font-bold text-blue-600'>OneOfJob</h1>
          <p className='text-sm text-gray-500'>
            전체 {totalCount}건 | 필터링 {filteredCount}건
          </p>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
