import { Product, ColorVariant } from '@/lib/googleSheets'

// Re-export types for convenience
export type { Product, ColorVariant }

// Updated Products with Correct Pricing, Sizes, and Codes
// All products have sizes: M, L, XL, XXL

export const products: Product[] = [
  {
    id: 'p001',
    name: 'Kalamkari Kurti - Yellow Family',
    price: '₹995',
    description: 'Beautiful handcrafted Kalamkari Kurti featuring traditional Indian block prints on pure cotton fabric. Perfect for festive occasions and daily wear.',
    category: 'Kurti',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Yellow Family',
    code: 'K001',
    featured: true,
    inStock: true,
    image: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485957/house-of-varsha/products/p001-main.jpg',
    hoverImage: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485958/house-of-varsha/products/p001-hover.jpg',
    images: [
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485957/house-of-varsha/products/p001-main.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485958/house-of-varsha/products/p001-hover.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485960/house-of-varsha/products/p001-gallery-1.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485961/house-of-varsha/products/p001-gallery-2.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485963/house-of-varsha/products/p001-gallery-3.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485964/house-of-varsha/products/p001-gallery-4.jpg'
    ],
    cloudinaryIds: [
      'house-of-varsha/products/p001-main',
      'house-of-varsha/products/p001-hover',
      'house-of-varsha/products/p001-gallery-1',
      'house-of-varsha/products/p001-gallery-2',
      'house-of-varsha/products/p001-gallery-3',
      'house-of-varsha/products/p001-gallery-4'
    ],
    details: [
      'Pure cotton fabric',
      'Traditional Kalamkari print',
      'Yellow Family color',
      'Available in sizes M, L, XL, XXL',
      'Handcrafted with love'
    ]
  },
  {
    id: 'p002',
    name: 'Kalamkari Kurti - Rust Orange',
    price: '₹995',
    description: 'Beautiful handcrafted Kalamkari Kurti in stunning rust orange shade. Traditional Indian block prints on pure cotton fabric.',
    category: 'Kurti',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Rust Orange',
    code: 'K002',
    featured: true,
    inStock: true,
    image: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485827/house-of-varsha/products/p002-main.jpg',
    hoverImage: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485829/house-of-varsha/products/p002-hover.jpg',
    images: [
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485827/house-of-varsha/products/p002-main.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485829/house-of-varsha/products/p002-hover.jpg'
    ],
    cloudinaryIds: [
      'house-of-varsha/products/p002-main',
      'house-of-varsha/products/p002-hover'
    ],
    details: [
      'Pure cotton fabric',
      'Traditional Kalamkari print',
      'Rust Orange color',
      'Available in sizes M, L, XL, XXL',
      'Perfect for festive occasions'
    ]
  },
  {
    id: 'p003',
    name: '3pc Kurti Set - Lemon Yellow',
    price: '₹699',
    description: 'Elegant 3-piece Kurti set in refreshing lemon yellow shade. Comfortable cotton fabric perfect for daily wear and special occasions.',
    category: 'Kurti Set',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Lemon Yellow',
    code: 'V001',
    featured: false,
    inStock: true,
    image: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485830/house-of-varsha/products/p003-main.jpg',
    hoverImage: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485832/house-of-varsha/products/p003-hover.jpg',
    images: [
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485830/house-of-varsha/products/p003-main.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485832/house-of-varsha/products/p003-hover.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485833/house-of-varsha/products/p003-gallery-1.jpg'
    ],
    cloudinaryIds: [
      'house-of-varsha/products/p003-main',
      'house-of-varsha/products/p003-hover',
      'house-of-varsha/products/p003-gallery-1'
    ],
    details: [
      'Complete 3-piece set',
      'Cotton fabric',
      'Lemon Yellow color',
      'Available in sizes M, L, XL, XXL',
      'Comfortable for daily wear'
    ]
  },
  {
    id: 'p004',
    name: '3pc Kurti Set - Lemon Yellow',
    price: '₹699',
    description: 'Stylish 3-piece Kurti set in beautiful lemon yellow. Made with soft cotton fabric for all-day comfort and elegance.',
    category: 'Kurti Set',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Lemon Yellow',
    code: 'V002',
    featured: true,
    inStock: true,
    image: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485835/house-of-varsha/products/p004-main.jpg',
    hoverImage: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485836/house-of-varsha/products/p004-hover.jpg',
    images: [
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485835/house-of-varsha/products/p004-main.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485836/house-of-varsha/products/p004-hover.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485837/house-of-varsha/products/p004-gallery-1.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485839/house-of-varsha/products/p004-gallery-2.jpg'
    ],
    cloudinaryIds: [
      'house-of-varsha/products/p004-main',
      'house-of-varsha/products/p004-hover',
      'house-of-varsha/products/p004-gallery-1',
      'house-of-varsha/products/p004-gallery-2'
    ],
    details: [
      'Complete 3-piece set',
      'Cotton fabric',
      'Lemon Yellow color',
      'Available in sizes M, L, XL, XXL',
      'Elegant and comfortable'
    ]
  },
  {
    id: 'p005',
    name: '3pc Kurti Set - Sea Blue & Gold',
    price: '₹699',
    description: 'Gorgeous 3-piece Kurti set featuring sea blue and gold color combination. Premium cotton fabric with elegant design.',
    category: 'Kurti Set',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Sea Blue and Gold',
    code: 'V003',
    featured: false,
    inStock: true,
    image: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485840/house-of-varsha/products/p005-main.jpg',
    hoverImage: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485841/house-of-varsha/products/p005-hover.jpg',
    images: [
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485840/house-of-varsha/products/p005-main.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485841/house-of-varsha/products/p005-hover.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485843/house-of-varsha/products/p005-gallery-1.jpg'
    ],
    cloudinaryIds: [
      'house-of-varsha/products/p005-main',
      'house-of-varsha/products/p005-hover',
      'house-of-varsha/products/p005-gallery-1'
    ],
    details: [
      'Complete 3-piece set',
      'Cotton fabric',
      'Sea Blue and Gold combination',
      'Available in sizes M, L, XL, XXL',
      'Perfect for special occasions'
    ]
  },
  {
    id: 'p006',
    name: '3pc Kurti Set - Green',
    price: '₹699',
    description: 'Beautiful 3-piece Kurti set in vibrant green color. Crafted from soft cotton fabric for ultimate comfort and style.',
    category: 'Kurti Set',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Green',
    code: 'V004',
    featured: false,
    inStock: true,
    image: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485845/house-of-varsha/products/p006-main.jpg',
    hoverImage: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485846/house-of-varsha/products/p006-hover.jpg',
    images: [
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485845/house-of-varsha/products/p006-main.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485846/house-of-varsha/products/p006-hover.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485848/house-of-varsha/products/p006-gallery-1.jpg'
    ],
    cloudinaryIds: [
      'house-of-varsha/products/p006-main',
      'house-of-varsha/products/p006-hover',
      'house-of-varsha/products/p006-gallery-1'
    ],
    details: [
      'Complete 3-piece set',
      'Cotton fabric',
      'Vibrant Green color',
      'Available in sizes M, L, XL, XXL',
      'Traditional ethnic design'
    ]
  },
  {
    id: 'p007',
    name: '3pc Kurti Set - Grey',
    price: '₹699',
    description: 'Elegant 3-piece Kurti set in sophisticated grey color. Premium cotton fabric with modern ethnic design.',
    category: 'Kurti Set',
    sizes: ['M', 'L', 'XL', 'XXL'],
    color: 'Grey',
    code: 'V005',
    featured: true,
    inStock: true,
    image: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485849/house-of-varsha/products/p007-main.jpg',
    hoverImage: 'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485850/house-of-varsha/products/p007-hover.jpg',
    images: [
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485849/house-of-varsha/products/p007-main.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485850/house-of-varsha/products/p007-hover.jpg',
      'https://res.cloudinary.com/dv6de0ucq/image/upload/v1770485852/house-of-varsha/products/p007-gallery-1.jpg'
    ],
    cloudinaryIds: [
      'house-of-varsha/products/p007-main',
      'house-of-varsha/products/p007-hover',
      'house-of-varsha/products/p007-gallery-1'
    ],
    details: [
      'Complete 3-piece set',
      'Cotton fabric',
      'Sophisticated Grey color',
      'Available in sizes M, L, XL, XXL',
      'Modern ethnic elegance'
    ]
  }
];

export default products;
