/**
 * Production Server for House of Varsha
 * Express server to serve Vite built files + Google Sheets API proxy
 *
 * Security overhaul:
 *  - Server-side price validation (prevents price manipulation)
 *  - MySQL-backed stock management (replaces stock.json)
 *  - Contact form with email + WhatsApp
 *  - HSTS, tightened CSP, protected revalidation
 *  - Per-route rate limiting
 *  - Graceful shutdown
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ─── MySQL connection pool ──────────────────────────────────

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'u524306250_ruflo',
  password: process.env.DB_PASS || '7995767472@Geekspace',
  database: process.env.DB_NAME || 'u524306250_ruflo',
};

let pool;
let dbConnected = false;

try {
  pool = mysql.createPool(dbConfig);
  // Quick connectivity check on startup
  pool.getConnection()
    .then((conn) => {
      dbConnected = true;
      conn.release();
      console.log('[DB] MySQL pool connected');
    })
    .catch((err) => {
      console.error('[DB] MySQL connection failed, stock falls back to file:', err.message);
    });
} catch (err) {
  console.error('[DB] Failed to create MySQL pool:', err.message);
}

// ─── SMTP transport (Nodemailer) ────────────────────────────

const smtpTransport = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}) : null;

// ─── CORS ───────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  'https://www.houseofvarsha.in',
  'https://houseofvarsha.in',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-revalidate-secret');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ─── Rate limiting (in-memory, per IP, per bucket) ──────────

const rateLimitBuckets = new Map(); // key = bucketName, value = Map<ip, { start, count }>
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

/**
 * Creates a rate-limiting middleware for a named bucket.
 * @param {string} bucketName  Unique identifier for the limit group
 * @param {number} max         Max requests per window per IP
 */
function createRateLimit(bucketName, max) {
  if (!rateLimitBuckets.has(bucketName)) {
    rateLimitBuckets.set(bucketName, new Map());
  }
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    const now = Date.now();
    const bucket = rateLimitBuckets.get(bucketName);
    const entry = bucket.get(ip);

    if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
      bucket.set(ip, { start: now, count: 1 });
      return next();
    }

    entry.count++;
    if (entry.count > max) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    next();
  };
}

// Clean up all rate limit buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const bucket of rateLimitBuckets.values()) {
    for (const [ip, entry] of bucket) {
      if (now - entry.start > RATE_LIMIT_WINDOW) bucket.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Attach per-route rate limits
app.use('/api/checkout', createRateLimit('checkout', 10));
app.use('/api/contact', createRateLimit('contact', 5));
app.use('/api/products/revalidate', createRateLimit('revalidate', 3));
app.use('/api/stock', createRateLimit('stock', 30));
app.use('/api/products', createRateLimit('products', 30));

// ─── Security headers ───────────────────────────────────────

app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://res.cloudinary.com",
    "connect-src 'self' https://api.razorpay.com https://lumberjack-cx.razorpay.com",
    "frame-src https://api.razorpay.com https://checkout.razorpay.com",
  ].join('; '));
  next();
});

// ─── Stock management (MySQL, file fallback) ────────────────

const STOCK_FILE = path.join(__dirname, 'stock.json');

/**
 * Returns the sold-out map from MySQL.
 * Falls back to stock.json if the DB is unreachable.
 */
async function getStock() {
  if (pool && dbConnected) {
    try {
      const [rows] = await pool.execute(
        'SELECT product_size_key FROM hov_stock WHERE sold_out = 1',
      );
      const stock = {};
      for (const row of rows) {
        stock[row.product_size_key] = true;
      }
      return stock;
    } catch (err) {
      console.error('[Stock] MySQL read failed, falling back to file:', err.message);
    }
  }
  // File fallback
  try {
    if (fs.existsSync(STOCK_FILE)) {
      return JSON.parse(fs.readFileSync(STOCK_FILE, 'utf8'));
    }
  } catch { /* ignore */ }
  return {};
}

/**
 * Marks a single product-size key as sold in MySQL.
 */
async function markSold(key) {
  if (pool && dbConnected) {
    await pool.execute(
      'INSERT INTO hov_stock (product_size_key, sold_out) VALUES (?, 1) ON DUPLICATE KEY UPDATE sold_out = 1, sold_at = NOW()',
      [key],
    );
  }
}

/**
 * Checks whether specific keys are sold out (MySQL).
 * Returns an object of sold keys.
 */
async function checkSoldKeys(keys) {
  if (!pool || !dbConnected || keys.length === 0) return {};
  try {
    const placeholders = keys.map(() => '?').join(',');
    const [rows] = await pool.execute(
      `SELECT product_size_key FROM hov_stock WHERE sold_out = 1 AND product_size_key IN (${placeholders})`,
      keys,
    );
    const sold = {};
    for (const row of rows) {
      sold[row.product_size_key] = true;
    }
    return sold;
  } catch (err) {
    console.error('[Stock] MySQL check failed:', err.message);
    return {};
  }
}

