#!/bin/bash
# Deploy House of Varsha to Hostinger VPS
# Run this script on your Hostinger VPS

set -e

echo "🚀 Deploying House of Varsha to Hostinger VPS..."
echo "================================================"

# Configuration
DOMAIN="houseofvarsha.in"
REPO_URL="https://github.com/trendywink247-afk/house-of-varsha.git"
APP_DIR="/var/www/house-of-varsha"
NODE_VERSION="20"

echo ""
echo "📋 Deployment Configuration:"
echo "  Domain: $DOMAIN"
echo "  App Directory: $APP_DIR"
echo "  Node Version: $NODE_VERSION"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Update system
echo "🔄 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js if not installed
echo "🟢 Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js $NODE_VERSION..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
else
    echo "✅ Node.js already installed: $(node -v)"
fi

# Install PM2 globally
echo "📦 Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Install NGINX
echo "📦 Installing NGINX..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
fi

# Install Certbot for SSL
echo "📦 Installing Certbot..."
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
fi

# Create app directory
echo "📁 Setting up application directory..."
mkdir -p $APP_DIR

# Clone or pull repository
if [ -d "$APP_DIR/.git" ]; then
    echo "🔄 Pulling latest changes..."
    cd $APP_DIR
    git pull origin main
else
    echo "📥 Cloning repository..."
    rm -rf $APP_DIR
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Create logs directory
mkdir -p logs

# Setup PM2
echo "🚀 Starting application with PM2..."
pm2 delete house-of-varsha 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd -u root --hp /root

# Setup NGINX
echo "🔧 Configuring NGINX..."
cat > /etc/nginx/sites-available/house-of-varsha << 'EOF'
server {
    listen 80;
    server_name houseofvarsha.in www.houseofvarsha.in;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
if [ ! -L "/etc/nginx/sites-enabled/house-of-varsha" ]; then
    ln -s /etc/nginx/sites-available/house-of-varsha /etc/nginx/sites-enabled/
fi

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test NGINX config
nginx -t

# Restart NGINX
systemctl restart nginx

# Configure firewall
echo "🔒 Configuring firewall..."
ufw allow 'Nginx Full' 2>/dev/null || true
ufw allow OpenSSH 2>/dev/null || true
ufw --force enable 2>/dev/null || true

# Get SSL certificate
echo "🔐 Setting up SSL certificate..."
certbot --nginx -d houseofvarsha.in -d www.houseofvarsha.in --non-interactive --agree-tos --email admin@houseofvarsha.in || true

echo ""
echo "✅ Deployment Complete!"
echo "================================================"
echo "🌐 Your website is now live at:"
echo "   http://houseofvarsha.in"
echo "   https://houseofvarsha.in (after SSL)"
echo ""
echo "📊 Useful commands:"
echo "   pm2 status           - Check app status"
echo "   pm2 logs             - View logs"
echo "   pm2 restart all      - Restart app"
echo "   nginx -t             - Test NGINX config"
echo ""
echo "⚠️  Make sure your domain DNS points to this server IP!"
echo ""
