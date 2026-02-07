# House of Varsha - Ecommerce Application

A premium, minimalist boutique website celebrating elegance and storytelling through handcrafted products.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version 18.17.0 or higher)
- **npm** (version 8.0.0 or higher)

### Installation

1. **Install Node.js and npm** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/) (Recommended: LTS version)
   - Or use a version manager like [nvm](https://github.com/nvm-sh/nvm)

2. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd house-of-varsha
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add your configuration:

   ```env
   # Cloudinary Configuration (Required for images)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Google Sheets Configuration (Optional - for dynamic products)
   # Option 1: Service Account API (Recommended)
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID=your_google_sheet_id

   # Option 2: Public CSV (Simpler setup)
   # GOOGLE_SHEETS_PRODUCTS_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?gid=0&single=true&output=csv
   # GOOGLE_SHEETS_SETTINGS_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?gid=SETTINGS_TAB_GID&single=true&output=csv

   # Revalidation Secret (Optional)
   REVALIDATION_SECRET=your_random_secret_string
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000)

## 📋 Configuration Options

### 1. Static Products (No Configuration Required)
The application will automatically use fallback products from `data/products.ts` if no Google Sheets configuration is provided.

### 2. Google Sheets Integration

#### Option A: Service Account API (Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create a Service Account:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "Service Account"
   - Give it a name (e.g., "sheet-reader")
   - Skip optional steps, click Done
5. Create a key for the service account:
   - Click on the service account email
   - Go to "Keys" tab > "Add Key" > "Create new key"
   - Choose JSON format, download the file
6. Copy values from the JSON file to your `.env.local`

#### Option B: Published CSV (Simpler Setup)
1. Create your Google Sheet
2. Go to File > Share > Publish to web
3. Choose CSV format and copy the URL
4. Add the URLs to your `.env.local`

### 3. Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com/users/register_free)
2. Find credentials in your Cloudinary Dashboard
3. Add to your `.env.local`

## 🏗️ Project Structure

```
house-of-varsha/
├── app/                    # Next.js App Router pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── shop/               # Shop page
│   └── products/           # Product detail pages
├── components/             # Reusable components
│   ├── Header.tsx          # Site header
│   ├── Footer.tsx          # Site footer
│   ├── ProductCard.tsx     # Product display card
│   └── ProductGallery.tsx  # Product image gallery
├── data/                   # Static data
│   └── products.ts         # Fallback products
├── lib/                    # Utility functions
│   ├── data.ts             # Data fetching layer
│   ├── googleSheets.ts     # Google Sheets integration
│   └── cloudinary.ts       # Cloudinary utilities
├── app/
│   └── api/
│       └── revalidate/     # Cache revalidation endpoint
├── .env.example            # Environment variables template
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

## 🎨 Features

### Core Features
- **Responsive Design**: Mobile-first, works on all devices
- **Dynamic Products**: Load products from Google Sheets or use static fallback
- **Image Management**: Cloudinary integration for optimized images
- **Cache Management**: Automatic revalidation and caching
- **WhatsApp Integration**: Direct ordering via WhatsApp
- **Instagram Integration**: Social media links

### Pages
- **Home**: Hero section with featured products
- **Shop**: Product catalog with filtering
- **Product Detail**: Individual product pages with variants
- **About**: Brand story and information
- **Contact**: Contact information and social links

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in [Vercel](https://vercel.com/)
3. Set environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The application can be deployed on any platform that supports Node.js and Next.js.

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting
```

### Adding Products
1. **Via Google Sheets** (Recommended):
   - Update your Google Sheet with product data
   - Use the revalidation endpoint to refresh cache

2. **Via Static Data**:
   - Edit `data/products.ts`
   - Add products in the specified format

### Revalidation
Trigger cache refresh when Google Sheets data is updated:
```bash
# Via API
curl -X POST "https://your-domain.com/api/revalidate?secret=your_secret"

# With specific path
curl -X POST "https://your-domain.com/api/revalidate?secret=your_secret&path=/shop"
```

## 🐛 Troubleshooting

### Common Issues

1. **"npm not found"**
   - Install Node.js from [nodejs.org](https://nodejs.org/)
   - Restart your terminal

2. **Environment variables not loading**
   - Ensure `.env.local` file exists in root directory
   - Check that variables match the expected format
   - Restart development server after changes

3. **Google Sheets not loading**
   - Verify service account has access to the sheet
   - Check that sheet is shared with service account email
   - Ensure Google Sheets API is enabled

4. **Cloudinary images not loading**
   - Verify Cloudinary credentials are correct
   - Check that images exist in Cloudinary
   - Ensure public IDs are correct

### Debug Mode
Enable debug logging by adding to your `.env.local`:
```env
DEBUG=house-of-varsha:*
```

## 📞 Support

For issues and questions:
1. Check the [GitHub Issues](https://github.com/your-username/house-of-varsha/issues)
2. Review the troubleshooting section above
3. Create a new issue with detailed information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**House of Varsha** - Celebrating elegance and storytelling through premium handcrafted products.