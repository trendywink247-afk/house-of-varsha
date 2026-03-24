import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Optimize Cloudinary image URLs with auto format, quality, and optional width.
 * Passes through non-Cloudinary URLs unchanged.
 */
export function optimizeImg(url: string, width?: number): string {
  if (!url.includes('res.cloudinary.com')) return url;
  // Insert transforms after /upload/
  const transforms = width
    ? `f_auto,q_auto,w_${width}`
    : 'f_auto,q_auto';
  return url.replace('/upload/', `/upload/${transforms}/`);
}
