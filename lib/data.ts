// Unified Data Fetching Layer for House of Varsha
// Combines Google Sheets data with fallback products
// Handles caching and revalidation

import { cache } from 'react'
import {
  fetchProductsFromSheet,
  fetchSettingsFromSheet,
  Product,
  SiteSettings,
  defaultSettings
} from './googleSheets'
import { products as fallbackProducts } from '@/data/products'

// Re-export types for convenience
export type { Product, SiteSettings, ColorVariant } from './googleSheets'

// Cache duration for data (in seconds)
const CACHE_DURATION = 60

// ============================================
// Cached Data Fetchers
// ============================================

/**
 * Get all products with caching
 * Uses React's cache() for request-level deduplication
 */
export const getProducts = cache(async (): Promise<Product[]> => {
  try {
    const sheetProducts = await fetchProductsFromSheet()

    if (sheetProducts.length > 0) {
      return sheetProducts
    }

    console.log('Using fallback products')
    return fallbackProducts
  } catch (error) {
    console.error('Error fetching products:', error)
    return fallbackProducts
  }
})

/**
 * Get site settings with caching
 */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    return await fetchSettingsFromSheet()
  } catch (error) {
    console.error('Error fetching settings:', error)
    return defaultSettings
  }
})

// ============================================
// Product Query Functions
// ============================================

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts()
  return products.find(p => p.id === id || p.id === id.toLowerCase())
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit?: number): Promise<Product[]> {
  const products = await getProducts()
  const featured = products.filter(p => p.featured)

  if (limit) {
    return featured.slice(0, limit)
  }

  return featured
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getProducts()
  return products.filter(
    p => p.category.toLowerCase() === category.toLowerCase()
  )
}

/**
 * Get related products (same category, excluding current product)
 */
export async function getRelatedProducts(
  productId: string,
  limit: number = 4
): Promise<Product[]> {
  const products = await getProducts()
  const currentProduct = products.find(p => p.id === productId)

  if (!currentProduct) return []

  return products
    .filter(p => p.id !== productId && p.category === currentProduct.category)
    .slice(0, limit)
}

/**
 * Get all unique categories
 */
export async function getCategories(): Promise<string[]> {
  const products = await getProducts()
  const categories = new Set(products.map(p => p.category).filter(Boolean))
  return Array.from(categories).sort()
}

/**
 * Search products by name or description
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getProducts()
  const lowerQuery = query.toLowerCase()

  return products.filter(
    p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.code.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get products in stock
 */
export async function getInStockProducts(): Promise<Product[]> {
  const products = await getProducts()
  return products.filter(p => p.inStock !== false)
}

/**
 * Get all product IDs (for static generation)
 */
export async function getAllProductIds(): Promise<string[]> {
  const products = await getProducts()
  return products.map(p => p.id)
}

// ============================================
// Static Generation Helpers
// ============================================

/**
 * Generate static params for product pages
 * Used with Next.js generateStaticParams
 */
export async function generateProductStaticParams(): Promise<{ id: string }[]> {
  const productIds = await getAllProductIds()
  return productIds.map(id => ({ id }))
}

/**
 * Generate static params for category pages
 */
export async function generateCategoryStaticParams(): Promise<{ category: string }[]> {
  const categories = await getCategories()
  return categories.map(category => ({
    category: category.toLowerCase().replace(/\s+/g, '-')
  }))
}

// ============================================
// Data Validation Helpers
// ============================================

/**
 * Check if products are loaded from Google Sheets
 */
export async function isUsingGoogleSheets(): Promise<boolean> {
  const hasSheetId = Boolean(process.env.GOOGLE_SHEET_ID)
  const hasCSVUrl = Boolean(process.env.GOOGLE_SHEETS_PRODUCTS_URL)

  if (!hasSheetId && !hasCSVUrl) return false

  const products = await getProducts()
  // If we have products and they have cloudinaryId, likely from sheets
  return products.some(p => p.cloudinaryId)
}

/**
 * Get data source info (for debugging)
 */
export async function getDataSourceInfo(): Promise<{
  source: 'google-sheets-api' | 'google-sheets-csv' | 'fallback'
  productCount: number
  hasCloudinaryImages: boolean
}> {
  const products = await getProducts()
  const hasCloudinaryImages = products.some(p => p.cloudinaryId)

  let source: 'google-sheets-api' | 'google-sheets-csv' | 'fallback' = 'fallback'

  if (process.env.GOOGLE_SHEET_ID) {
    source = 'google-sheets-api'
  } else if (process.env.GOOGLE_SHEETS_PRODUCTS_URL) {
    source = 'google-sheets-csv'
  }

  return {
    source,
    productCount: products.length,
    hasCloudinaryImages
  }
}
