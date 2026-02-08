# House of Varsha - Hostinger VPS Deployment Guide

## Architecture Overview

- **Stack:** Vite + React + TypeScript + Tailwind CSS
- **Build Tool:** Vite 7.2.4
- **Runtime:** Node.js 18+
- **Server:** Express.js (production)
- **Process Manager:** PM2
- **Reverse Proxy:** NGINX
- **Images:** Cloudinary CDN

---

## Pre-Deployment Checklist

### 1. Local Testing
```bash
npm install
npm run dev
# Test at http://localhost:5173
```

### 2. Build Test
```bash
npm run build
npm start
# Test at http://localhost:3000
```

---

## Hostinger VPS Setup

### Step 1: Connect to VPS
```bash
ssh root@your-vps-ip
```

### Step 2: Install Node.js 20
```bash
# Using NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node -v  # Should show v20.x.x
npm -v   # Should show 10.x.x
```

### Step 3: Install PM2 Globally
```bash
sudo npm install -g pm2
```

### Step 4: Clone Repository
```bash
cd /var/www
git clone https://github.com/trendywink247-afk/house-of-varsha.git
cd house-of-varsha
```

### Step 5: Install Dependencies & Build
```bash
npm install
npm run build
```

### Step 6: Create Logs Directory
```bash
mkdir -p logs
```

### Step 7: Start with PM2
```bash
pm2 start ecosystem.config.cjs

# Save PM2 config to restart on boot
pm2 save
pm2 startup systemd
```

---

## NGINX Configuration

### Step 1: Install NGINX
```bash
sudo apt update
sudo apt install nginx
```

### Step 2: Configure Firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Step 3: Copy NGINX Config
```bash
sudo cp nginx.conf /etc/nginx/sites-available/house-of-varsha

# Update domain name in config
sudo nano /etc/nginx/sites-available/house-of-varsha
# Change: your-domain.com → your actual domain
```

### Step 4: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/house-of-varsha /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## SSL Certificate (Let's Encrypt)

### Step 1: Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

### Step 2: Obtain Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Step 3: Auto-Renewal
```bash
sudo systemctl status certbot.timer
```

---

## Environment Variables

Create `.env` file in production:
```bash
NODE_ENV=production
PORT=3000
```

---

## Useful Commands

### PM2 Management
```bash
pm2 status                    # View status
pm2 logs house-of-varsha      # View logs
pm2 restart house-of-varsha   # Restart app
pm2 stop house-of-varsha      # Stop app
pm2 delete house-of-varsha    # Remove from PM2
```

### Deployment Updates
```bash
cd /var/www/house-of-varsha
git pull origin main
npm install
npm run build
pm2 restart house-of-varsha
```

### NGINX Management
```bash
sudo nginx -t                 # Test config
sudo systemctl restart nginx  # Restart NGINX
sudo systemctl status nginx   # Check status
```

---

## Troubleshooting

### Port Already in Use
```bash
sudo lsof -i :3000
sudo kill -9 <PID>
```

### PM2 Won't Start
```bash
pm2 delete all
pm2 start ecosystem.config.cjs
pm2 save
```

### Permission Issues
```bash
sudo chown -R www-data:www-data /var/www/house-of-varsha
```

---

## Security Checklist

- [ ] Firewall enabled (UFW)
- [ ] SSL certificate installed
- [ ] NGINX security headers configured
- [ ] Node.js not running as root
- [ ] PM2 auto-restart enabled
- [ ] Logs rotated (configure logrotate)

---

## Health Check

Once deployed, verify:
```bash
curl https://your-domain.com/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

## Domain DNS Setup

Point your domain to VPS IP:
- A Record: @ → your-vps-ip
- A Record: www → your-vps-ip

Wait for DNS propagation (5-60 minutes).
