// Client-safe utilities (isomorphic - works on both client and server)

/**
 * Format WhatsApp link with optional pre-filled message
 */
export const getWhatsAppLink = (number: string, message?: string): string => {
  const cleanNumber = number.replace(/[^0-9]/g, '')
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${cleanNumber}${encodedMessage}`
}

/**
 * Format Instagram profile link
 */
export const getInstagramLink = (handle: string): string => {
  const cleanHandle = handle.replace('@', '')
  return `https://instagram.com/${cleanHandle}`
}

// Default site settings
export const defaultSettings = {
  storeName: 'House of Varsha',
  tagline: 'Handcrafted Indian Ethnic Wear',
  whatsappNumber: '917569619390',
  instagramHandle: 'houseofvarsha',
  email: 'hello@houseofvarsha.com'
} as const