'use client';

import {
  useEffect,
  useRef,
  useState,
  type ImgHTMLAttributes,
  type SyntheticEvent,
} from 'react';

import { cn } from '@/lib/utils';

import {
  MediaPlaceholder,
  type MediaPlaceholderVariant,
} from './MediaPlaceholder';

export type MediaImageFit = 'cover' | 'contain';

export interface MediaImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src?: string | null;
  alt: string;
  placeholderVariant?: MediaPlaceholderVariant;
  placeholderText?: string;
  fit?: MediaImageFit;
  imageClassName?: string;
}

const fitClasses: Record<MediaImageFit, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
};

export function MediaImage({
  src,
  alt,
  className,
  placeholderVariant = 'image',
  placeholderText,
  fit = 'cover',
  imageClassName,
  onError,
  ...props
}: MediaImageProps) {
  const normalizedSrc = typeof src === 'string' ? src.trim() : '';
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setHasError(false);
  }, [normalizedSrc]);

  useEffect(() => {
    const image = imageRef.current;

    if (
      normalizedSrc &&
      image?.complete &&
      (image.naturalWidth === 0 || image.naturalHeight === 0)
    ) {
      setHasError(true);
    }
  });

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    onError?.(event);
  };

  if (!normalizedSrc || hasError) {
    return (
      <MediaPlaceholder
        variant={placeholderVariant}
        label={placeholderText}
        className={className}
      />
    );
  }

  return (
    <img
      ref={imageRef}
      {...props}
      src={normalizedSrc}
      alt={alt}
      onError={handleError}
      className={cn(
        'block h-full w-full',
        fitClasses[fit],
        className,
        imageClassName,
      )}
    />
  );
}
