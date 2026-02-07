#!/usr/bin/env node

/**
 * House of Varsha - Cloudinary Image Uploader
 *
 * Uploads all images from a local folder to Cloudinary.
 * Organizes them into folders: products/, hero/, and general/
 *
 * Usage:
 *   node scripts/upload-to-cloudinary.js <folder-path>
 *
 * Examples:
 *   node scripts/upload-to-cloudinary.js ./my-images
 *   node scripts/upload-to-cloudinary.js /path/to/product-photos
 *
 * Environment variables required (in .env.local):
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * The script will:
 *   1. Scan the folder for image files (jpg, jpeg, png, webp, avif, gif)
 *   2. Upload each image to Cloudinary under "house-of-varsha/" folder
 *   3. Auto-detect subfolder structure (e.g., hero/, products/)
 *   4. Print the Cloudinary public IDs for use in the website
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env.local file not found.')
    console.error('Please create .env.local with your Cloudinary credentials.')
    console.error('See .env.example for the template.')
    process.exit(1)
  }
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=')
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim()
        let value = trimmed.substring(eqIndex + 1).trim()
        // Remove surrounding quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        process.env[key] = value
      }
    }
  })
}

loadEnv()

// Now require cloudinary (after env is loaded)
let cloudinary
try {
  cloudinary = require('cloudinary').v2
} catch {
  console.error('Error: cloudinary package not found. Run: npm install')
  process.exit(1)
}

// Configure Cloudinary
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!cloudName || !apiKey || !apiSecret) {
  console.error('Error: Missing Cloudinary credentials in .env.local')
  console.error('Required variables:')
  console.error('  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME')
  console.error('  CLOUDINARY_API_KEY')
  console.error('  CLOUDINARY_API_SECRET')
  process.exit(1)
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
})

// Supported image extensions
const IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg', '.bmp', '.tiff', '.tif'
])

// Base folder in Cloudinary
const CLOUDINARY_BASE_FOLDER = 'house-of-varsha'

/**
 * Recursively find all image files in a directory
 */
function findImages(dir, basePath = dir) {
  const results = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findImages(fullPath, basePath))
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (IMAGE_EXTENSIONS.has(ext)) {
        const relativePath = path.relative(basePath, fullPath)
        results.push({ fullPath, relativePath, name: entry.name })
      }
    }
  }

  return results
}

/**
 * Generate a clean public ID from file path
 */
function generatePublicId(relativePath) {
  const parsed = path.parse(relativePath)
  const dirParts = parsed.dir ? parsed.dir.split(path.sep) : []
  const namePart = parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const folderParts = dirParts.map(p =>
    p.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  ).filter(Boolean)

  const parts = [CLOUDINARY_BASE_FOLDER, ...folderParts, namePart]
  return parts.join('/')
}

/**
 * Upload a single image to Cloudinary
 */
async function uploadImage(imagePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      quality: 'auto:best',
      fetch_format: 'auto',
    })
    return { success: true, publicId: result.public_id, url: result.secure_url, bytes: result.bytes }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Format file size for display
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Main upload function
 */
