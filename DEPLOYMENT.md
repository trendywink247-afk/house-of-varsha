# House of Varsha - Hostinger Deployment Guide

## Hosting: Hostinger Website Hosting (Managed Node.js)

This app runs on Hostinger's managed Node.js hosting via hPanel.
No Docker, no PM2, no NGINX configuration needed.

---

## How It Works

```
[Browser] -> [Hostinger Apache/LiteSpeed] -> [Node.js (server.js)] -> [Vite SPA from dist/]
```

1. Hostinger runs `npm install` which triggers `postinstall` -> `npm run build`
2. Hostinger starts `server.js` on the assigned `PORT`
3. Apache/LiteSpeed proxies HTTPS traffic to your Node.js app
4. `server.js` serves the built SPA from `dist/` and handles API routes

---

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Deploy to Hostinger"
git push origin main
```

### 2. Set Up Node.js in hPanel

1. Log in to [hPanel](https://hpanel.hostinger.com)
2. Go to **Website** -> **Advanced** -> **Node.js**
3. Click **Create Application**:

| Setting | Value |
|---------|-------|
| **Node.js version** | 20.x (or latest LTS) |
| **Application root** | `/` (or subfolder path) |
| **Application startup file** | `server.js` |

4. Click **Create**

### 3. Upload Code

**Option A: Git (recommended)**
- hPanel -> **Files** -> **Git** -> Connect repo -> Pull

**Option B: File Manager / SSH**
- Upload all files to app root
- Ensure `server.js`, `package.json`, `src/` are at root level

### 4. Install & Build

In hPanel -> **Node.js** -> your app:
1. Click **Run NPM Install** (auto-builds via `postinstall`)
2. Wait 1-2 minutes
3. Click **Restart**

Or via SSH:
```bash
cd ~/public_html
npm install
```

### 5. Set Environment Variables (optional, for Google Sheets)

hPanel -> **Node.js** -> **Environment Variables**:

For Public CSV mode:
```
VITE_GOOGLE_SHEETS_CSV_URL = https://docs.google.com/spreadsheets/d/e/YOUR_ID/pub?output=csv
```

For Service Account mode:
```
GOOGLE_SERVICE_ACCOUNT_EMAIL = your-sa@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY = -----BEGIN RSA PRIVATE KEY-----\n...
GOOGLE_SHEET_ID = your_sheet_id
GOOGLE_SHEET_RANGE = Sheet1
```

> Note: After setting `VITE_*` vars, re-run NPM Install to rebuild the client bundle.

### 6. Verify

Visit your domain. Check health:
```
https://your-domain.com/health
-> {"status":"ok","timestamp":"...","sheetsConfigured":false}
```

---

## Updating the Site

1. Push to GitHub
2. hPanel -> Git -> Pull
3. hPanel -> Node.js -> Run NPM Install -> Restart

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Application Error / blank page | Verify `server.js` is the startup file in hPanel |
| Build fails | Check Node.js >= 18; try building locally and uploading `dist/` |
| Sheets not loading | Check env vars; clear cache: `POST /api/products/revalidate` |
| "Cannot find module" | Re-run NPM Install; verify `.npmrc` is present |
| Routes show 404 | Verify `.htaccess` is in app root |

---

## Key Files

| File | Purpose |
|------|---------|
| `server.js` | Express production server (startup file) |
| `package.json` | Dependencies + `postinstall` auto-build |
| `.npmrc` | Ensures devDependencies install on Hostinger |
| `.htaccess` | Apache proxy rules for Hostinger |
| `dist/` | Built SPA (auto-generated) |
| `.env.example` | Environment variable template |
