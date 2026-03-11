import { useEffect, useRef, useState, useCallback } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Link } from 'react-router-dom';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, totalPrice, clearCart } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

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

  const buildWhatsAppUrl = useCallback((paymentId: string) => {
    const phoneNumber = '917989733041';
    let message = '✅ New Order Confirmed via Razorpay!\n\n';
    message += '*Order Details:*\n\n';
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Size: ${item.size}\n`;
      message += `   Price: ${item.product.price}\n\n`;
    });
    message += `*Total: ₹${totalPrice.toLocaleString()}*\n`;
    message += `Payment ID: ${paymentId}`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  }, [items, totalPrice]);

  const handleCheckout = useCallback(async () => {
    if (items.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setPaymentStatus('idle');

    try {
      // 1. Create Razorpay order on server
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/checkout/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, totalAmount: totalPrice }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setPaymentStatus('error');
        setStatusMessage(orderData.error || 'Could not initiate payment. Please try again.');
        setIsProcessing(false);
        return;
      }

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setPaymentStatus('error');
        setStatusMessage('Could not load payment gateway. Check your connection and try again.');
        setIsProcessing(false);
        return;
      }

      // 3. Open Razorpay modal
      const options: RazorpayOptions = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'House of Varsha',
        description: 'Indian Ethnic Wear',
        order_id: orderData.orderId,
        handler: async (response: RazorpayPaymentResponse) => {
          // 4. Verify payment on server
          const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/checkout/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              items,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // 5. Success: clear cart, notify store owner via WhatsApp
            clearCart();
            setPaymentStatus('success');
            setStatusMessage('Payment successful! Thank you for your order.');
            // Open WhatsApp with order summary for store owner
            const waUrl = buildWhatsAppUrl(response.razorpay_payment_id);
            window.open(waUrl, '_blank');
          } else {
            setPaymentStatus('error');
            setStatusMessage('Payment verification failed. Please contact us on WhatsApp.');
          }
          setIsProcessing(false);
        },
        theme: { color: '#2C2C2C' },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setPaymentStatus('error');
      setStatusMessage('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  }, [items, totalPrice, isProcessing, clearCart, buildWhatsAppUrl]);

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
                {paymentStatus === 'success' ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="font-display text-lg text-charcoal mb-1">Order Placed!</p>
                    <p className="body-text text-text-secondary/70 mb-5 text-sm">
                      Your payment was successful. A WhatsApp message has been sent to confirm your order.
                    </p>
                    <Link to="/shop" onClick={closeCart} className="cta-link text-charcoal">
                      Continue Shopping
                    </Link>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-10 h-10 text-charcoal/20 mb-3" strokeWidth={1} />
                    <p className="font-display text-lg text-charcoal/60 mb-1">Your cart is empty</p>
                    <p className="body-text text-text-secondary/70 mb-5">
                      Discover our curated collection.
                    </p>
                    <Link to="/shop" onClick={closeCart} className="cta-link text-charcoal">
                      Explore Collection
                    </Link>
                  </>
                )}
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-charcoal/10 bg-beige/20">
              {paymentStatus === 'error' && (
                <p className="body-text text-red-600 text-xs mb-3 text-center">{statusMessage}</p>
              )}
              <div className="flex justify-between items-center mb-3">
                <span className="body-text text-text-secondary">Subtotal</span>
                <span className="font-display text-lg text-charcoal">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
              <p className="body-text text-text-secondary/70 text-xs mb-5">
                Shipping and taxes calculated at checkout.
              </p>
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3 bg-charcoal text-cream font-sans font-medium uppercase tracking-[0.12em] text-xs hover:bg-gold transition-colors duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Pay'}
              </button>
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
