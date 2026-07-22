import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type BadgeVariant = 'neutral' | 'brand' | 'active' | 'information' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-background-surface-muted text-text-primary',
  brand: 'bg-action-primary/20 text-action-primary-text',
  active: 'bg-activa-teal-soft text-action-secondary',
  information: 'bg-status-information/10 text-status-information',
  success: 'bg-status-success/10 text-status-success',
  warning: 'bg-status-warning/15 text-text-primary',
  error: 'bg-status-error/10 text-status-error',
};

export function Badge({ className, variant = 'neutral', size = 'md', icon, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-activa-4 rounded-activa-full font-semibold',
        size === 'sm' ? 'min-h-6 px-activa-8 text-xs' : 'min-h-7 px-activa-12 text-sm',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {icon ? <span aria-hidden="true" className="shrink-0">{icon}</span> : null}
      <span>{children}</span>
    </span>
  );
}
