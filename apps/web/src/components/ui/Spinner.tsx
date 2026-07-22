import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'current' | 'brand' | 'inverse';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  decorative?: boolean;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-8 border-[3px]',
};

const variantClasses: Record<SpinnerVariant, string> = {
  current: 'text-current',
  brand: 'text-action-secondary',
  inverse: 'text-text-inverse',
};

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size = 'md', variant = 'current', label = 'Cargando', decorative = false, ...props }, ref) => (
    <span
      ref={ref}
      {...props}
      role={decorative ? undefined : 'status'}
      aria-hidden={decorative || undefined}
      className={cn('inline-flex items-center justify-center', variantClasses[variant], className)}
    >
      <span
        aria-hidden="true"
        className={cn('animate-spin rounded-activa-full border-current border-r-transparent motion-reduce:animate-none', sizeClasses[size])}
      />
      {!decorative ? <span className="sr-only">{label}</span> : null}
    </span>
  ),
);

Spinner.displayName = 'Spinner';
