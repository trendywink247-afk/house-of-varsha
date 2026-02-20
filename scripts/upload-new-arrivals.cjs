/**
 * Upload new arrival product images from C:\Users\khana\Downloads\New pictures
 * Folders P1-P5 correspond to products p008-p012
 * Run: node scripts/upload-new-arrivals.cjs
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
const BASE_IMAGE_PATH = 'C:\\Users\\khana\\Downloads\\New pictures'

// Product mapping: folder -> product ID and details
const productMapping = [
  { folder: 'P1', productId: 'p008', name: 'Coordset Set - Yellow', price: '₹649', category: 'Coordset', color: 'Yellow', fabric: 'Rayon fabric' },
  { folder: 'P2', productId: 'p009', name: 'Coordset Set - Pink', price: '₹649', category: 'Coordset', color: 'Pink', fabric: 'Rayon fabric' },
  { folder: 'P3', productId: 'p010', name: 'Kalamkari Kurtis - Green', price: '₹995', category: 'Kurti', color: 'Green', fabric: 'Pure cotton fabric - Kalamkari model' },
  { folder: 'P4', productId: 'p011', name: 'Kalamkari Kurtis - Yellow', price: '₹995', category: 'Kurti', color: 'Yellow', fabric: 'Pure cotton fabric - Kalamkari model' },
  { folder: 'P5', productId: 'p012', name: 'Embroidered Cotton Kurtis with Dupatta - Green', price: '₹995', category: 'Kurti', color: 'Green', fabric: 'Pure cotton fabric' }
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

  const uploadedImages = []

  // Upload main image (first image - 1.jpg)
  if (imageFiles[0]) {
    const mainResult = await uploadImage(
      imageFiles[0],
      `house-of-varsha/products/${mapping.productId}-main`
    )
    if (mainResult.success) {
      uploadedImages.push({ type: 'main', ...mainResult })
    }
  }

  // Upload hover image (second image - 2.jpg)
  if (imageFiles[1]) {
    const hoverResult = await uploadImage(
      imageFiles[1],
      `house-of-varsha/products/${mapping.productId}-hover`
    )
    if (hoverResult.success) {
      uploadedImages.push({ type: 'hover', ...hoverResult })
    }
  }

  // Upload gallery images (remaining images - 3.jpg, 4.jpg, 5.jpg)
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
    ...mapping,
    images: uploadedImages
  }
}

// Generate updated product data for products.ts
function generateProductData(results) {
  console.log('\n\n📋 UPDATED PRODUCT DATA FOR src/data/products.ts:')
  console.log('='.repeat(80))

  for (const result of results) {
    if (!result) continue

    const mainImage = result.images.find(img => img.type === 'main')
    const hoverImage = result.images.find(img => img.type === 'hover')
    const galleryImages = result.images.filter(img => img.type.startsWith('gallery'))

    const allImages = result.images.map(img => img.url)
    const cloudinaryIds = result.images.map(img => img.publicId)

    console.log(`
  {
    id: '${result.productId}',
    name: '${result.name}',
    price: '${result.price}',
    description: '${result.category === 'Coordset' 
      ? `Beautiful ${result.name.split(' - ')[0]} in stunning ${result.color.toLowerCase()} shade. Made with premium ${result.fabric.toLowerCase()} for comfort and style.`
      : result.name.includes('Kalamkari') 
        ? `Beautiful handcrafted Kalamkari Kurti in ${result.color.toLowerCase()} shade. Traditional Indian block prints on ${result.fabric.toLowerCase()}.`
        : `Elegant embroidered cotton kurti with matching dupatta in ${result.color.toLowerCase()} shade. Made with ${result.fabric.toLowerCase()} for ultimate comfort.`}',
    category: '${result.category}',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: '${result.color}',
    code: '${result.productId.toUpperCase()}',
    featured: ${result.productId === 'p010' || result.productId === 'p011' ? 'true' : 'false'},
    inStock: true,
    image: '${mainImage?.url || ''}',
    hoverImage: '${hoverImage?.url || mainImage?.url || ''}',
    images: [
      ${allImages.map(url => `'${url}'`).join(',\n      ')}
    ],
    cloudinaryIds: [
      ${cloudinaryIds.map(id => `'${id}'`).join(',\n      ')}
    ],
    details: [
      '${result.fabric}',
      '${result.color} color',
      'Available in sizes M, L, XL, XXL',
      'Handcrafted with love',
      '${result.category === 'Coordset' ? 'Trendy coordset set' : result.category === 'Kurti' ? 'Perfect for festive occasions' : 'Complete set with dupatta'}'
    ]
  },`)
  }
}

// Main function
async function uploadAllProductImages() {
  console.log('🚀 Starting new arrival product images upload to Cloudinary...')
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
  const outputPath = path.join(process.cwd(), 'scripts', 'new-arrivals-upload-results.json')
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
  console.log(`\n💾 Results saved to: ${outputPath}`)

  console.log('\n⚠️  IMPORTANT: Update src/data/products.ts with the new product data above!')
}

uploadAllProductImages().catch(error => {
  console.error('💥 Fatal error:', error)
  process.exit(1)
})