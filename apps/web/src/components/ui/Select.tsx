'use client';

import {
  forwardRef,
  useId,
  type KeyboardEvent,
  type PointerEvent,
  type SelectHTMLAttributes,
} from 'react';

import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  placeholder?: string;
  readOnly?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      className,
      label,
      helperText,
      error,
      success,
      placeholder,
      disabled,
      readOnly = false,
      children,
      onChange,
      onKeyDown,
      onPointerDown,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const helperId = helperText ? `${selectId}-helper` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;
    const successId = !error && success ? `${selectId}-success` : undefined;
    const describedBy = [ariaDescribedBy, errorId, successId, helperId].filter(Boolean).join(' ') || undefined;
    const borderClass = error
      ? 'border-status-error'
      : success
        ? 'border-status-success'
        : readOnly && !disabled
          ? 'border-border-strong'
          : 'border-border-default';

    const handlePointerDown = (event: PointerEvent<HTMLSelectElement>) => {
      onPointerDown?.(event);
      if (readOnly && !event.defaultPrevented) event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLSelectElement>) => {
      onKeyDown?.(event);
      if (readOnly && event.key !== 'Tab' && !event.defaultPrevented) event.preventDefault();
    };

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={selectId} className="mb-activa-8 block text-sm font-semibold text-text-primary">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            ref={ref}
            {...props}
            id={selectId}
            disabled={disabled}
            aria-readonly={readOnly || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            onChange={readOnly ? undefined : onChange}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            className={cn(
              'h-11 w-full appearance-none rounded-activa-sm border bg-background-surface px-activa-12 pr-10 text-sm text-text-primary shadow-activa-xs',
              'focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-1',
              'transition-colors duration-fast ease-activa',
              borderClass,
              disabled && 'cursor-not-allowed bg-background-surface-muted text-text-disabled opacity-70',
              readOnly && !disabled && 'cursor-default bg-background-surface-muted text-text-secondary',
              className,
            )}
          >
            {placeholder ? <option value="" disabled>{placeholder}</option> : null}
            {children}
          </select>
          <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-2.5 -translate-y-2/3 rotate-45 border-b-2 border-r-2 border-current text-text-secondary" />
        </div>
        {error ? <p id={errorId} role="alert" className="mt-activa-8 text-sm font-medium text-status-error">Error: {error}</p> : null}
        {!error && success ? <p id={successId} role="status" className="mt-activa-8 text-sm font-medium text-status-success">Correcto: {success}</p> : null}
        {helperText ? <p id={helperId} className="mt-activa-8 text-sm text-text-secondary">{helperText}</p> : null}
      </div>
    );
  },
);

Select.displayName = 'Select';
