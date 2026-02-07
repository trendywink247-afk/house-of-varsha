// Google Sheets Integration for House of Varsha
// Supports both Service Account API and Public CSV methods
// Images are stored as Cloudinary public IDs

import { google } from 'googleapis'
import { getCloudinaryUrl } from './cloudinary'

// ============================================
// Type Definitions
// ============================================

export interface ColorVariant {
  color: string
  cloudinaryIds: string[]  // Array of Cloudinary public IDs
  images: string[]         // Resolved URLs (for backwards compatibility)
}

export interface Product {
  id: string
  name: string
  price: string
  originalPrice?: string   // For showing discounts
  description: string
  category: string
  sizes: string[]
  color: string
  code: string
  cloudinaryId?: string    // Primary Cloudinary public ID
  image?: string           // Resolved primary image URL
  cloudinaryIds?: string[] // Additional Cloudinary public IDs
  images?: string[]        // Resolved additional image URLs
  colorVariants?: ColorVariant[]
  featured?: boolean
  inStock?: boolean
  details?: string[]
}

export interface SiteSettings {
  storeName: string
  logoCloudinaryId?: string
  logo?: string            // Resolved logo URL
  tagline: string
  whatsappNumber: string
  instagramHandle: string
  email: string
  heroCloudinaryId?: string
  heroImage?: string
  heroCloudinaryIds?: string[]  // Multiple hero image Cloudinary IDs for mosaic
  heroImages?: string[]         // Resolved hero image URLs
}

// ============================================
// Default Values
// ============================================

export const defaultSettings: SiteSettings = {
  storeName: 'House of Varsha',
  tagline: 'Celebrating elegance and storytelling through premium handcrafted products.',
  whatsappNumber: '917569619390',
  instagramHandle: 'houseofvarsha',
  email: 'hello@houseofvarsha.com'
}

// ============================================
// Google Sheets API Client
// ============================================

let sheetsClient: ReturnType<typeof google.sheets> | null = null

async function getSheetsClient() {
  if (sheetsClient) return sheetsClient

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!email || !privateKey) {
    return null
  }

  try {
    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    })

    sheetsClient = google.sheets({ version: 'v4', auth })
    return sheetsClient
  } catch (error) {
    console.error('Failed to create Google Sheets client:', error)
    return null
  }
}

// ============================================
// Data Fetching Functions
// ============================================

/**
 * Fetch products from Google Sheets using Service Account API
 */
export async function fetchProductsFromSheet(): Promise<Product[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID

  // Try Service Account API first
  if (sheetId) {
    const products = await fetchProductsViaAPI(sheetId)
    if (products.length > 0) return products
  }

  // Fallback to public CSV method
  const csvUrl = process.env.GOOGLE_SHEETS_PRODUCTS_URL
  if (csvUrl) {
    return fetchProductsViaCSV(csvUrl)
  }

  console.log('No Google Sheets configuration found, using default products')
  return []
}

/**
 * Fetch products via Google Sheets API (Service Account)
 */
async function fetchProductsViaAPI(sheetId: string): Promise<Product[]> {
  try {
    const sheets = await getSheetsClient()
    if (!sheets) {
      console.log('Google Sheets client not available')
      return []
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Products!A:N', // Columns A through N
    })

    const rows = response.data.values
    if (!rows || rows.length < 2) {
      console.log('No product data found in sheet')
      return []
    }

    // First row is headers
    const headers = rows[0].map((h: string) => h.toLowerCase().trim())
    const products: Product[] = []

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const data: Record<string, string> = {}

      headers.forEach((header: string, index: number) => {
        data[header] = row[index]?.toString().trim() || ''
      })

      if (!data.id && !data.name) continue // Skip empty rows

      const product = parseProductRow(data)
      if (product) products.push(product)
    }

    return products
  } catch (error) {
    console.error('Error fetching products via API:', error)
    return []
  }
}

/**
 * Fetch settings from Google Sheets using Service Account API
 */
export async function fetchSettingsFromSheet(): Promise<SiteSettings> {
  const sheetId = process.env.GOOGLE_SHEET_ID

  // Try Service Account API first
  if (sheetId) {
    const settings = await fetchSettingsViaAPI(sheetId)
    if (settings) return settings
  }

  // Fallback to public CSV method
  const csvUrl = process.env.GOOGLE_SHEETS_SETTINGS_URL
  if (csvUrl) {
    return fetchSettingsViaCSV(csvUrl)
  }

  return defaultSettings
}

/**
 * Fetch settings via Google Sheets API (Service Account)
 */
