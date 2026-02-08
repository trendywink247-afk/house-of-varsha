/**
 * Upload new website images to Cloudinary
 * Run: node scripts/upload-new-images.js
 */

require('dotenv').config({ path: '.env.local' })

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

// New images to upload
const newImages = [
  { localPath: 'public/images/craft-detail.jpg', publicId: 'website/craft-detail', displayName: 'Craft Detail' },
  { localPath: 'public/images/editorial-1.jpg', publicId: 'website/editorial-1', displayName: 'Editorial 1' },
  { localPath: 'public/images/editorial-2.jpg', publicId: 'website/editorial-2', displayName: 'Editorial 2' },
  { localPath: 'public/images/editorial-3.jpg', publicId: 'website/editorial-3', displayName: 'Editorial 3' },
  { localPath: 'public/images/editorial-4.jpg', publicId: 'website/editorial-4', displayName: 'Editorial 4' },
  { localPath: 'public/images/editorial-5.jpg', publicId: 'website/editorial-5', displayName: 'Editorial 5' },
  { localPath: 'public/images/editorial-6.jpg', publicId: 'website/editorial-6', displayName: 'Editorial 6' },
  { localPath: 'public/images/lifestyle-wide-1.jpg', publicId: 'website/lifestyle-wide-1', displayName: 'Lifestyle Wide 1' },
  { localPath: 'public/images/lifestyle-wide-2.jpg', publicId: 'website/lifestyle-wide-2', displayName: 'Lifestyle Wide 2' },
]

async function uploadImage(imageConfig) {
  try {
    const fullPath = path.join(process.cwd(), imageConfig.localPath)
    
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
    return result
  } catch (error) {
    console.error(`❌ Error uploading ${imageConfig.displayName}:`, error.message)
    return null
  }
}

async function uploadAllImages() {
  console.log('🚀 Starting new images upload to Cloudinary...\n')
  
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ CLOUDINARY_API_SECRET not found')
    process.exit(1)
  }

  const results = []
  
  for (const image of newImages) {
    const result = await uploadImage(image)
    if (result) results.push(result)
    console.log('')
  }

  console.log(`\n✨ Upload complete! ${results.length}/${newImages.length} images uploaded`)
  console.log('\nCloudinary URLs:')
  results.forEach(result => {
    console.log(`  ${result.public_id}: ${result.secure_url}`)
  })
}

uploadAllImages()