async function main() {
  const folderPath = process.argv[2]

  if (!folderPath) {
    console.log(`
╔══════════════════════════════════════════════════════╗
║      House of Varsha - Cloudinary Image Uploader     ║
╚══════════════════════════════════════════════════════╝

Usage:
  node scripts/upload-to-cloudinary.js <folder-path>

Examples:
  node scripts/upload-to-cloudinary.js ./my-images
  node scripts/upload-to-cloudinary.js /home/user/photos

Folder structure tips:
  my-images/
  ├── hero/           → Uploaded as house-of-varsha/hero/...
  │   ├── hero-1.jpg
  │   ├── hero-2.jpg
  │   └── hero-3.jpg
  ├── products/       → Uploaded as house-of-varsha/products/...
  │   ├── kurti-1.jpg
  │   ├── kurti-2.jpg
  │   └── set-1.jpg
  └── general/        → Uploaded as house-of-varsha/general/...
      └── about.jpg

Or just put all images in one folder - they'll be uploaded to house-of-varsha/
`)
    process.exit(0)
  }

  const resolvedPath = path.resolve(folderPath)

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: Folder not found: ${resolvedPath}`)
    process.exit(1)
  }

  if (!fs.statSync(resolvedPath).isDirectory()) {
    console.error(`Error: Not a directory: ${resolvedPath}`)
    process.exit(1)
  }

  console.log(`
╔══════════════════════════════════════════════════════╗
║      House of Varsha - Cloudinary Image Uploader     ║
╚══════════════════════════════════════════════════════╝
`)
  console.log(`Cloud Name:  ${cloudName}`)
  console.log(`Source:      ${resolvedPath}`)
  console.log(`Destination: Cloudinary → ${CLOUDINARY_BASE_FOLDER}/`)
  console.log('')

  // Find all images
  const images = findImages(resolvedPath)

  if (images.length === 0) {
    console.log('No image files found in the specified folder.')
    console.log('Supported formats: jpg, jpeg, png, webp, avif, gif, svg')
    process.exit(0)
  }

  console.log(`Found ${images.length} image(s) to upload:\n`)

  // Show what will be uploaded
  const uploadPlan = images.map(img => ({
    ...img,
    publicId: generatePublicId(img.relativePath),
  }))

  uploadPlan.forEach((img, i) => {
    console.log(`  ${i + 1}. ${img.relativePath} → ${img.publicId}`)
  })

  console.log(`\nUploading ${images.length} images...\n`)

  // Upload all images
  const results = { success: [], failed: [] }
  const heroImages = []
  const productImages = []

  for (let i = 0; i < uploadPlan.length; i++) {
    const img = uploadPlan[i]
    const progress = `[${i + 1}/${uploadPlan.length}]`

    process.stdout.write(`${progress} Uploading ${img.relativePath}... `)

    const result = await uploadImage(img.fullPath, img.publicId)

    if (result.success) {
      console.log(`✓ (${formatSize(result.bytes)})`)
      results.success.push({ ...img, ...result })

      // Track hero and product images
      if (img.publicId.includes('/hero/') || img.name.toLowerCase().includes('hero')) {
        heroImages.push(result.publicId)
      } else if (img.publicId.includes('/products/') || img.publicId.includes('/product/')) {
        productImages.push(result.publicId)
      }
    } else {
      console.log(`✗ Error: ${result.error}`)
      results.failed.push({ ...img, error: result.error })
    }
  }

  // Summary
  console.log(`\n${'═'.repeat(54)}`)
  console.log(`UPLOAD COMPLETE`)
  console.log(`${'═'.repeat(54)}`)
  console.log(`  Successful: ${results.success.length}`)
  console.log(`  Failed:     ${results.failed.length}`)

  if (results.success.length > 0) {
    console.log(`\n${'─'.repeat(54)}`)
    console.log(`CLOUDINARY PUBLIC IDs (use these in your website):`)
    console.log(`${'─'.repeat(54)}`)
    results.success.forEach(img => {
      console.log(`  ${img.publicId}`)
    })

    if (heroImages.length > 0) {
      console.log(`\n${'─'.repeat(54)}`)
      console.log(`HERO IMAGES (for HeroSection component):`)
      console.log(`${'─'.repeat(54)}`)
      console.log(`  Add these to your hero section configuration:`)
      console.log(`  heroImages = [`)
      heroImages.forEach(id => {
        console.log(`    '${id}',`)
      })
      console.log(`  ]`)
    }

    if (productImages.length > 0) {
      console.log(`\n${'─'.repeat(54)}`)
      console.log(`PRODUCT IMAGES (for product data):`)
      console.log(`${'─'.repeat(54)}`)
      productImages.forEach(id => {
        console.log(`  cloudinaryId: '${id}'`)
      })
    }
  }

  if (results.failed.length > 0) {
    console.log(`\n${'─'.repeat(54)}`)
    console.log(`FAILED UPLOADS:`)
    console.log(`${'─'.repeat(54)}`)
    results.failed.forEach(img => {
      console.log(`  ${img.relativePath}: ${img.error}`)
    })
  }

  console.log('')
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
