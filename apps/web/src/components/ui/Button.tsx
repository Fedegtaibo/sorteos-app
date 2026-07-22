'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'destructive'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-action-primary text-action-primary-text hover:bg-action-primary-hover',
  secondary: 'bg-action-secondary text-action-secondary-text hover:bg-action-secondary-hover',
  tertiary:
    'border border-action-secondary bg-background-surface text-action-secondary hover:bg-activa-teal-soft',
  ghost: 'bg-transparent text-text-primary hover:bg-background-surface-muted',
  destructive: 'bg-status-error text-white hover:bg-status-error/90',
  link: 'h-auto bg-transparent px-0 text-text-link underline-offset-4 hover:underline',
};

const sizeTypographyClasses: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  icon: 'text-sm',
};

const sizeDimensionClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-activa-12',
  md: 'h-11 px-activa-16',
  lg: 'h-[52px] px-activa-20',
  icon: 'size-10 min-h-10 min-w-10 p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      type = 'button',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        {leftIcon ? <span aria-hidden="true" className="shrink-0">{leftIcon}</span> : null}
        <span>{children}</span>
        {rightIcon ? <span aria-hidden="true" className="shrink-0">{rightIcon}</span> : null}
      </>
    );

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'relative inline-flex items-center justify-center gap-activa-8 rounded-activa-sm font-semibold',
          'transition-colors duration-fast ease-activa',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          variantClasses[variant],
          sizeTypographyClasses[size],
          variant !== 'link' && sizeDimensionClasses[size],
          className,
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="invisible inline-flex items-center gap-activa-8" aria-hidden="true">
              {content}
            </span>
            <span className="absolute inset-0 inline-flex items-center justify-center gap-activa-8">
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              />
              <span className={cn(size === 'icon' && 'sr-only')}>
                {loadingText ?? 'Cargando'}
              </span>
            </span>
          </>
        ) : content}
      </button>
    );
  },
);

Button.displayName = 'Button';
