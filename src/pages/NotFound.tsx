import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="micro-label text-gold mb-4 block">404</span>
        <h1 className="font-display text-4xl lg:text-5xl text-charcoal mb-4">
          Page Not Found
        </h1>
        <p className="body-text text-text-secondary mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Back to Home
          </Link>
          <Link to="/shop" className="btn-outline">
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
