import { Component } from 'react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <span className="micro-label text-gold mb-4 block">Error</span>
            <h1 className="font-display text-4xl lg:text-5xl text-charcoal mb-4">
              Something Went Wrong
            </h1>
            <p className="body-text text-text-secondary mb-8 leading-relaxed">
              We're sorry, an unexpected error occurred.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/" className="btn-primary">
                Back to Home
              </Link>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn-outline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
