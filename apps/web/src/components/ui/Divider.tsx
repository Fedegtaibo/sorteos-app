import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerColor = 'surface' | 'inverse';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DividerOrientation;
  color?: DividerColor;
  label?: string;
}

const colorClasses: Record<DividerColor, string> = {
  surface: 'bg-border-default',
  inverse: 'bg-text-inverse/40',
};

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', color = 'surface', label, ...props }, ref) => {
    const lineClass = colorClasses[color];

    return (
      <div
        ref={ref}
        {...props}
        role="separator"
        aria-orientation={orientation}
        aria-label={label}
        className={cn(
          orientation === 'horizontal'
            ? label ? 'flex w-full items-center gap-activa-12' : cn('h-px w-full', lineClass)
            : cn('min-h-6 w-px self-stretch', lineClass),
          className,
        )}
      >
        {orientation === 'horizontal' && label ? (
          <>
            <span aria-hidden="true" className={cn('h-px flex-1', lineClass)} />
            <span className={cn('text-xs font-semibold', color === 'inverse' ? 'text-text-inverse/75' : 'text-text-secondary')}>
              {label}
            </span>
            <span aria-hidden="true" className={cn('h-px flex-1', lineClass)} />
          </>
        ) : null}
      </div>
    );
  },
);

Divider.displayName = 'Divider';
