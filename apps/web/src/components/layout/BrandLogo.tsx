import Image from 'next/image';
import Link, { type LinkProps } from 'next/link';

import { cn } from '@/lib/utils';

export type BrandLogoVariant = 'color' | 'white' | 'symbol';
export type BrandLogoSize = 'sm' | 'md' | 'lg' | 'hero';

export interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  alt?: string;
  priority?: boolean;
  href?: LinkProps['href'];
  className?: string;
}

const assets: Record<BrandLogoVariant, { src: string; width: number; height: number }> = {
  color: {
    src: '/brand/logos/activa-logo-horizontal-color.svg',
    width: 1600,
    height: 300,
  },
  white: {
    src: '/brand/logos/activa-logo-horizontal-white.svg',
    width: 1600,
    height: 300,
  },
  symbol: {
    src: '/brand/logos/activa-isotipo-color.svg',
    width: 1024,
    height: 1024,
  },
};

const horizontalSizeClasses: Record<BrandLogoSize, string> = {
  sm: 'w-28',
  md: 'w-36',
  lg: 'w-48',
  hero: 'w-[min(78vw,28rem)]',
};

const symbolSizeClasses: Record<BrandLogoSize, string> = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
  hero: 'size-24',
};

export function BrandLogo({
  variant = 'color',
  size = 'md',
  alt = 'ACTIVA',
  priority = false,
  href,
  className,
}: BrandLogoProps) {
  const asset = assets[variant];
  const image = (
    <Image
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={alt}
      priority={priority}
      className={cn(
        'block max-w-full object-contain',
        variant === 'symbol' ? symbolSizeClasses[size] : cn('h-auto', horizontalSizeClasses[size]),
      )}
    />
  );

  if (href) {
    return (
      <Link href={href} className={cn('inline-flex shrink-0 items-center', className)} aria-label={alt}>
        {image}
      </Link>
    );
  }

  return <span className={cn('inline-flex shrink-0 items-center', className)}>{image}</span>;
}
