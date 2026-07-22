import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded-activa-xs',
  circular: 'size-10 rounded-activa-full',
  rectangular: 'h-24 w-full rounded-activa-md',
};

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-background-surface-muted motion-reduce:animate-none',
        variantClasses[variant],
        className,
      )}
    />
  ),
);

Skeleton.displayName = 'Skeleton';
