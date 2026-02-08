/**
 * Google Sheets Product Integration
 *
 * Supports two modes:
 * A) Public CSV: Published Google Sheet as CSV (no auth, client-side OK)
 * B) Server API: Express endpoint that fetches via Google Sheets API (server-side only)
 *
 * Falls back to local static products if Sheets is unavailable or not configured.
 */

import type { Product } from '@/types';
import { products as staticProducts } from '@/data/products';

// ─── Configuration ──────────────────────────────────────────

const SHEETS_CSV_URL = import.meta.env.VITE_GOOGLE_SHEETS_CSV_URL || '';
const SHEETS_API_ENDPOINT = import.meta.env.VITE_SHEETS_API_ENDPOINT || '/api/products';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ─── In-memory client cache ─────────────────────────────────

interface CacheEntry {
  products: Product[];
  timestamp: number;
}

let cache: CacheEntry | null = null;

function isCacheValid(): boolean {
  return cache !== null && Date.now() - cache.timestamp < CACHE_TTL_MS;
}

// ─── CSV Parsing ────────────────────────────────────────────

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.split('\n').filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

// ─── Row → Product mapping with validation ──────────────────

function mapRowToProduct(row: Record<string, string>, index: number): Product | null {
  const id = row['id'] || row['product_id'] || `sheet-${index}`;
  const name = row['name'] || row['product_name'];
  const price = row['price'];

  // name and price are required; skip invalid rows
  if (!name || !price) return null;

  const priceStr = price.startsWith('₹') ? price : `₹${price}`;
  const image = row['image'] || row['image_url'] || row['main_image'] || '';
  const hoverImage = row['hover_image'] || row['hover_image_url'] || image;

  // Parse pipe-separated lists
  const parseList = (val: string | undefined): string[] =>
    val ? val.split('|').map((s) => s.trim()).filter(Boolean) : [];

  return {
    id,
    name,
    price: priceStr,
    description: row['description'] || '',
    category: row['category'] || 'Kurti',
    sizes: parseList(row['sizes']) || ['M', 'L', 'XL', 'XXL'],
    color: row['color'] || '',
    code: row['code'] || row['product_code'] || '',
    featured: ['true', '1', 'yes'].includes((row['featured'] || '').toLowerCase()),
    inStock: row['in_stock'] !== undefined
      ? ['true', '1', 'yes'].includes(row['in_stock'].toLowerCase())
      : true,
    image,
    hoverImage,
    images: parseList(row['images']) || [image, hoverImage].filter(Boolean),
    cloudinaryIds: parseList(row['cloudinary_ids']),
    details: parseList(row['details']),
  };
}

// ─── Fetch from public CSV ──────────────────────────────────

async function fetchFromCSV(): Promise<Product[]> {
  if (!SHEETS_CSV_URL) return [];

  const response = await fetch(SHEETS_CSV_URL);
  if (!response.ok) throw new Error(`CSV fetch failed: ${response.status}`);

  const csvText = await response.text();
  const rows = parseCSV(csvText);

  return rows
    .map((row, index) => mapRowToProduct(row, index))
    .filter((p): p is Product => p !== null);
}

// ─── Fetch from server API (service account mode) ───────────

async function fetchFromAPI(): Promise<Product[]> {
  const response = await fetch(SHEETS_API_ENDPOINT);
  if (!response.ok) throw new Error(`API fetch failed: ${response.status}`);

  const data = await response.json();
  if (!Array.isArray(data.products)) throw new Error('Invalid API response');

  return data.products;
}

// ─── Main: Get products (with cache + fallback) ─────────────

export type ProductSource = 'sheets-csv' | 'sheets-api' | 'static';

interface ProductResult {
  products: Product[];
  source: ProductSource;
}

export async function getProducts(): Promise<ProductResult> {
  // Return cached if valid
  if (isCacheValid() && cache) {
    return {
      products: cache.products,
      source: SHEETS_CSV_URL ? 'sheets-csv' : 'sheets-api',
    };
  }

  // Try CSV mode first
  if (SHEETS_CSV_URL) {
    try {
      const products = await fetchFromCSV();
      if (products.length > 0) {
        cache = { products, timestamp: Date.now() };
        return { products, source: 'sheets-csv' };
      }
    } catch (err) {
      console.warn('[Google Sheets CSV] Failed, falling back:', err);
    }
  }

  // Try server API mode
  try {
    const products = await fetchFromAPI();
    if (products.length > 0) {
      cache = { products, timestamp: Date.now() };
      return { products, source: 'sheets-api' };
    }
  } catch {
    // API not configured or failed - this is expected when not using Sheets
  }

  // Fallback to static products
  return { products: staticProducts, source: 'static' };
}

/** Force-clear the client cache */
export function invalidateProductCache(): void {
  cache = null;
}

/** Check if Google Sheets is configured */
export function isSheetsConfigured(): boolean {
  return Boolean(SHEETS_CSV_URL);
}
