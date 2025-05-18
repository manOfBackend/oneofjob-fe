import { memo } from 'react';

import type { BadgeSize, BadgeVariant } from '~/lib/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  onRemove?: () => void;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-2',
};

export const Badge = memo<BadgeProps>(
  ({ children, variant = 'default', size = 'md', onRemove, className = '' }) => {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      >
        {children}
        {onRemove && (
          <button
            onClick={onRemove}
            className='ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors'
            aria-label='제거'
          >
            <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);
