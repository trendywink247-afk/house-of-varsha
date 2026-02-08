import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((product: Product, size: string) => {
    setItems(prev => {
      const existingItem = prev.find(
        item => item.product.id === product.id && item.size === size
      );
      
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, { product, quantity: 1, size }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setItems(prev =>
      prev.filter(
        item => !(item.product.id === productId && item.size === size)
      )
    );
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce((sum, item) => {
    const price = parseInt(item.product.price.replace(/[₹,]/g, ''));
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
