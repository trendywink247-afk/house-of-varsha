export interface Product {
  id: string
  name: string
  price: string
  description: string
  category: string
  featured?: boolean
  details?: string[]
}

export const products: Product[] = [
  {
    id: 'artisan-tote',
    name: 'Artisan Leather Tote',
    price: '₹4,500',
    description: 'A beautifully crafted leather tote bag, perfect for daily elegance. Hand-stitched with care using premium full-grain leather that develops a beautiful patina over time.',
    category: 'Bags',
    featured: true,
    details: [
      'Full-grain genuine leather',
      'Hand-stitched detailing',
      'Interior zip pocket',
      'Magnetic closure',
      'Dimensions: 14" x 12" x 5"'
    ]
  },
  {
    id: 'silk-scarf',
    name: 'Heritage Silk Scarf',
    price: '₹2,200',
    description: 'Luxurious pure silk scarf featuring traditional motifs reimagined for the modern aesthetic. Each piece is hand-printed by skilled artisans.',
    category: 'Accessories',
    featured: true,
    details: [
      '100% pure mulberry silk',
      'Hand-printed design',
      'Hand-rolled edges',
      'Size: 90cm x 90cm',
      'Comes in signature gift box'
    ]
  },
  {
    id: 'ceramic-vase',
    name: 'Minimalist Ceramic Vase',
    price: '₹1,800',
    description: 'A stunning handcrafted ceramic vase with a modern minimalist design. Each piece is unique, with subtle variations that speak to its handmade nature.',
    category: 'Home Decor',
    featured: true,
    details: [
      'Handcrafted stoneware ceramic',
      'Food-safe glaze',
      'Waterproof interior',
      'Height: 25cm',
      'Each piece is unique'
    ]
  },
  {
    id: 'brass-candle-holder',
    name: 'Brass Candle Holder Set',
    price: '₹3,200',
    description: 'Set of three elegant brass candle holders with varying heights. Perfect for creating ambient lighting and adding warmth to any space.',
    category: 'Home Decor',
    details: [
      'Solid brass construction',
      'Hand-polished finish',
      'Set of 3 pieces',
      'Heights: 15cm, 20cm, 25cm',
      'Fits standard taper candles'
    ]
  },
  {
    id: 'cotton-throw',
    name: 'Handwoven Cotton Throw',
    price: '₹2,800',
    description: 'Soft, breathable cotton throw handwoven by traditional weavers. Perfect for cozy evenings or as an elegant home accent.',
    category: 'Home Decor',
    details: [
      '100% organic cotton',
      'Handwoven on traditional loom',
      'Natural dyes',
      'Size: 150cm x 200cm',
      'Machine washable'
    ]
  },
  {
    id: 'leather-journal',
    name: 'Leather Bound Journal',
    price: '₹1,500',
    description: 'A timeless leather-bound journal with handmade cotton paper. Perfect for capturing thoughts, sketches, and precious memories.',
    category: 'Stationery',
    details: [
      'Full-grain leather cover',
      'Handmade cotton paper',
      '200 unlined pages',
      'Ribbon bookmark',
      'Size: A5'
    ]
  },
  {
    id: 'wooden-box',
    name: 'Carved Wooden Keepsake Box',
    price: '₹2,000',
    description: 'Exquisitely carved wooden box, perfect for storing jewelry and treasured keepsakes. Features intricate traditional patterns.',
    category: 'Accessories',
    details: [
      'Solid sheesham wood',
      'Hand-carved details',
      'Velvet-lined interior',
      'Size: 15cm x 10cm x 8cm',
      'Brass hinges and clasp'
    ]
  },
  {
    id: 'linen-pouch',
    name: 'Embroidered Linen Pouch',
    price: '₹900',
    description: 'Delicate hand-embroidered linen pouch, perfect for cosmetics or small essentials. Features traditional embroidery techniques.',
    category: 'Bags',
    details: [
      '100% linen exterior',
      'Cotton lining',
      'Hand-embroidered design',
      'Zip closure',
      'Size: 20cm x 15cm'
    ]
  }
]
