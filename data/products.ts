import { Product, ColorVariant } from '@/lib/googleSheets'

// Re-export types for convenience
export type { Product, ColorVariant }

// Default products - these will be used if Google Sheets is not configured
// You can update these directly OR use Google Sheets for easy updates
//
// To use Cloudinary images, add:
//   cloudinaryId: 'products/your-image-id'
//
// Example with Cloudinary:
//   {
//     id: 'k001',
//     name: 'Kalamkari Kurti',
//     cloudinaryId: 'house-of-varsha/products/kurti-k001',
//     ...
//   }

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
    details: [
      'Complete 3-piece set',
      'Pure cotton fabric',
      'Comfortable for all-day wear',
      'Available in M, L, XL, XXL'
    ]
  }
]
