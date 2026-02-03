'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ColorVariant } from '@/lib/googleSheets'

interface ProductGalleryProps {
  productName: string
  image?: string
  images?: string[]
  colorVariants?: ColorVariant[]
  color?: string
}

export default function ProductGallery({
  productName,
  image,
  images,
  colorVariants,
  color
}: ProductGalleryProps) {
  // Get all available colors
  const hasColorVariants = colorVariants && colorVariants.length > 0

  // Initialize with first color variant or default
  const [selectedColor, setSelectedColor] = useState<string>(
    hasColorVariants ? colorVariants[0].color : (color || '')
  )

  // Get images for selected color
  const getImagesForColor = (): string[] => {
    if (hasColorVariants) {
      const variant = colorVariants.find(v => v.color === selectedColor)
      return variant?.images || []
    }
    // Fallback to single image/images
    const allImages: string[] = []
    if (image) allImages.push(image)
    if (images && images.length > 0) allImages.push(...images)
    return allImages
  }

  const currentImages = getImagesForColor()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const currentImage = currentImages[selectedImageIndex] || currentImages[0]

  // Reset image index when color changes
  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor)
    setSelectedImageIndex(0)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gradient-to-br from-sage/20 to-dustyrose/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={`${productName} - ${selectedColor}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <span className="text-9xl font-serif text-taupe/30">
            {productName.charAt(0)}
          </span>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {currentImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {currentImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImageIndex === index
                  ? 'border-taupe'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Color Selector */}
      {hasColorVariants && (
        <div className="pt-2">
          <h3 className="font-medium text-gray-900 mb-3">Select Color</h3>
          <div className="flex flex-wrap gap-2">
            {colorVariants.map((variant) => (
              <button
                key={variant.color}
                onClick={() => handleColorChange(variant.color)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedColor === variant.color
                    ? 'border-taupe bg-taupe/10 text-taupe font-medium'
                    : 'border-gray-300 text-gray-700 hover:border-taupe hover:text-taupe'
                }`}
              >
                {variant.color}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Selected: <span className="font-medium text-gray-700">{selectedColor}</span>
          </p>
        </div>
      )}
    </div>
  )
}
