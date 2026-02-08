# House of Varsha

Handcrafted Indian Ethnic Wear - E-commerce storefront.

**Stack:** Vite + React 19 + TypeScript + Tailwind CSS + GSAP + Express

## Quick Start

```bash
npm install
npm run dev        # Development server (Vite, http://localhost:5173)
npm run build      # Production build -> dist/
npm start          # Production server (Express, port 3000)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite production build |
| `npm run typecheck` | TypeScript type checking only |
| `npm run lint` | ESLint check |
| `npm run preview` | Preview production build locally |
| `npm start` | Start Express production server |

## Project Structure

```
src/
  components/     # Reusable UI components (Header, CartDrawer, Marquee)
    ui/           # Shadcn UI primitives
  data/           # Static product data (fallback)
  hooks/          # React hooks (useCart, useProducts)
  lib/            # Utilities (utils.ts, google-sheets.ts)
  pages/          # Route pages (Shop, ProductDetail, About, Contact)
  sections/       # Home page sections (Hero, FeaturedCollection, etc.)
  types/          # TypeScript type definitions
server.js         # Express production server + Sheets API proxy
```

## Google Sheets Integration

Products can be loaded dynamically from Google Sheets with automatic fallback to `src/data/products.ts`.

### Mode A: Public CSV (no auth required)

1. Open your Google Sheet
2. Go to **File > Share > Publish to web**
3. Select **Sheet1** and format **CSV**, click Publish
4. Copy the URL and set it in your `.env.local` (dev) or `.env` (production):

```bash
VITE_GOOGLE_SHEETS_CSV_URL=https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv
```

### Mode B: Service Account (private sheet, server-side only)

1. Create a Service Account in [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Enable the Google Sheets API
3. Download the JSON key file
4. Share your Google Sheet with the service account email (Viewer access)
5. Set these server-side env vars:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SHEET_RANGE=Sheet1
```

### Google Sheet Column Format

| Column | Required | Notes |
|--------|----------|-------|
| `id` | Yes | Unique product ID (e.g., `p001`) |
| `name` | Yes | Product name |
| `price` | Yes | Price with or without currency symbol |
| `description` | No | Product description |
| `category` | No | e.g., `Kurti`, `Kurti Set` |
| `sizes` | No | Pipe-separated: `M\|L\|XL\|XXL` |
| `color` | No | Color name |
| `code` | No | Product code |
| `featured` | No | `true` or `false` |
| `in_stock` | No | `true` or `false` (default: true) |
| `image` | No | Main image URL |
| `hover_image` | No | Hover image URL |
| `images` | No | Pipe-separated gallery URLs |
| `details` | No | Pipe-separated detail strings |

### How to Refresh Products

- **Automatic:** Products cache for 5 minutes, then re-fetch on next page load
- **Manual (server API mode):** `curl -X POST http://localhost:3000/api/products/revalidate`
- **Check source:** Visit `/health` endpoint to see if Sheets is configured

### How to Confirm Product Source

- Open browser DevTools > Network tab
- If `VITE_GOOGLE_SHEETS_CSV_URL` is set: look for the CSV fetch request
- If Service Account mode: look for `/api/products` request
- If neither: products come from the static `src/data/products.ts` file (no network request)

---

## Production Deployment (Hostinger)

### Option 1: Docker (Recommended)

Hostinger VPS with Docker Manager:

```bash
# 1. SSH into your VPS
ssh root@your-vps-ip

# 2. Clone the repo
git clone https://github.com/trendywink247-afk/house-of-varsha.git
cd house-of-varsha

# 3. Create .env file with your config
cp .env.example .env
# Edit .env with your values (nano .env)

# 4. Build and run with Docker
docker compose up -d --build

# 5. Verify
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"...","sheetsConfigured":false}
```

The container:
- Runs on port 3000 (map to 80/443 via NGINX or Hostinger's proxy)
- Uses a multi-stage build (small final image ~180MB)
- Runs as non-root user
- Auto-restarts on failure
- Has a health check endpoint

### Option 2: PM2 (No Docker)

```bash
# 1. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 2. Install PM2
npm install -g pm2

# 3. Clone and build
git clone https://github.com/trendywink247-afk/house-of-varsha.git
cd house-of-varsha
npm ci
npm run build

# 4. Create logs directory
mkdir -p logs

# 5. Start with PM2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup  # Auto-start on reboot
```

### NGINX Reverse Proxy (Both Options)

```bash
# Copy config
cp nginx.conf /etc/nginx/sites-available/house-of-varsha
# Edit: replace your-domain.com with actual domain
ln -s /etc/nginx/sites-available/house-of-varsha /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### SSL Certificate

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Common Pitfalls

| Issue | Cause | Fix |
|-------|-------|-----|
| Port already in use | Another process on port 3000 | `lsof -i :3000` then kill it, or change `PORT` in `.env` |
| "localhost refused to connect" in dev | Vite runs on port 5173, not 3000 | Use `npm run dev` (port 5173) for development |
| Build fails with OOM | Low memory VPS | Add swap: `fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile` |
| Images not loading | Cloudinary URLs hardcoded | Images are on Cloudinary CDN, no config needed |
| Docker build slow | No layer caching | Use `docker compose build` (caches npm install layer) |
| Sheets data not updating | Server cache | POST to `/api/products/revalidate` or restart container |

### Updating the Site

```bash
# Docker
cd house-of-varsha
git pull
docker compose up -d --build

# PM2
cd house-of-varsha
git pull
npm ci
npm run build
pm2 restart house-of-varsha
```

---

## Commands to Verify

```bash
# Install dependencies
npm ci

# Type checking
npm run typecheck

# Lint
npm run lint

# Production build
npm run build
# Expected: "built in Xs" with dist/ output

# Start production server
npm start
# Expected: "House of Varsha server running on port 3000"

# Health check
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"...","sheetsConfigured":false}
```
