import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-body flex items-center justify-center px-4">
      <div className="card max-w-md w-full p-8 text-center">
        <p className="text-sm font-semibold text-secondary uppercase tracking-widest mb-2">404</p>
        <h1 className="text-3xl font-bold text-primary mb-3">Page not found</h1>
        <p className="text-secondary mb-6">The page you’re looking for doesn’t exist or may have moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary px-4 py-2.5 rounded-sm text-sm font-semibold inline-flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/dashboard" className="px-4 py-2.5 rounded-sm text-sm font-semibold border border-input-border text-primary hover:bg-input transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
