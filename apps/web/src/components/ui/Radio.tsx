'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      id,
      className,
      label,
      description,
      error,
      disabled,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const radioId = id ?? generatedId;
    const descriptionId = description ? `${radioId}-description` : undefined;
    const errorId = error ? `${radioId}-error` : undefined;
    const describedBy = [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className={cn('w-fit', className)}>
        <label htmlFor={radioId} className={cn('flex min-h-10 cursor-pointer items-start gap-activa-12', disabled && 'cursor-not-allowed opacity-60')}>
          <input
            ref={ref}
            {...props}
            id={radioId}
            type="radio"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              'mt-0.5 size-5 shrink-0 border-border-strong text-action-secondary accent-action-secondary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2',
              error && 'ring-1 ring-status-error',
            )}
          />
          <span>
            <span className="block text-sm font-semibold text-text-primary">{label}</span>
            {description ? <span id={descriptionId} className="mt-activa-4 block text-sm text-text-secondary">{description}</span> : null}
          </span>
        </label>
        {error ? <p id={errorId} role="alert" className="ml-activa-32 mt-activa-4 text-sm font-medium text-status-error">Error: {error}</p> : null}
      </div>
    );
  },
);

Radio.displayName = 'Radio';