async function fetchSettingsViaAPI(sheetId: string): Promise<SiteSettings | null> {
  try {
    const sheets = await getSheetsClient()
    if (!sheets) return null

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Site-Settings!A:B', // Two columns: Setting, Value
    })

    const rows = response.data.values
    if (!rows || rows.length < 2) return null

    const settings: Record<string, string> = {}

    // Skip header row, parse key-value pairs
    for (let i = 1; i < rows.length; i++) {
      const [key, value] = rows[i]
      if (key && value) {
        settings[key.toString().trim().toLowerCase()] = value.toString().trim()
      }
    }

    // Parse multiple hero images (comma-separated Cloudinary IDs)
    const heroIdsStr = settings.herocloudinaryids || settings.hero_cloudinary_ids || ''
    const heroCloudinaryIds = heroIdsStr
      ? heroIdsStr.split(',').map((id: string) => id.trim()).filter(Boolean)
      : settings.herocloudinaryid
        ? [settings.herocloudinaryid]
        : []

    return {
      storeName: settings.storename || settings.store_name || defaultSettings.storeName,
      logoCloudinaryId: settings.logocloudinaryid || settings.logo_cloudinary_id,
      logo: settings.logocloudinaryid
        ? getCloudinaryUrl(settings.logocloudinaryid, 'logo')
        : settings.logo,
      tagline: settings.tagline || defaultSettings.tagline,
      whatsappNumber: settings.whatsappnumber || settings.whatsapp || defaultSettings.whatsappNumber,
      instagramHandle: settings.instagramhandle || settings.instagram || defaultSettings.instagramHandle,
      email: settings.email || defaultSettings.email,
      heroCloudinaryId: settings.herocloudinaryid || settings.hero_cloudinary_id,
      heroImage: settings.herocloudinaryid
        ? getCloudinaryUrl(settings.herocloudinaryid, 'full')
        : settings.heroimage,
      heroCloudinaryIds: heroCloudinaryIds.length > 0 ? heroCloudinaryIds : undefined,
      heroImages: heroCloudinaryIds.length > 0
        ? heroCloudinaryIds.map((id: string) => getCloudinaryUrl(id, 'full'))
        : undefined,
    }
  } catch (error) {
    console.error('Error fetching settings via API:', error)
    return null
  }
}

// ============================================
// CSV Fallback Methods (for simpler setup)
// ============================================

/**
 * Fetch products via public CSV URL
 */