// GET /api/stock
app.get('/api/stock', async (req, res) => {
  try {
    const stock = await getStock();
    res.json(stock);
  } catch (err) {
    console.error('[Stock]', err.message);
    res.status(500).json({ error: 'Failed to load stock data' });
  }
});

// ─── Product price lookup (server-side validation) ──────────

let productsData = null;

function loadProductsData() {
  const productsFile = path.join(__dirname, 'products.json');
  try {
    if (fs.existsSync(productsFile)) {
      productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
      console.log(`[Products] Loaded ${productsData.length} products from products.json`);
    }
  } catch (err) {
    console.warn('[Products] Could not load products.json:', err.message);
  }
}

loadProductsData();

/**
 * Parses a price string like "₹995" or "₹1,295" to a numeric value.
 */
function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  if (typeof priceStr !== 'string') return NaN;
  return parseFloat(priceStr.replace(/[₹,\s]/g, ''));
}

/**
 * Given a cart items array, looks up real prices from productsData
 * and returns the server-calculated total (or null if lookup not possible).
 */
function calculateServerTotal(items) {
  if (!productsData || !Array.isArray(productsData)) return null;

  const priceMap = {};
  for (const p of productsData) {
    priceMap[p.id] = parsePrice(p.price);
  }

  let total = 0;
  for (const item of items) {
    const productId = item.product?.id || item.productId;
    if (!productId || !(productId in priceMap)) return null; // unknown product
    const unitPrice = priceMap[productId];
    if (isNaN(unitPrice)) return null;
    const qty = item.quantity || 1;
    total += unitPrice * qty;
  }
  return total;
}

