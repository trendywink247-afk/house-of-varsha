import { Product, ColorVariant } from '@/lib/googleSheets'

// Re-export types for convenience
export type { Product, ColorVariant }

// ============================================
// Hero Images Configuration
// ============================================
// After uploading images to Cloudinary using the upload script,
// replace these with your actual Cloudinary public IDs.
//
// Run: node scripts/upload-to-cloudinary.js ./your-images-folder
// Then copy the hero image IDs here.
//
// Example:
//   'house-of-varsha/hero/hero-1'
//   'house-of-varsha/hero/hero-2'
//
export const heroImageIds: string[] = [
  // Add your Cloudinary hero image IDs here after uploading
  // 'house-of-varsha/hero/hero-1',
  // 'house-of-varsha/hero/hero-2',
  // 'house-of-varsha/hero/hero-3',
  // 'house-of-varsha/hero/hero-4',
  // 'house-of-varsha/hero/hero-5',
]

// ============================================
// Default Products
// ============================================
// These will be used if Google Sheets is not configured.
// After uploading images to Cloudinary, add cloudinaryId to each product.
//
// Run: node scripts/upload-to-cloudinary.js ./your-images-folder
// Then add the product image IDs below.

export const products: Product[] = [
  {
    id: 'k001',
    name: 'Kalamkari Kurti - Yellow Family',
    price: '₹995',
    description: 'Pure cotton fabric with traditional Kalamkari print',
    category: 'Kurti',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Yellow family',
    code: 'K001',
    featured: true,
    inStock: true,
    // cloudinaryId: 'house-of-varsha/products/kurti-k001',
    details: [
      'Pure cotton fabric',
      'Traditional Kalamkari print',
      'Comfortable fit',
      'Available in M, L, XL, XXL'
    ]
  },
  {
    id: 'k002',
    name: 'Kalamkari Kurti - Rust Orange',
    price: '₹995',
    description: 'Pure cotton fabric with traditional Kalamkari print',
    category: 'Kurti',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Rust orange',
    code: 'K002',
    featured: true,
    // cloudinaryId: 'house-of-varsha/products/kurti-k002',
    details: [
      'Pure cotton fabric',
      'Traditional Kalamkari print',
      'Comfortable fit',
      'Available in M, L, XL, XXL'
    ]
  },
  {
    id: 'v001',
    name: '3-Piece Kurti Set - Lemon Yellow',
    price: '₹699',
    description: 'Complete 3-piece cotton kurti set',
    category: 'Kurti Set',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Lemon yellow',
    code: 'V001',
    featured: true,
    // cloudinaryId: 'house-of-varsha/products/set-v001',
    details: [
      'Complete 3-piece set',
      'Pure cotton fabric',
      'Comfortable for all-day wear',
      'Available in M, L, XL, XXL'
    ]
  },
  {
    id: 'v002',
    name: '3-Piece Kurti Set - Lemon Yellow (Variant)',
    price: '₹699',
    description: 'Complete 3-piece cotton kurti set',
    category: 'Kurti Set',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Lemon yellow',
    code: 'V002',
    // cloudinaryId: 'house-of-varsha/products/set-v002',
    details: [
      'Complete 3-piece set',
      'Pure cotton fabric',
      'Comfortable for all-day wear',
      'Available in M, L, XL, XXL'
    ]
  },
  {
    id: 'v003',
    name: '3-Piece Kurti Set - Sea Blue & Gold',
    price: '₹699',
    description: 'Complete 3-piece cotton kurti set in elegant color combination',
    category: 'Kurti Set',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Sea blue and gold',
    code: 'V003',
    // cloudinaryId: 'house-of-varsha/products/set-v003',
    details: [
      'Complete 3-piece set',
      'Elegant color combination',
      'Pure cotton fabric',
      'Available in M, L, XL, XXL'
    ]
  },
  {
    id: 'v004',
    name: '3-Piece Kurti Set - Green',
    price: '₹699',
    description: 'Complete 3-piece cotton kurti set',
    category: 'Kurti Set',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Green',
    code: 'V004',
    // cloudinaryId: 'house-of-varsha/products/set-v004',
    details: [
      'Complete 3-piece set',
      'Pure cotton fabric',
      'Comfortable for all-day wear',
      'Available in M, L, XL, XXL'
    ]
  },
  {
    id: 'v005',
    name: '3-Piece Kurti Set - Grey',
    price: '₹699',
    description: 'Complete 3-piece cotton kurti set',
    category: 'Kurti Set',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Grey',
    code: 'V005',
    // cloudinaryId: 'house-of-varsha/products/set-v005',
    details: [
      'Complete 3-piece set',
      'Pure cotton fabric',
      'Comfortable for all-day wear',
      'Available in M, L, XL, XXL'
    ]
  }
]
