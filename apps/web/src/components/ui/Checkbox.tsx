'use client';

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
} from 'react';

import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      className,
      label,
      description,
      error,
      indeterminate = false,
      disabled,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    forwardedRef,
  ) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;
    const descriptionId = description ? `${checkboxId}-description` : undefined;
    const errorId = error ? `${checkboxId}-error` : undefined;
    const describedBy = [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(' ') || undefined;
    const internalRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (internalRef.current) internalRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const setRef = (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    return (
      <div className={cn('w-fit', className)}>
        <label htmlFor={checkboxId} className={cn('flex min-h-10 cursor-pointer items-start gap-activa-12', disabled && 'cursor-not-allowed opacity-60')}>
          <input
            ref={setRef}
            {...props}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-checked={indeterminate ? 'mixed' : props.checked}
            aria-describedby={describedBy}
            className={cn(
              'mt-0.5 size-5 shrink-0 rounded-activa-xs border-border-strong text-action-secondary accent-action-secondary',
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

Checkbox.displayName = 'Checkbox';
