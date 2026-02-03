'use client'

import Image, { ImageProps } from 'next/image'
import { getCloudinaryUrl, getBlurDataUrl, isCloudinaryId, ImagePreset } from '@/lib/cloudinary'

interface CloudinaryImageProps extends Omit<ImageProps, 'src' | 'placeholder' | 'blurDataURL'> {
  /**
   * Either a Cloudinary public ID (e.g., 'products/kurti-1')
   * or a full URL (will be passed through)
   */
  src: string
  /**
   * Transformation preset or custom width for optimization
   */
  preset?: ImagePreset
  /**
   * Enable blur placeholder while loading
   */
  enableBlur?: boolean
}

/**
 * CloudinaryImage Component
 *
 * A wrapper around Next.js Image that handles Cloudinary image optimization.
 * Supports both Cloudinary public IDs and regular URLs.
 *
 * @example
 * // Using Cloudinary public ID with preset
 * <CloudinaryImage
 *   src="products/kurti-yellow"
 *   preset="card"
 *   alt="Kalamkari Kurti"
 *   fill
 *   className="object-cover"
 * />
 *
 * @example
 * // Using full URL (passes through)
 * <CloudinaryImage
 *   src="https://example.com/image.jpg"
 *   alt="Product"
 *   width={400}
 *   height={500}
 * />
 */
export default function CloudinaryImage({
  src,
  preset,
  enableBlur = true,
  alt,
  ...props
}: CloudinaryImageProps) {
  // Generate the optimized URL
  const imageUrl = isCloudinaryId(src)
    ? getCloudinaryUrl(src, preset)
    : src

  // Get blur placeholder for Cloudinary images
  const blurDataURL = enableBlur && isCloudinaryId(src)
    ? getBlurDataUrl(src)
    : undefined

  return (
    <Image
      src={imageUrl}
      alt={alt}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      {...props}
    />
  )
}

/**
 * Get optimized Cloudinary image URL for use in inline styles or non-Next.js contexts
 * Re-exported from cloudinary lib for convenience
 */
export { getCloudinaryUrl, getOptimizedImageUrl } from '@/lib/cloudinary'
