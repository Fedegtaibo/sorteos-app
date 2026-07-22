import type { ReactNode } from 'react';

type SurfaceVariant = 'light' | 'dark' | 'teal' | 'amber';

type ActivaSurfaceProps = {
  children: ReactNode;
  variant?: SurfaceVariant;
  className?: string;
  activeCut?: boolean;
};

export function ActivaSurface({
  children,
  variant = 'light',
  className = '',
  activeCut = false,
}: ActivaSurfaceProps) {
  const classes = [
    'activa-surface',
    `activa-surface--${variant}`,
    activeCut ? 'activa-active-cut' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <section className={classes}>{children}</section>;
}

type ActivaPatternProps = {
  type?: 'diagonal-light' | 'diagonal-dark' | 'nodes';
  className?: string;
};

export function ActivaPattern({
  type = 'diagonal-light',
  className = '',
}: ActivaPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={`activa-pattern--${type} ${className}`}
    />
  );
}
