// Cloudinary Integration for House of Varsha
// Client-side only URL generation utilities

// Cloud name from environment
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dv6de0ucq'

// Image transformation presets
export const imagePresets = {
  thumbnail: { width: 300, height: 400, crop: 'fill', quality: 'auto' },
  card: { width: 400, height: 500, crop: 'fill', quality: 'auto' },
  gallery: { width: 600, height: 800, crop: 'fill', quality: 'auto' },
  detail: { width: 800, height: 1000, crop: 'fill', quality: 'auto' },
  full: { width: 1200, height: 1500, crop: 'limit', quality: 'auto:best' },
  logo: { width: 200, height: 80, crop: 'fit', quality: 'auto' }
} as const

export type ImagePreset = keyof typeof imagePresets

interface TransformOptions {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'pad' | 'crop'
  quality?: 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best' | number
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west'
  effect?: string
  background?: string
}

/**
 * Generate a Cloudinary URL for an image
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: ImagePreset | TransformOptions
): string {
  if (!cloudName) {
    console.warn('Cloudinary cloud name not configured')
    return publicId
  }

  // If publicId is already a full URL, return it
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId
  }

  // Get transformation options
  const transformOptions: TransformOptions = typeof options === 'string'
    ? imagePresets[options]
    : options || {}

  // Build transformation string
  const transforms: string[] = []

  if (transformOptions.width) transforms.push(`w_${transformOptions.width}`)
  if (transformOptions.height) transforms.push(`h_${transformOptions.height}`)
  if (transformOptions.crop) transforms.push(`c_${transformOptions.crop}`)
  if (transformOptions.quality) transforms.push(`q_${transformOptions.quality}`)
  if (transformOptions.gravity) transforms.push(`g_${transformOptions.gravity}`)
  if (transformOptions.effect) transforms.push(`e_${transformOptions.effect}`)
  if (transformOptions.background) transforms.push(`b_${transformOptions.background}`)

  // Always use auto format for best compression
  transforms.push(`f_${transformOptions.format || 'auto'}`)

  const transformString = transforms.length > 0 ? transforms.join(',') + '/' : ''

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${publicId}`
}

/**
 * Get optimized image URL with automatic format and quality
 */
export function getOptimizedImageUrl(publicId: string, width?: number): string {
  if (!publicId) return ''

  // If already a full URL, return as-is
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
    return publicId
  }

  if (!cloudName) return publicId

  const transforms = width
    ? `w_${width},c_limit,q_auto,f_auto`
    : 'q_auto,f_auto'

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${publicId}`
}

/**
 * Get placeholder blur data URL for loading states
 */
export function getBlurDataUrl(publicId: string): string {
  if (!publicId || publicId.startsWith('http')) {
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsLCgwMDQ8SDwsNEA4QDA0OExMUFBEVFREMDxcYFhQYEhT/2wBDAQMEBAUEBQkFBQkUDA0MFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCAAKAAoDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGkAB//xAAUEAEAAAAAAAAAAAAAAAAAAAAQ/9oACAEBAAEFAn//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/AT//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/AT//xAAUEAEAAAAAAAAAAAAAAAAAAAAQ/9oACAEBAAY/An//xAAUEAEAAAAAAAAAAAAAAAAAAAAQ/9oACAEBAAE/IX//2gAMAwEAAgADAAAAEPP/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/ED//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/ED//xAAUEAEAAAAAAAAAAAAAAAAAAAAQ/9oACAEBAAE/EH//2Q=='
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/w_10,q_auto:low,f_auto,e_blur:1000/${publicId}`
}

/**
 * Get cloud name
 */
export function getCloudName(): string {
  return cloudName
}
