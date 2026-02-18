import { useEffect, useRef, useMemo } from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Generate WhatsApp message with cart items
  const whatsappUrl = useMemo(() => {
    if (items.length === 0) return '';

    const phoneNumber = '917989733041';
    
    let message = 'Hello! I would like to place an order from House of Varsha.\n\n';
    message += '*Order Details:*\n\n';
    
    items.forEach((item, index) => {
      const itemTotal = parseInt(item.product.price.replace(/[₹,]/g, '')) * item.quantity;
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Size: ${item.size}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ${item.product.price} each\n`;
      message += `   Subtotal: ₹${itemTotal.toLocaleString()}\n\n`;
    });
    
    message += `*Total Amount: ₹${totalPrice.toLocaleString()}*\n\n`;
    message += 'Please confirm availability. Thank you!';

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  }, [items, totalPrice]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === drawerRef.current) {
      closeCart();
    }
  };

  return (
    <div
      ref={drawerRef}
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-[60] transition-opacity duration-400 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/25 backdrop-blur-sm" />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-cream shadow-xl transition-transform duration-400 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-charcoal/10">
            <h2 className="font-display text-xl uppercase tracking-[0.1em] text-charcoal">
              Your Cart
            </h2>
            <button
              onClick={closeCart}
              className="p-2 text-charcoal/60 hover:text-charcoal transition-colors"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-10 h-10 text-charcoal/20 mb-3" strokeWidth={1} />
                <p className="font-display text-lg text-charcoal/60 mb-1">Your cart is empty</p>
                <p className="body-text text-text-secondary/70 mb-5">
                  Discover our curated collection.
                </p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="cta-link text-charcoal"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-3 pb-4 border-b border-charcoal/10"
                  >
                    {/* Image */}
                    <Link
                      to={`/products/${item.product.id}`}
                      onClick={closeCart}
                      className="w-20 h-24 flex-shrink-0 overflow-hidden bg-beige"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/products/${item.product.id}`}
                          onClick={closeCart}
                          className="font-display text-base text-charcoal hover:text-gold transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="p-1 text-charcoal/30 hover:text-charcoal transition-colors"
                          aria-label="Remove item"
                        >
                          <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </button>
                      </div>

                      <p className="micro-label text-text-secondary/70 mt-0.5">
                        Size: {item.size}
                      </p>

                      <p className="font-display text-base text-charcoal mt-1">
                        {item.product.price}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 mt-auto">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center border border-charcoal/15 hover:border-gold hover:text-gold transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" strokeWidth={1.5} />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center border border-charcoal/15 hover:border-gold hover:text-gold transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-charcoal/10 bg-beige/20">
              <div className="flex justify-between items-center mb-3">
                <span className="body-text text-text-secondary">Subtotal</span>
                <span className="font-display text-lg text-charcoal">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
              <p className="body-text text-text-secondary/70 text-xs mb-5">
                Shipping and taxes calculated at checkout.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-charcoal text-cream font-sans font-medium uppercase tracking-[0.12em] text-xs hover:bg-gold transition-colors duration-300 flex items-center justify-center"
              >
                Checkout on WhatsApp
              </a>
              <button
                onClick={closeCart}
                className="w-full mt-2 py-2.5 text-charcoal font-sans font-medium uppercase tracking-[0.12em] text-xs hover:text-gold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
