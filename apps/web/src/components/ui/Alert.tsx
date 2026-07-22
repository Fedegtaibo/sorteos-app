'use client';

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type AlertVariant = 'brand' | 'information' | 'success' | 'warning' | 'error';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
}

const variants: Record<AlertVariant, { classes: string; marker: string }> = {
  brand: { classes: 'border-action-primary bg-action-primary/10', marker: 'A' },
  information: { classes: 'border-status-information bg-status-information/10', marker: 'i' },
  success: { classes: 'border-status-success bg-status-success/10', marker: 'OK' },
  warning: { classes: 'border-status-warning bg-status-warning/10', marker: '!' },
  error: { classes: 'border-status-error bg-status-error/10', marker: '!' },
};

export function Alert({
  className,
  variant = 'information',
  title,
  children,
  icon,
  action,
  onClose,
  ...props
}: AlertProps) {
  const isUrgent = variant === 'warning' || variant === 'error';

  return (
    <div
      {...props}
      role={isUrgent ? 'alert' : 'status'}
      className={cn('flex gap-activa-12 rounded-activa-md border p-activa-16 text-text-primary', variants[variant].classes, className)}
    >
      <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-activa-full border border-current text-xs font-bold">
        {icon ?? variants[variant].marker}
      </span>
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={cn('text-sm', title && 'mt-activa-4')}>{children}</div>
        {action ? <div className="mt-activa-12">{action}</div> : null}
      </div>
      {onClose ? (
        <button
          type="button"
          aria-label="Cerrar aviso"
          onClick={onClose}
          className="relative flex size-10 shrink-0 items-center justify-center rounded-activa-sm transition-colors duration-fast ease-activa hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <span aria-hidden="true" className="absolute h-0.5 w-4 rotate-45 bg-current" />
          <span aria-hidden="true" className="absolute h-0.5 w-4 -rotate-45 bg-current" />
        </button>
      ) : null}
    </div>
  );
}
