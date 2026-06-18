import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
    </div>
  );
}
