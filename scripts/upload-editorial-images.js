/**
 * Upload editorial images to Cloudinary
 * Run: node scripts/upload-editorial-images.js
 */

const cloudinary = require('cloudinary').v2
const fs = require('fs')
const path = require('path')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dv6de0ucq',
  api_key: process.env.CLOUDINARY_API_KEY || '572663884622231',
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

// Editorial images to upload
const editorialImages = [
  {
    localPath: 'public/logo.jpg',
    publicId: 'editorial/logo',
    displayName: 'Logo'
  },
  {
    localPath: 'public/images/about-hero.jpg',
    publicId: 'editorial/about-hero',
    displayName: 'About Hero'
  },
  {
    localPath: 'public/images/collection-flatlay.jpg',
    publicId: 'editorial/collection-flatlay',
    displayName: 'Collection Flatlay'
  },
  {
    localPath: 'public/images/hero-model.jpg',
    publicId: 'editorial/hero-model',
    displayName: 'Hero Model'
  },
  {
    localPath: 'public/images/story-craftsmanship.jpg',
    publicId: 'editorial/story-craftsmanship',
    displayName: 'Story Craftsmanship'
  },
  {
    localPath: 'public/images/story-motion.jpg',
    publicId: 'editorial/story-motion',
    displayName: 'Story Motion'
  },
  {
    localPath: 'public/images/story-philosophy.jpg',
    publicId: 'editorial/story-philosophy',
    displayName: 'Story Philosophy'
  }
]

async function uploadImage(imageConfig) {
  try {
    const fullPath = path.join(process.cwd(), imageConfig.localPath)
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ File not found: ${imageConfig.localPath}`)
      return null
    }

    console.log(`Uploading ${imageConfig.displayName}...`)
    
    const result = await cloudinary.uploader.upload(fullPath, {
      public_id: imageConfig.publicId,
      folder: '',
      overwrite: true,
      resource_type: 'image'
    })

    console.log(`✅ Uploaded: ${imageConfig.displayName}`)
    console.log(`   URL: ${result.secure_url}`)
    console.log(`   Public ID: ${result.public_id}`)
    
    return result
  } catch (error) {
    console.error(`❌ Error uploading ${imageConfig.displayName}:`, error.message)
    return null
  }
}

async function uploadAllImages() {
  console.log('🚀 Starting editorial images upload to Cloudinary...\n')
  
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ CLOUDINARY_API_SECRET not found in environment variables')
    console.log('Please set your Cloudinary API secret in .env.local file')
    process.exit(1)
  }

  const results = []
  
  for (const image of editorialImages) {
    const result = await uploadImage(image)
    if (result) results.push(result)
    console.log('') // Empty line for readability
  }

  console.log(`\n✨ Upload complete! ${results.length}/${editorialImages.length} images uploaded`)
  console.log('\nCloudinary URLs:')
  results.forEach(result => {
    console.log(`  ${result.public_id}: ${result.secure_url}`)
  })
}

uploadAllImages()
