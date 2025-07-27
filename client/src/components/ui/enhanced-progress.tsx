import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedProgressProps {
  value?: number;
  max?: number;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  striped?: boolean;
  label?: string;
  showValue?: boolean;
}

const progressVariants = {
  default: 'bg-eco-green',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

const progressSizes = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

export const EnhancedProgress = forwardRef<HTMLDivElement, EnhancedProgressProps>(
  ({ 
    value = 0, 
    max = 100, 
    className, 
    variant = 'default', 
    size = 'md',
    animated = false,
    striped = false,
    label,
    showValue = false,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className={cn('w-full', className)} ref={ref} {...props}>
        {(label || showValue) && (
          <div className="flex justify-between items-center mb-2">
            {label && <span className="text-sm font-medium text-text-primary">{label}</span>}
            {showValue && (
              <span className="text-sm text-text-secondary">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div className={cn(
          'w-full bg-dark-surface rounded-full overflow-hidden shadow-inner',
          progressSizes[size]
        )}>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              progressVariants[variant],
              animated && 'animate-pulse',
              striped && 'bg-gradient-to-r from-current via-transparent to-current bg-[length:20px_20px] animate-[slide_1s_linear_infinite]',
              'shadow-sm'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

EnhancedProgress.displayName = 'EnhancedProgress';

interface CircularProgressProps {
  value?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
  label?: string;
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  className,
  variant = 'default',
  showValue = true,
  label,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colors = {
    default: '#00C48C',
    success: '#22C55E',
    warning: '#EAB308',
    danger: '#EF4444',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-dark-surface opacity-30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors[variant]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out drop-shadow-sm"
          style={{
            filter: `drop-shadow(0 0 6px ${colors[variant]}40)`,
          }}
        />
      </svg>
      {(showValue || label) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <span className="text-2xl font-bold text-text-primary">
              {Math.round(percentage)}%
            </span>
          )}
          {label && (
            <span className="text-sm text-text-secondary mt-1">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}