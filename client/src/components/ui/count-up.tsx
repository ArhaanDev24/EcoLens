import React, { useState, useEffect, useRef } from 'react';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  onComplete?: () => void;
  className?: string;
}

export function CountUp({ 
  end, 
  start = 0, 
  duration = 2000, 
  decimals = 0, 
  suffix = '', 
  prefix = '',
  onComplete,
  className = ''
}: CountUpProps) {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number>();

  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  const updateCount = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
    const easedProgress = easeOutQuart(progress);
    
    const currentCount = start + (end - start) * easedProgress;
    countRef.current = currentCount;
    setCount(currentCount);

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(updateCount);
    } else {
      onComplete?.();
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateCount);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [end, start, duration]);

  const formatNumber = (num: number) => {
    return num.toFixed(decimals);
  };

  return (
    <span className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}

export default CountUp;