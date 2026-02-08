/**
 * Upload new product images from C:\Users\khana\Downloads\fiNAL IMAGES SORTED
 * Folders 1-7 correspond to products p001-p007
 * Run: node scripts/upload-product-images.cjs
 */

require('dotenv').config({ path: '.env.local' })

const cloudinary = require('cloudinary').v2
const fs = require('fs')
const path = require('path')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dv6de0ucq',
  api_key: process.env.CLOUDINARY_API_KEY || '572663884622231',
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

// Base path for new images
const BASE_IMAGE_PATH = 'C:\\Users\\khana\\Downloads\\fiNAL IMAGES SORTED'

// Product mapping: folder number -> product ID and details
const productMapping = [
  { folder: '1', productId: 'p001', name: 'Kalamkari Kurti - Yellow Family' },
  { folder: '2', productId: 'p002', name: 'Kalamkari Kurti - Rust Orange' },
  { folder: '3', productId: 'p003', name: '3pc Kurti Set - Lemon Yellow' },
  { folder: '4', productId: 'p004', name: '3pc Kurti Set - Lemon Yellow' },
  { folder: '5', productId: 'p005', name: '3pc Kurti Set - Sea Blue & Gold' },
  { folder: '6', productId: 'p006', name: '3pc Kurti Set - Green' },
  { folder: '7', productId: 'p007', name: '3pc Kurti Set - Grey' }
]

// Get sorted image files from a folder
function getImageFiles(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.error(`❌ Folder not found: ${folderPath}`)
    return []
  }

  const files = fs.readdirSync(folderPath)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort((a, b) => {
      // Sort numerically (1.jpg, 2.jpg, etc.)
      const numA = parseInt(a.match(/^\d+/)?.[0] || '999')
      const numB = parseInt(b.match(/^\d+/)?.[0] || '999')
      return numA - numB
    })

  return files.map(file => path.join(folderPath, file))
}

// Upload a single image
async function uploadImage(filePath, publicId) {
  try {
    console.log(`  Uploading: ${path.basename(filePath)} -> ${publicId}`)
    
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      folder: '',
      overwrite: true,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    })

    console.log(`  ✅ Uploaded: ${result.secure_url}`)
    return {
      publicId: result.public_id,
      url: result.secure_url,
      success: true
    }
  } catch (error) {
    console.error(`  ❌ Error uploading ${path.basename(filePath)}:`, error.message)
    return { success: false, error: error.message }
  }
}

// Delete old product images from Cloudinary
async function deleteOldProductImages(productId) {
  const patterns = [
    `house-of-varsha/products/${productId}-main`,
    `house-of-varsha/products/${productId}-hover`,
    `house-of-varsha/products/${productId}-gallery-1`,
    `house-of-varsha/products/${productId}-gallery-2`,
    `house-of-varsha/products/${productId}-gallery-3`,
    `house-of-varsha/products/${productId}-gallery-4`
  ]

  for (const publicId of patterns) {
    try {
      await cloudinary.uploader.destroy(publicId)
      console.log(`  🗑️  Deleted old image: ${publicId}`)
    } catch (error) {
      // Ignore errors - image might not exist
    }
  }
}

// Process a single product
async function processProduct(mapping) {
  console.log(`\n📦 Processing ${mapping.name} (${mapping.productId})`)
  console.log('-'.repeat(60))

  const folderPath = path.join(BASE_IMAGE_PATH, mapping.folder)
  const imageFiles = getImageFiles(folderPath)

  if (imageFiles.length === 0) {
    console.log(`  ⚠️  No images found in folder ${mapping.folder}`)
    return null
  }

  console.log(`  Found ${imageFiles.length} image(s)`)

  // Delete old images first
  await deleteOldProductImages(mapping.productId)

  const uploadedImages = []

  // Upload main image (first image)
  if (imageFiles[0]) {
    const mainResult = await uploadImage(
      imageFiles[0],
      `house-of-varsha/products/${mapping.productId}-main`
    )
    if (mainResult.success) {
      uploadedImages.push({ type: 'main', ...mainResult })
    }
  }

  // Upload hover image (second image, if exists)
  if (imageFiles[1]) {
    const hoverResult = await uploadImage(
      imageFiles[1],
      `house-of-varsha/products/${mapping.productId}-hover`
    )
    if (hoverResult.success) {
      uploadedImages.push({ type: 'hover', ...hoverResult })
    }
  }

  // Upload gallery images (remaining images)
  for (let i = 2; i < imageFiles.length; i++) {
    const galleryNum = i - 1
    const galleryResult = await uploadImage(
      imageFiles[i],
      `house-of-varsha/products/${mapping.productId}-gallery-${galleryNum}`
    )
    if (galleryResult.success) {
      uploadedImages.push({ type: `gallery-${galleryNum}`, ...galleryResult })
    }
  }

  return {
    productId: mapping.productId,
    name: mapping.name,
    images: uploadedImages
  }
}

// Generate updated product data
function generateProductData(results) {
  console.log('\n\n📋 UPDATED PRODUCT DATA FOR src/data/products.ts:')
  console.log('='.repeat(80))

  for (const result of results) {
    if (!result) continue

    const mainImage = result.images.find(img => img.type === 'main')
    const hoverImage = result.images.find(img => img.type === 'hover')
    const galleryImages = result.images.filter(img => img.type.startsWith('gallery'))

    console.log(`\n// ${result.name}`)
 console.log(`image: '${mainImage?.url || ''}',`)
    console.log(`hoverImage: '${hoverImage?.url || mainImage?.url || ''}',`)
    console.log(`images: [`)
    result.images.forEach(img => {
      console.log(`  '${img.url}',`)
    })
    console.log(`],`)
  }
}

// Main function
async function uploadAllProductImages() {
  console.log('🚀 Starting product images upload to Cloudinary...')
  console.log(`📁 Source: ${BASE_IMAGE_PATH}`)
  console.log(`☁️  Cloud: ${cloudinary.config().cloud_name}`)
  console.log('')

  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ CLOUDINARY_API_SECRET not found in .env.local')
    console.log('Please add your Cloudinary API secret to .env.local:')
    console.log('CLOUDINARY_API_SECRET=your_api_secret_here')
    process.exit(1)
  }

  const results = []

  for (const mapping of productMapping) {
    const result = await processProduct(mapping)
    if (result) results.push(result)
  }

  // Summary
  console.log('\n\n' + '='.repeat(80))
  console.log('✨ UPLOAD COMPLETE!')
  console.log('='.repeat(80))
  console.log(`\nTotal products processed: ${results.length}`)
  console.log(`Total images uploaded: ${results.reduce((sum, r) => sum + r.images.length, 0)}`)

  // Generate updated product data
  generateProductData(results)

  // Save results to JSON file
  const outputPath = path.join(process.cwd(), 'scripts', 'upload-results.json')
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
  console.log(`\n💾 Results saved to: ${outputPath}`)

  console.log('\n⚠️  IMPORTANT: Update src/data/products.ts with the new URLs above!')
}

uploadAllProductImages().catch(error => {
  console.error('💥 Fatal error:', error)
  process.exit(1)
})
