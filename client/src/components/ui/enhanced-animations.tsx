import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 500, className }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}

export function SlideIn({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 600, 
  className 
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    if (isVisible) return 'translate-x-0 translate-y-0';
    
    switch (direction) {
      case 'left': return '-translate-x-full';
      case 'right': return 'translate-x-full';
      case 'up': return 'translate-y-8';
      case 'down': return '-translate-y-8';
      default: return 'translate-y-8';
    }
  };

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible ? 'opacity-100' : 'opacity-0',
        getTransform(),
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScaleIn({ children, delay = 0, duration = 400, className }: ScaleInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

interface PulseGlowProps {
  children: React.ReactNode;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function PulseGlow({ 
  children, 
  color = '#00C48C', 
  intensity = 'medium',
  className 
}: PulseGlowProps) {
  const getIntensity = () => {
    switch (intensity) {
      case 'low': return '0 0 10px';
      case 'medium': return '0 0 20px';
      case 'high': return '0 0 30px';
      default: return '0 0 20px';
    }
  };

  return (
    <div
      className={cn('animate-pulse', className)}
      style={{
        filter: `drop-shadow(${getIntensity()} ${color}40)`,
      }}
    >
      {children}
    </div>
  );
}

interface FloatingProps {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  className?: string;
}

export function Floating({ 
  children, 
  amplitude = 10, 
  duration = 3000,
  className 
}: FloatingProps) {
  return (
    <div
      className={cn('animate-bounce', className)}
      style={{
        animationDuration: `${duration}ms`,
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
      }}
    >
      {children}
    </div>
  );
}

interface ShimmerProps {
  children: React.ReactNode;
  className?: string;
}

export function Shimmer({ children, className }: ShimmerProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        'before:animate-[shimmer_2s_infinite]',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function CountUp({ 
  end, 
  start = 0, 
  duration = 1000, 
  className, 
  prefix = '', 
  suffix = '' 
}: CountUpProps) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    const increment = (end - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, start, duration]);

  return (
    <span className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}