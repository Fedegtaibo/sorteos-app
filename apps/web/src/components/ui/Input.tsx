'use client';

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  successMessage?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      className,
      label,
      helperText,
      error,
      successMessage,
      leftIcon,
      rightIcon,
      disabled,
      readOnly,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const successId = !error && successMessage ? `${inputId}-success` : undefined;
    const describedBy = [ariaDescribedBy, errorId, successId, helperId].filter(Boolean).join(' ') || undefined;
    const borderClass = error
      ? 'border-status-error'
      : successMessage
        ? 'border-status-success'
        : readOnly && !disabled
          ? 'border-border-strong'
          : 'border-border-default';

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={inputId} className="mb-activa-8 block text-sm font-semibold text-text-primary">
            {label}
          </label>
        ) : null}
        <div className="relative">
          {leftIcon ? (
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-secondary">
              {leftIcon}
            </span>
          ) : null}
          <input
            ref={ref}
            {...props}
            id={inputId}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              'h-11 w-full rounded-activa-sm border bg-background-surface px-activa-12 text-sm text-text-primary shadow-activa-xs',
              'placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-1',
              'transition-colors duration-fast ease-activa',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              borderClass,
              disabled && 'cursor-not-allowed bg-background-surface-muted text-text-disabled opacity-70',
              readOnly && !disabled && 'bg-background-surface-muted text-text-secondary',
              className,
            )}
          />
          {rightIcon ? (
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-text-secondary">
              {rightIcon}
            </span>
          ) : null}
        </div>
        {error ? <p id={errorId} role="alert" className="mt-activa-8 text-sm font-medium text-status-error">Error: {error}</p> : null}
        {!error && successMessage ? <p id={successId} role="status" className="mt-activa-8 text-sm font-medium text-status-success">Correcto: {successMessage}</p> : null}
        {helperText ? <p id={helperId} className="mt-activa-8 text-sm text-text-secondary">{helperText}</p> : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
