/**
 * Production Server for House of Varsha
 * Express server to serve Vite built files + Google Sheets API proxy
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Security headers ───────────────────────────────────────

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ─── Google Sheets API (Service Account mode) ───────────────

// Server-side cache for Sheets data
let sheetsCache = { data: null, timestamp: 0 };
const SHEETS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches products from Google Sheets using a Service Account.
 * Required env vars: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY,
 * GOOGLE_SHEET_ID, GOOGLE_SHEET_RANGE (optional, defaults to 'Sheet1')
 */
async function fetchFromGoogleSheets() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const range = process.env.GOOGLE_SHEET_RANGE || 'Sheet1';

  if (!email || !privateKey || !sheetId) {
    return null; // Not configured
  }

  // Create JWT for Google Sheets API
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })).toString('base64url');

  // Sign with private key
  const { createSign } = await import('crypto');
  const sign = createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const signature = sign.sign(privateKey, 'base64url');
  const jwt = `${header}.${payload}.${signature}`;

  // Exchange JWT for access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!tokenRes.ok) throw new Error(`Token exchange failed: ${tokenRes.status}`);
  const { access_token } = await tokenRes.json();

  // Fetch sheet data
  const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}`;
  const sheetsRes = await fetch(sheetsUrl, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!sheetsRes.ok) throw new Error(`Sheets API failed: ${sheetsRes.status}`);
  const sheetsData = await sheetsRes.json();

  const rows = sheetsData.values || [];
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.toLowerCase().trim());
  return rows.slice(1).map((row, index) => {
    const obj = {};
    headers.forEach((header, i) => { obj[header] = row[i] || ''; });
    return mapRowToProduct(obj, index);
  }).filter(Boolean);
}

function mapRowToProduct(row, index) {
  const id = row['id'] || row['product_id'] || `sheet-${index}`;
  const name = row['name'] || row['product_name'];
  const price = row['price'];

  if (!name || !price) return null;

  const priceStr = price.startsWith('\u20B9') ? price : `\u20B9${price}`;
  const image = row['image'] || row['image_url'] || row['main_image'] || '';
  const hoverImage = row['hover_image'] || row['hover_image_url'] || image;
  const parseList = (val) => val ? val.split('|').map(s => s.trim()).filter(Boolean) : [];

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

app.get('/api/products', async (req, res) => {
  try {
    // Check cache
    if (sheetsCache.data && Date.now() - sheetsCache.timestamp < SHEETS_CACHE_TTL) {
      return res.json({ products: sheetsCache.data, source: 'sheets-api', cached: true });
    }

    const products = await fetchFromGoogleSheets();
    if (products && products.length > 0) {
      sheetsCache = { data: products, timestamp: Date.now() };
      return res.json({ products, source: 'sheets-api', cached: false });
    }

    res.status(404).json({ error: 'No products found or Sheets not configured' });
  } catch (err) {
    console.error('[Sheets API Error]', err.message);
    res.status(500).json({ error: 'Failed to fetch products from Google Sheets' });
  }
});

// Revalidation endpoint: POST /api/products/revalidate
app.post('/api/products/revalidate', (req, res) => {
  sheetsCache = { data: null, timestamp: 0 };
  res.json({ ok: true, message: 'Product cache cleared' });
});

// ─── Serve static files from dist folder ────────────────────

app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  immutable: true,
  index: false, // Don't serve index.html for directory requests via static
}));

// Serve index.html without cache headers
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: 0,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

// ─── Health check endpoint ──────────────────────────────────

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    sheetsConfigured: Boolean(process.env.GOOGLE_SHEET_ID),
  });
});

// ─── Handle client-side routing (SPA fallback) ──────────────

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ─── Error handling ─────────────────────────────────────────

app.use((err, req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`House of Varsha server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`Sheets API: ${process.env.GOOGLE_SHEET_ID ? 'configured' : 'not configured (using static products)'}`);
});
