import type { HTMLAttributes } from 'react';

import { BrandLogo } from '@/components/layout';
import { cn } from '@/lib/utils';

export type MediaPlaceholderVariant = 'logo' | 'cover' | 'image' | 'video';

export interface MediaPlaceholderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  variant?: MediaPlaceholderVariant;
  label?: string;
}

const defaultLabels: Record<MediaPlaceholderVariant, string> = {
  logo: 'Logo pendiente',
  cover: 'Imagen de portada no cargada',
  image: 'Imagen no cargada',
  video: 'Video no cargado',
};

const variantClasses: Record<MediaPlaceholderVariant, string> = {
  logo: 'bg-background-surface-muted text-text-secondary',
  cover: 'bg-background-inverse text-text-inverse/75',
  image: 'bg-background-surface-muted text-text-secondary',
  video: 'bg-background-surface-muted text-text-secondary',
};

export function MediaPlaceholder({
  variant = 'image',
  label,
  className,
  ...props
}: MediaPlaceholderProps) {
  const accessibleLabel = label ?? defaultLabels[variant];

  return (
    <div
      {...props}
      role="img"
      aria-label={accessibleLabel}
      data-variant={variant}
      className={cn(
        'flex min-h-20 min-w-20 flex-col items-center justify-center gap-activa-8 overflow-hidden p-activa-12 text-center',
        variantClasses[variant],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex rounded-activa-full border border-border-default bg-background-surface p-activa-8 shadow-activa-sm"
      >
        <BrandLogo variant="symbol" size="sm" alt="" />
      </span>
      <span className="max-w-full text-xs font-semibold leading-4">
        {accessibleLabel}
      </span>
    </div>
  );
}
