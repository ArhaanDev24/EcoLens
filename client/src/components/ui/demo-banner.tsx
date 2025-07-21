import { useState } from 'react';
import { Button } from './button';

export function DemoBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-eco-green/20 to-reward-yellow/20 border border-eco-green/30 p-3 m-4 rounded-xl flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-eco-green rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#1A1A1A" strokeWidth="2"/>
            <path d="m9 12 2 2 4-4" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">Demo Mode Active</p>
          <p className="text-xs text-text-secondary">Using AI simulation for testing</p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsDismissed(true)}
        className="text-text-secondary hover:text-text-primary"
      >
        ✕
      </Button>
    </div>
  );
}