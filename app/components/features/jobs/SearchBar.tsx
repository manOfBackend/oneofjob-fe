import { memo, useState, useTransition } from 'react';

interface SearchBarProps {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onFocus?: () => void;
  className?: string;
}

export const SearchBar = memo<SearchBarProps>(
  ({ keyword, onKeywordChange, onFocus, className = '' }) => {
    const [localKeyword, setLocalKeyword] = useState(keyword);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      startTransition(() => {
        onKeywordChange(localKeyword);
      });
    };

    return (
      <form onSubmit={handleSubmit} className={className}>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
            <svg
              className='h-5 w-5 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
          <input
            type='text'
            value={localKeyword}
            onChange={e => setLocalKeyword(e.target.value)}
            onFocus={onFocus}
            placeholder='원하는 채용공고를 검색해보세요...'
            className='block w-full pl-12 pr-20 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-0 focus:outline-none transition-all placeholder-gray-400'
            disabled={isPending}
          />
          <div className='absolute inset-y-0 right-0 flex items-center pr-2'>
            <button
              type='submit'
              disabled={isPending}
              className='h-8 w-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center'
            >
              {isPending ? (
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
              ) : (
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>
    );
  }
);

SearchBar.displayName = 'SearchBar';
