'use client'

import { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'

// Base URL for Medusa API
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string
  fallbackAlt?: string
}

/**
 * Ensure image URL is absolute
 */
function getAbsoluteUrl(src: string): string {
  if (!src) return '';
  
  // If the URL is already absolute, return it as is
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  
  // If it's a relative URL starting with /, assume it's from the Medusa backend
  if (src.startsWith('/')) {
    return `${MEDUSA_BACKEND_URL}${src}`;
  }
  
  // Otherwise, assume it's relative to the frontend
  return src;
}

/**
 * A wrapper around Next.js Image component that handles loading errors
 * by displaying a fallback image or placeholder.
 */
export default function SafeImage({
  src,
  alt,
  fallbackSrc = 'https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Found',
  fallbackAlt = 'Image not available',
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(getAbsoluteUrl(src as string))
  const [imgAlt, setImgAlt] = useState<string>(alt)
  const [hasError, setHasError] = useState<boolean>(false)

  // Update image source when src prop changes
  useEffect(() => {
    if (!hasError) {
      setImgSrc(getAbsoluteUrl(src as string));
    }
  }, [src, hasError]);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc)
      setImgAlt(fallbackAlt)
      setHasError(true)
    }
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={imgAlt}
      onError={handleError}
      placeholder={props.placeholder || 'blur'}
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PC9zdmc+"
    />
  )
}

/**
 * A version of SafeImage specifically for product thumbnails with consistent styling
 */
export function ProductThumbnail({
  src,
  alt,
  className = '',
  ...props
}: Omit<SafeImageProps, 'fallbackSrc' | 'fallbackAlt'>) {
  return (
    <SafeImage
      src={src}
      alt={alt}
      fallbackSrc="https://placehold.co/600x600/e2e8f0/64748b?text=Product+Image"
      fallbackAlt="Product image not available"
      className={`object-cover ${className}`}
      {...props}
    />
  )
}