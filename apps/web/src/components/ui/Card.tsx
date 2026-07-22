import { forwardRef, type ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export type CardVariant = 'surface' | 'muted' | 'inverse' | 'interactive' | 'highlight';

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  surface: 'border-border-default bg-background-surface text-text-primary',
  muted: 'border-border-default bg-background-surface-muted text-text-primary',
  inverse: 'border-background-inverse bg-background-inverse text-text-inverse',
  interactive:
    'border-border-default bg-background-surface text-text-primary hover:border-border-strong hover:shadow-activa-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2',
  highlight: 'border-action-primary bg-action-primary/10 text-text-primary',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'surface', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-activa-lg border shadow-activa-sm transition-[border-color,box-shadow] duration-fast ease-activa',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-activa-24 pb-activa-12', className)} {...props} />,
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, ComponentPropsWithoutRef<'h3'>>(
  ({ className, ...props }, ref) => <h3 ref={ref} className={cn('font-display text-lg font-semibold', className)} {...props} />,
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, ComponentPropsWithoutRef<'p'>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn('mt-activa-4 text-sm text-text-secondary', className)} {...props} />,
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-activa-24 pt-activa-12', className)} {...props} />,
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('flex items-center gap-activa-12 p-activa-24 pt-activa-12', className)} {...props} />,
);
CardFooter.displayName = 'CardFooter';
