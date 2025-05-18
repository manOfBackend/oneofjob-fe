import { memo } from 'react';

import { SORT_OPTIONS } from '~/lib/types';

import type { SortOption, SortOptionConfig } from '~/lib/types';

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  className?: string;
}

export const SortControls = memo<SortControlsProps>(({ sortBy, onSortChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className='flex gap-1 bg-gray-100 rounded-lg p-1'>
        {SORT_OPTIONS.map((option: SortOptionConfig) => (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              sortBy === option.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
});
