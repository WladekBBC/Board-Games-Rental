import { MAX_IMAGE_SIZE } from '@/constants/image'

export interface ImageValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validates image URL with improved checks
 * @param {string} url - URL to validate
 * @returns {Promise<ImageValidationResult>} Validation result with error message if invalid
 */
export const validateImageUrl = async (url: string): Promise<ImageValidationResult> => {
  // Check if URL is empty
  if (!url.trim()) {
    return {
      isValid: false,
      error: 'imageUrlRequired'
    }
  }

  // Check URL protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return {
      isValid: false,
      error: 'notHTTPorHTTPS'
    }
  }

  try {
    // Check if URL is valid
    new URL(url)
  } catch {
    return {
      isValid: false,
      error: 'invalidUrlFormat'
    }
  }

  return new Promise((resolve) => {
    const img = document.createElement('img')
    
    img.onload = () => {
      // Check image dimensions
      if (img.width === 0 || img.height === 0) {
        resolve({
          isValid: false,
          error: 'imageURLNotImage'
        })
        return
      }

      // Check if image is too large (approximate check)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        try {
          const dataUrl = canvas.toDataURL('image/jpeg')
          const base64str = dataUrl.split(',')[1]
          const decodedSize = atob(base64str).length
          
          if (decodedSize > MAX_IMAGE_SIZE) {
            resolve({
              isValid: false,
              error: 'imageTooLarge'
            })
            return
          }
        } catch {
          // If we can't check size, we'll assume it's valid
          // This is a fallback for cases where CORS prevents size checking
        }
      }

      resolve({ isValid: true })
    }

    img.onerror = () => {
      resolve({
        isValid: false,
        error: 'cannotDownloadImage'
      })
    }

    img.src = url
  })
} 