// ─── Razorpay checkout ──────────────────────────────────────

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// POST /api/checkout/create-order
app.post('/api/checkout/create-order', async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ error: 'Payment gateway not configured' });
    }

    // Check for sold-out items before creating order
    const keys = items.map((item) => `${item.product?.id || item.productId}-${item.size}`);
    let stock;
    if (pool && dbConnected) {
      stock = await checkSoldKeys(keys);
    } else {
      stock = await getStock();
    }

    for (const item of items) {
      const key = `${item.product?.id || item.productId}-${item.size}`;
      if (stock[key]) {
        return res.status(409).json({
          error: `Sorry, ${item.product?.name || item.productId} in size ${item.size} is no longer available.`,
        });
      }
    }

    // Server-side price validation
    let finalAmount;
    const serverTotal = calculateServerTotal(items);
    if (serverTotal !== null) {
      finalAmount = serverTotal;
      if (typeof totalAmount === 'number' && Math.abs(serverTotal - totalAmount) > 0.01) {
        console.warn(
          `[Checkout] Price mismatch — client sent ${totalAmount}, server calculated ${serverTotal}. Using server total.`,
        );
      }
    } else {
      // products.json not available or item lookup failed — backwards compat
      console.warn('[Checkout] Could not verify prices server-side, using client totalAmount');
      finalAmount = totalAmount;
    }

    if (!finalAmount || finalAmount <= 0) {
      return res.status(400).json({ error: 'Invalid order amount' });
    }

    // Create Razorpay order via REST API (avoids SDK ESM issues)
    const amountInPaise = Math.round(finalAmount * 100);
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      }),
    });

    if (!orderRes.ok) {
      const errData = await orderRes.json();
      console.error('[Razorpay] Order creation failed:', errData);
      return res.status(502).json({ error: 'Failed to create payment order' });
    }

    const order = await orderRes.json();
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, key: RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('[Checkout create-order]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/checkout/verify
app.post('/api/checkout/verify', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, items } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Missing payment fields' });
    }

    if (!RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ success: false, error: 'Payment gateway not configured' });
    }

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.warn('[Checkout verify] Signature mismatch');
      return res.status(400).json({ success: false, error: 'Payment verification failed' });
    }

    // Mark purchased sizes as sold
    if (items && Array.isArray(items)) {
      if (pool && dbConnected) {
        for (const item of items) {
          const key = `${item.product?.id || item.productId}-${item.size}`;
          try {
            await markSold(key);
          } catch (err) {
            console.error(`[Stock] Failed to mark ${key} as sold:`, err.message);
          }
        }
      } else {
        // File fallback
        try {
          let stock = {};
          if (fs.existsSync(STOCK_FILE)) {
            stock = JSON.parse(fs.readFileSync(STOCK_FILE, 'utf8'));
          }
          for (const item of items) {
            const key = `${item.product?.id || item.productId}-${item.size}`;
            stock[key] = true;
          }
          fs.writeFileSync(STOCK_FILE, JSON.stringify(stock, null, 2));
        } catch (err) {
          console.error('[Stock] File write fallback failed:', err.message);
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[Checkout verify]', err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ─── Contact form endpoint ──────────────────────────────────

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const sanitizedName = name.trim().slice(0, 200);
    const sanitizedEmail = email.trim().slice(0, 320);
    const sanitizedSubject = (subject || '').trim().slice(0, 500);
    const sanitizedMessage = message.trim().slice(0, 5000);
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;

    // Save to MySQL
    if (pool && dbConnected) {
      try {
        await pool.execute(
          'INSERT INTO hov_contact_messages (name, email, subject, message, ip_address, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
          [sanitizedName, sanitizedEmail, sanitizedSubject, sanitizedMessage, ip],
        );
      } catch (err) {
        console.error('[Contact] MySQL insert failed:', err.message);
        // Continue even if DB insert fails — still send email / return WhatsApp link
      }
    }

    // Send email if SMTP is configured
    const contactEmail = process.env.CONTACT_EMAIL || 'hello@houseofvarsha.com';
    if (smtpTransport) {
      try {
        await smtpTransport.sendMail({
          from: `"House of Varsha Contact" <${process.env.SMTP_USER}>`,
          to: contactEmail,
          replyTo: sanitizedEmail,
          subject: sanitizedSubject || `New contact message from ${sanitizedName}`,
          text: [
            `Name: ${sanitizedName}`,
            `Email: ${sanitizedEmail}`,
            sanitizedSubject ? `Subject: ${sanitizedSubject}` : '',
            '',
            `Message:`,
            sanitizedMessage,
          ].filter(Boolean).join('\n'),
          html: [
            `<h3>New Contact Form Message</h3>`,
            `<p><strong>Name:</strong> ${sanitizedName}</p>`,
            `<p><strong>Email:</strong> ${sanitizedEmail}</p>`,
            sanitizedSubject ? `<p><strong>Subject:</strong> ${sanitizedSubject}</p>` : '',
            `<hr>`,
            `<p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>`,
          ].filter(Boolean).join('\n'),
        });
      } catch (err) {
        console.error('[Contact] Email send failed:', err.message);
        // Continue — WhatsApp link still returned
      }
    }

    // Build WhatsApp deep link
    const waText = [
      `Hi, I'm ${sanitizedName}.`,
      sanitizedSubject ? `Subject: ${sanitizedSubject}` : '',
      `Message: ${sanitizedMessage}`,
      `(Email: ${sanitizedEmail})`,
    ].filter(Boolean).join('\n');

    const whatsappUrl = `https://wa.me/917989733041?text=${encodeURIComponent(waText)}`;

    res.json({ success: true, whatsappUrl });
  } catch (err) {
    console.error('[Contact]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
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
  const sign = crypto.createSign('RSA-SHA256');
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

    // Fallback: serve static product data from products.json if available
    const productsFile = path.join(__dirname, 'products.json');
    if (fs.existsSync(productsFile)) {
      try {
        const staticProducts = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
        return res.json({ products: staticProducts, source: 'static', cached: false });
      } catch { /* fall through */ }
    }

    res.status(404).json({ error: 'No products found or Sheets not configured' });
  } catch (err) {
    console.error('[Sheets API Error]', err.message);
    res.status(500).json({ error: 'Failed to fetch products from Google Sheets' });
  }
});

// Revalidation endpoint: POST /api/products/revalidate (protected)
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'hov-revalidate-2026';

app.post('/api/products/revalidate', (req, res) => {
  const secret = req.headers['x-revalidate-secret'];
  if (secret !== REVALIDATE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  sheetsCache = { data: null, timestamp: 0 };

  // Also reload products.json for price validation
  loadProductsData();

  res.json({ ok: true, message: 'Product cache cleared' });
});

// ─── Serve static files ─────────────────────────────────────

// Check if we're running from source (dist/ exists) or deployed (files at root)
const staticDir = fs.existsSync(path.join(__dirname, 'dist', 'index.html'))
  ? path.join(__dirname, 'dist')
  : __dirname;

app.use(express.static(staticDir, {
  maxAge: '1y',
  immutable: true,
  index: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

// ─── Health check endpoint ──────────────────────────────────

app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  if (pool && dbConnected) {
    try {
      await pool.execute('SELECT 1');
      dbStatus = 'connected';
    } catch {
      dbStatus = 'disconnected';
    }
  }

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    sheetsConfigured: Boolean(process.env.GOOGLE_SHEET_ID),
    db: dbStatus,
  });
});

// ─── Handle client-side routing (SPA fallback) ──────────────

app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// ─── Error handling ─────────────────────────────────────────

app.use((err, req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start server ───────────────────────────────────────────

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`House of Varsha server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`Sheets API: ${process.env.GOOGLE_SHEET_ID ? 'configured' : 'not configured (using static products)'}`);
  console.log(`SMTP: ${smtpTransport ? 'configured' : 'not configured'}`);
  console.log(`DB: ${dbConnected ? 'connected' : 'pending/unavailable (file fallback)'}`);
});

// ─── Graceful shutdown ──────────────────────────────────────

function gracefulShutdown(signal) {
  console.log(`\n[${signal}] Shutting down gracefully...`);
  server.close(async () => {
    if (pool) {
      try {
        await pool.end();
        console.log('[DB] MySQL pool closed');
      } catch (err) {
        console.error('[DB] Error closing pool:', err.message);
      }
    }
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('[Shutdown] Forced exit after timeout');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
