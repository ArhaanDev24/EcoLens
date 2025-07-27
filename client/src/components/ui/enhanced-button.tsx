import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  fullWidth?: boolean;
  gradient?: boolean;
}

const buttonVariants = {
  primary: 'bg-eco-green hover:bg-eco-green/90 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-dark-surface hover:bg-dark-surface/80 text-text-primary border border-white/10',
  outline: 'border-2 border-eco-green text-eco-green hover:bg-eco-green hover:text-white',
  ghost: 'text-text-primary hover:bg-white/10',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    icon: Icon, 
    fullWidth = false,
    gradient = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(
          'relative inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 enhanced-hover',
          'focus:outline-none focus:ring-2 focus:ring-eco-green/50 focus:ring-offset-2 focus:ring-offset-dark-bg',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none',
          gradient && 'bg-gradient-to-r from-eco-green to-emerald-500',
          fullWidth && 'w-full',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {!loading && Icon && (
          <Icon className="w-4 h-4 mr-2" />
        )}
        {children}
      </button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';