async function fetchProductsViaCSV(csvUrl: string): Promise<Product[]> {
  try {
    const response = await fetch(csvUrl, {
      next: { revalidate: 60 } // Cache for 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.status}`)
    }

    const csvText = await response.text()
    const data = parseCSV(csvText)

    return data
      .filter(row => row.id || row.name)
      .map(row => parseProductRow(row))
      .filter((p): p is Product => p !== null)
  } catch (error) {
    console.error('Error fetching products from CSV:', error)
    return []
  }
}

/**
 * Fetch settings via public CSV URL
 */
async function fetchSettingsViaCSV(csvUrl: string): Promise<SiteSettings> {
  try {
    const response = await fetch(csvUrl, {
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch settings: ${response.status}`)
    }

    const csvText = await response.text()
    const data = parseCSV(csvText)

    const settings: Record<string, string> = {}
    data.forEach(row => {
      const key = row.setting || row.key
      const value = row.value
      if (key && value) {
        settings[key.toLowerCase()] = value
      }
    })

    return {
      storeName: settings.storename || defaultSettings.storeName,
      logoCloudinaryId: settings.logocloudinaryid,
      logo: settings.logocloudinaryid
        ? getCloudinaryUrl(settings.logocloudinaryid, 'logo')
        : convertGoogleDriveLink(settings.logo),
      tagline: settings.tagline || defaultSettings.tagline,
      whatsappNumber: settings.whatsappnumber || defaultSettings.whatsappNumber,
      instagramHandle: settings.instagramhandle || defaultSettings.instagramHandle,
      email: settings.email || defaultSettings.email
    }
  } catch (error) {
    console.error('Error fetching settings from CSV:', error)
    return defaultSettings
  }
}

// ============================================
// Parsing Utilities
// ============================================

/**
 * Parse a product row from sheet data
 */
function parseProductRow(data: Record<string, string>): Product | null {
  const id = data.id || data.code?.toLowerCase()
  const name = data.name

  if (!id || !name) return null

  // Parse color variants with Cloudinary IDs
  const colorVariants = parseColorVariants(data.colorvariants || data.color_variants || '')

  // Get primary Cloudinary ID
  const cloudinaryId = data.cloudinaryid || data.cloudinary_id ||
    (colorVariants.length > 0 ? colorVariants[0].cloudinaryIds[0] : '')

  // Parse additional images
  const cloudinaryIds = data.cloudinaryids || data.cloudinary_ids || data.images
    ? (data.cloudinaryids || data.cloudinary_ids || data.images).split(',').map(s => s.trim()).filter(Boolean)
    : []

  // Determine price formatting
  let price = data.price || ''
  if (price && !price.includes('₹')) {
    price = `₹${price}`
  }

  let originalPrice = data.originalprice || data.original_price || ''
  if (originalPrice && !originalPrice.includes('₹')) {
    originalPrice = `₹${originalPrice}`
  }

  return {
    id,
    name,
    price,
    originalPrice: originalPrice || undefined,
    description: data.description || '',
    category: data.category || '',
    sizes: data.sizes ? data.sizes.split(',').map(s => s.trim()) : [],
    color: data.color || (colorVariants.length > 0 ? colorVariants[0].color : ''),
    code: data.code || id.toUpperCase(),
    cloudinaryId: cloudinaryId || undefined,
    image: cloudinaryId ? getCloudinaryUrl(cloudinaryId, 'detail') : convertGoogleDriveLink(data.image),
    cloudinaryIds: cloudinaryIds.length > 0 ? cloudinaryIds : undefined,
    images: cloudinaryIds.length > 0
      ? cloudinaryIds.map(cid => getCloudinaryUrl(cid, 'detail'))
      : data.images
        ? data.images.split(',').map(url => convertGoogleDriveLink(url.trim()))
        : [],
    colorVariants: colorVariants.length > 0 ? colorVariants : undefined,
    featured: data.featured?.toLowerCase() === 'true',
    inStock: data.instock?.toLowerCase() !== 'false', // Default to true
    details: data.details ? data.details.split('|').map(d => d.trim()) : []
  }
}

/**
 * Parse color variants string
 * Format: "Yellow:cloudinaryId1,cloudinaryId2;Red:cloudinaryId1,cloudinaryId2"
 */
export function parseColorVariants(colorVariantsStr: string): ColorVariant[] {
  if (!colorVariantsStr) return []

  const variants: ColorVariant[] = []
  const colorGroups = colorVariantsStr.split(';')

  for (const group of colorGroups) {
    const colonIndex = group.indexOf(':')
    if (colonIndex === -1) continue

    const color = group.substring(0, colonIndex).trim()
    const idsStr = group.substring(colonIndex + 1).trim()

    if (color && idsStr) {
      const cloudinaryIds = idsStr.split(',').map(id => id.trim()).filter(Boolean)
      const images = cloudinaryIds.map(id => {
        // Check if it's a Cloudinary ID or a full URL
        if (id.startsWith('http://') || id.startsWith('https://')) {
          return convertGoogleDriveLink(id)
        }
        return getCloudinaryUrl(id, 'detail')
      })

      variants.push({
        color,
        cloudinaryIds,
        images
      })
    }
  }

  return variants
}

/**
 * Parse CSV string to array of objects
 */
function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const data: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((header, index) => {
      row[header.trim().toLowerCase().replace(/[^a-z0-9]/g, '')] = values[index]?.trim() || ''
    })
    data.push(row)
  }

  return data
}

/**
 * Parse a single CSV line handling quoted values
 */
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

/**
 * Convert Google Drive share link to direct link
 */
export function convertGoogleDriveLink(url: string): string {
  if (!url) return ''

  // Already a direct link or not a Google Drive link
  if (url.includes('uc?export=view') || !url.includes('drive.google.com')) {
    return url
  }

  // Convert share link to direct link
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`
  }

  return url
}

// ============================================
// Helper Functions
// ============================================

/**
 * Format WhatsApp link with optional pre-filled message
 */
export function getWhatsAppLink(number: string, message?: string): string {
  const cleanNumber = number.replace(/[^0-9]/g, '')
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${cleanNumber}${encodedMessage}`
}

/**
 * Format Instagram profile link
 */
export function getInstagramLink(handle: string): string {
  const cleanHandle = handle.replace('@', '')
  return `https://instagram.com/${cleanHandle}`
}

/**
 * Get product WhatsApp order message
 */
export function getProductOrderMessage(product: Product): string {
  return `Hi! I'm interested in ordering:\n\n*${product.name}*\nCode: ${product.code}\nPrice: ${product.price}\n\nPlease share availability and ordering details.`
}
