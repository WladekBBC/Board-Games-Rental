import { ImageLoaderProps } from 'next/image'
/**
 * Image loader for Next.js
 * @param {ImageLoaderProps} props - Image loader props
 * @returns {string} Image URL with width and quality parameters
 */
export const imageLoader = ({ src, width, quality = 80 }: ImageLoaderProps): string => {
  // If URL already contains parameters, add new parameters
  const separator = src.includes('?') ? '&' : '?'
  return `${src}${separator}w=${width}&q=${quality}`
} 