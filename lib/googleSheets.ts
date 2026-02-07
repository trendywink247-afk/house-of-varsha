// Type definitions for products and site settings
export interface ColorVariant {
  color: string
  cloudinaryIds: string[]
  images: string[]
}

export interface Product {
  id: string
  name: string
  price: string
  originalPrice?: string
  description: string
  category: string
  sizes: string[]
  color: string
  code: string
  cloudinaryId?: string
  image?: string
  hoverImage?: string
  cloudinaryIds?: string[]
  images?: string[]
  colorVariants?: ColorVariant[]
  featured?: boolean
  inStock?: boolean
  details?: string[]
}

export interface SiteSettings {
  storeName: string
  logoCloudinaryId?: string
  logo?: string
  tagline: string
  whatsappNumber: string
  instagramHandle: string
  email: string
  heroCloudinaryId?: string
  heroImage?: string
}

// Default site settings
export const defaultSettings: SiteSettings = {
  storeName: 'House of Varsha',
  tagline: 'Handcrafted Indian Ethnic Wear',
  whatsappNumber: '917569619390',
  instagramHandle: 'houseofvarsha',
  email: 'hello@houseofvarsha.com'
}

// Helper to format WhatsApp link
export function getWhatsAppLink(number: string, message?: string): string {
  const cleanNumber = number.replace(/[^0-9]/g, '')
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${cleanNumber}${encodedMessage}`
}

// Helper to format Instagram link
export function getInstagramLink(handle: string): string {
  const cleanHandle = handle.replace('@', '')
  return `https://instagram.com/${cleanHandle}`
}