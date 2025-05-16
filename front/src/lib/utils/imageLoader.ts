import { ImageLoaderProps } from 'next/image'

export const imageLoader = ({ src, width, quality = 85 }: ImageLoaderProps): string => {
  // Jeśli URL już zawiera parametry, dodaj nowe parametry
  const separator = src.includes('?') ? '&' : '?'
  return `${src}${separator}w=${width}&q=${quality}`
} 