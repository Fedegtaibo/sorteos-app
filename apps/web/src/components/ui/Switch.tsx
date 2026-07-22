'use client';

import { forwardRef, useId, type ButtonHTMLAttributes, type MouseEvent } from 'react';

import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'role'> {
  checked: boolean;
  label?: string;
  description?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      id,
      className,
      checked,
      label,
      description,
      disabled,
      type = 'button',
      onClick,
      onCheckedChange,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const switchId = id ?? generatedId;
    const descriptionId = description ? `${switchId}-description` : undefined;
    const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined;

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) onCheckedChange?.(!checked);
    };

    return (
      <button
        ref={ref}
        {...props}
        id={switchId}
        type={type}
        role="switch"
        aria-checked={checked}
        aria-describedby={describedBy}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          'group inline-flex min-h-11 items-center gap-activa-12 rounded-activa-sm text-left',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'relative h-6 w-11 shrink-0 rounded-activa-full transition-colors duration-fast ease-activa',
            checked ? 'bg-action-secondary' : 'bg-status-disabled',
          )}
        >
          <span
            className={cn(
              'absolute left-1 top-1 size-4 rounded-activa-full bg-background-surface shadow-activa-xs transition-transform duration-fast ease-activa',
              checked && 'translate-x-5',
            )}
          />
        </span>
        {label || description ? (
          <span>
            {label ? <span className="block text-sm font-semibold text-text-primary">{label}</span> : null}
            {description ? <span id={descriptionId} className="mt-activa-4 block text-sm text-text-secondary">{description}</span> : null}
          </span>
        ) : null}
      </button>
    );
  },
);

Switch.displayName = 'Switch';
