// Google Sheets Integration for House of Varsha
// This allows you to update products, images, and settings from a Google Sheet

export interface ColorVariant {
  color: string
  images: string[]
}

export interface Product {
  id: string
  name: string
  price: string
  description: string
  category: string
  sizes: string[]
  color: string
  code: string
  image?: string
  images?: string[]
  colorVariants?: ColorVariant[]
  featured?: boolean
  details?: string[]
}

export interface SiteSettings {
  logo?: string
  logoText: string
  tagline: string
  whatsappNumber: string
  instagramHandle: string
  email: string
}

// Default site settings
export const defaultSettings: SiteSettings = {
  logoText: 'House of Varsha',
  tagline: 'Celebrating elegance and storytelling through premium handcrafted products.',
  whatsappNumber: '917569619390',
  instagramHandle: 'houseofvarsha',
  email: 'hello@houseofvarsha.com'
}

/**
 * Fetches product data from a published Google Sheet
 *
 * HOW TO SET UP YOUR GOOGLE SHEET:
 *
 * 1. Create a new Google Sheet with these columns:
 *    id | name | price | description | category | sizes | color | code | image | images | colorVariants | featured
 *
 *    Example row (single color):
 *    K001 | Kalamkari Kurti | ₹995 | Pure cotton... | Kurti | M,L,XL,XXL | Yellow | K001 | main.jpg | | | true
 *
 *    Example row (multiple colors with multiple images each):
 *    K001 | Kalamkari Kurti | ₹995 | Pure cotton... | Kurti | M,L,XL,XXL | | K001 | | | Yellow:img1.jpg,img2.jpg;Red:img1.jpg,img2.jpg;Blue:img1.jpg | true
 *
 *    colorVariants format: Color1:img1,img2,img3;Color2:img1,img2;Color3:img1
 *
 * 2. For images, you can:
 *    - Use Google Drive links (make sure to share as "Anyone with link")
 *    - Use any public image URL
 *    - To get a direct link from Google Drive:
 *      Original: https://drive.google.com/file/d/FILE_ID/view
 *      Direct:   https://drive.google.com/uc?export=view&id=FILE_ID
 *
 * 3. Publish the sheet:
 *    - Go to File > Share > Publish to web
 *    - Select the sheet tab you want to publish
 *    - Choose "Comma-separated values (.csv)" format
 *    - Click Publish
 *    - Copy the URL
 *
 * 4. Add the URL to your environment variables:
 *    GOOGLE_SHEETS_PRODUCTS_URL=your_published_csv_url
 */

// Parse CSV string to array of objects
function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const data: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header.trim().toLowerCase()] = values[index]?.trim() || ''
    })
    data.push(row)
  }

  return data
}

// Parse a single CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)

  return result
}

// Convert Google Drive share link to direct link
export function convertGoogleDriveLink(url: string): string {
  if (!url) return ''

  // Already a direct link
  if (url.includes('uc?export=view')) {
    return url
  }

  // Convert share link to direct link
  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`
  }

  return url
}

// Parse color variants string
// Format: "Yellow:img1.jpg,img2.jpg;Red:img1.jpg,img2.jpg;Blue:img1.jpg"
export function parseColorVariants(colorVariantsStr: string): ColorVariant[] {
  if (!colorVariantsStr) return []

  const variants: ColorVariant[] = []
  const colorGroups = colorVariantsStr.split(';')

  for (const group of colorGroups) {
    const [color, imagesStr] = group.split(':')
    if (color && imagesStr) {
      const images = imagesStr.split(',').map(url => convertGoogleDriveLink(url.trim()))
      variants.push({
        color: color.trim(),
        images
      })
    }
  }

  return variants
}

// Fetch products from Google Sheet
export async function fetchProductsFromSheet(): Promise<Product[]> {
  const sheetUrl = process.env.GOOGLE_SHEETS_PRODUCTS_URL

  if (!sheetUrl) {
    console.log('No Google Sheets URL configured, using default products')
    return []
  }

  try {
    const response = await fetch(sheetUrl, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.status}`)
    }

    const csvText = await response.text()
    const data = parseCSV(csvText)

    return data
      .filter(row => row.id && row.name) // Filter out empty rows
      .map(row => {
        const colorVariants = parseColorVariants(row.colorvariants || row.colorVariants || '')
        return {
          id: row.id || row.code?.toLowerCase(),
          name: row.name,
          price: row.price,
          description: row.description,
          category: row.category,
          sizes: row.sizes ? row.sizes.split(',').map(s => s.trim()) : [],
          color: row.color || (colorVariants.length > 0 ? colorVariants[0].color : ''),
          code: row.code,
          image: convertGoogleDriveLink(row.image) || (colorVariants.length > 0 ? colorVariants[0].images[0] : ''),
          images: row.images ? row.images.split(',').map(url => convertGoogleDriveLink(url.trim())) : [],
          colorVariants: colorVariants.length > 0 ? colorVariants : undefined,
          featured: row.featured?.toLowerCase() === 'true',
          details: row.details ? row.details.split('|').map(d => d.trim()) : []
        }
      })
  } catch (error) {
    console.error('Error fetching products from Google Sheet:', error)
    return []
  }
}

// Fetch site settings from Google Sheet
export async function fetchSettingsFromSheet(): Promise<SiteSettings> {
  const sheetUrl = process.env.GOOGLE_SHEETS_SETTINGS_URL

  if (!sheetUrl) {
    return defaultSettings
  }

  try {
    const response = await fetch(sheetUrl, {
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.status}`)
    }

    const csvText = await response.text()
    const data = parseCSV(csvText)

    // Settings sheet format: key, value
    const settings: Record<string, string> = {}
    data.forEach(row => {
      if (row.key && row.value) {
        settings[row.key] = row.value
      }
    })

    return {
      logo: settings.logo ? convertGoogleDriveLink(settings.logo) : undefined,
      logoText: settings.logoText || defaultSettings.logoText,
      tagline: settings.tagline || defaultSettings.tagline,
      whatsappNumber: settings.whatsappNumber || defaultSettings.whatsappNumber,
      instagramHandle: settings.instagramHandle || defaultSettings.instagramHandle,
      email: settings.email || defaultSettings.email
    }
  } catch (error) {
    console.error('Error fetching settings from Google Sheet:', error)
    return defaultSettings
  }
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
