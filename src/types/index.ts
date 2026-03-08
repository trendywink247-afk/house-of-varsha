export interface ColorVariant {
  color: string;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  sizes: string[];
  color: string;
  code: string;
  featured: boolean;
  inStock: boolean;
  image: string;
  hoverImage: string;
  images: string[];
  cloudinaryIds: string[];
  details: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface StockState {
  [key: string]: boolean; // e.g. "p001-M": true means that size is sold out
}
