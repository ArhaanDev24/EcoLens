import { useState, useEffect } from 'react';

interface EnhancedLoadingProps {
  message?: string;
  subMessage?: string;
}

export function EnhancedLoading({ message = "EcoLens", subMessage = "Initializing AI Scanner..." }: EnhancedLoadingProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-dark-bg flex items-center justify-center z-50">
      <div className="text-center fade-in-scale">
        {/* Premium Loading Animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto bg-eco-green/20 rounded-full flex items-center justify-center floating-animation">
            <div className="w-12 h-12 border-4 border-eco-green border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto border border-eco-green/30 rounded-full animate-ping" />
          <div className="absolute inset-0 w-24 h-24 mx-auto border border-eco-green/20 rounded-full animate-ping animation-delay-1000" />
        </div>
        
        {/* Enhanced Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-text-primary">{message}</h2>
          <p className="text-text-secondary">{subMessage}{dots}</p>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-eco-green rounded-full animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SkeletonLoaderProps {
  className?: string;
}

export function SkeletonLoader({ className = "" }: SkeletonLoaderProps) {
  return (
    <div className={`skeleton rounded-xl ${className}`} />
  );
}

interface LoadingCardProps {
  title?: string;
  subtitle?: string;
}

export function LoadingCard({ title = "Loading...", subtitle }: LoadingCardProps) {
  return (
    <div className="glassmorphic-card p-6 rounded-3xl border border-white/20 shadow-2xl">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <SkeletonLoader className="w-12 h-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <SkeletonLoader className="h-4 w-3/4" />
            {subtitle && <SkeletonLoader className="h-3 w-1/2" />}
          </div>
        </div>
        <SkeletonLoader className="h-20 w-full" />
        <div className="flex space-x-2">
          <SkeletonLoader className="h-8 w-24 rounded-lg" />
          <SkeletonLoader className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}