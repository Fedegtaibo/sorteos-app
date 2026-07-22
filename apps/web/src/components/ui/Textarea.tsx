'use client';

import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      className,
      label,
      helperText,
      error,
      success,
      disabled,
      readOnly,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const helperId = helperText ? `${textareaId}-helper` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;
    const successId = !error && success ? `${textareaId}-success` : undefined;
    const describedBy = [ariaDescribedBy, errorId, successId, helperId].filter(Boolean).join(' ') || undefined;
    const borderClass = error
      ? 'border-status-error'
      : success
        ? 'border-status-success'
        : readOnly && !disabled
          ? 'border-border-strong'
          : 'border-border-default';

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={textareaId} className="mb-activa-8 block text-sm font-semibold text-text-primary">
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          {...props}
          id={textareaId}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'min-h-28 w-full resize-y rounded-activa-sm border bg-background-surface px-activa-12 py-activa-12 text-sm text-text-primary shadow-activa-xs',
            'placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-1',
            'transition-colors duration-fast ease-activa',
            borderClass,
            disabled && 'cursor-not-allowed bg-background-surface-muted text-text-disabled opacity-70',
            readOnly && !disabled && 'bg-background-surface-muted text-text-secondary',
            className,
          )}
        />
        {error ? <p id={errorId} role="alert" className="mt-activa-8 text-sm font-medium text-status-error">Error: {error}</p> : null}
        {!error && success ? <p id={successId} role="status" className="mt-activa-8 text-sm font-medium text-status-success">Correcto: {success}</p> : null}
        {helperText ? <p id={helperId} className="mt-activa-8 text-sm text-text-secondary">{helperText}</p> : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
