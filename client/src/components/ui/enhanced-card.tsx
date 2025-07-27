import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'intense' | 'minimal' | 'elevated';
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
}

const cardVariants = {
  default: 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20',
  intense: 'glassmorphic-intense',
  minimal: 'bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border-white/10',
  elevated: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border-white/30 shadow-2xl',
};

export const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = 'default', hover = false, glow = false, gradient = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-3xl border shadow-xl transition-all duration-300',
          hover && 'enhanced-hover cursor-pointer',
          glow && 'shadow-eco-green/20 hover:shadow-eco-green/30',
          gradient && 'bg-gradient-to-br from-white/70 to-white/40 dark:from-gray-800/70 dark:to-gray-800/40',
          cardVariants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

EnhancedCard.displayName = 'EnhancedCard';

interface EnhancedCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
}

export const EnhancedCardHeader = forwardRef<HTMLDivElement, EnhancedCardHeaderProps>(
  ({ className, gradient = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'p-6 pb-4',
          gradient && 'bg-gradient-to-r from-eco-green/10 to-emerald-500/10 rounded-t-3xl',
          className
        )}
        {...props}
      />
    );
  }
);

EnhancedCardHeader.displayName = 'EnhancedCardHeader';

export const EnhancedCardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 pt-0', className)}
        {...props}
      />
    );
  }
);

EnhancedCardContent.displayName = 'EnhancedCardContent';

interface EnhancedCardFooterProps extends HTMLAttributes<HTMLDivElement> {
  actions?: boolean;
}

export const EnhancedCardFooter = forwardRef<HTMLDivElement, EnhancedCardFooterProps>(
  ({ className, actions = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'p-6 pt-4',
          actions && 'flex items-center justify-between',
          className
        )}
        {...props}
      />
    );
  }
);

EnhancedCardFooter.displayName = 'EnhancedCardFooter';