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

## Production Deployment (Hostinger Managed Node.js)

Hostinger Website Hosting with managed Node.js — no Docker, PM2, or NGINX needed.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full step-by-step guide.

### Quick Setup

1. hPanel -> **Advanced** -> **Node.js** -> Create Application
   - Startup file: `server.js`
   - Node.js version: 20.x
2. Upload code via Git or File Manager
3. Click **Run NPM Install** (auto-builds via `postinstall`)
4. Click **Restart**
5. Visit your domain

### Key Files for Hostinger

| File | Purpose |
|------|---------|
| `server.js` | Express server (startup file for hPanel) |
| `.npmrc` | Ensures devDependencies install for build |
| `.htaccess` | Apache proxy rules |
| `postinstall` script | Auto-runs `npm run build` after install |

### Common Pitfalls

| Issue | Fix |
|-------|-----|
| Application Error | Verify `server.js` is set as startup file in hPanel |
| "localhost refused to connect" in dev | Use `npm run dev` (port 5173), not `npm start` |
| Build fails on Hostinger | Build locally, upload `dist/` folder |
| Sheets not updating | `POST /api/products/revalidate` |
| Routes show 404 | Ensure `.htaccess` is in app root |

### Updating

1. Push to GitHub
2. hPanel -> Git -> Pull
3. hPanel -> Node.js -> Run NPM Install -> Restart

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
