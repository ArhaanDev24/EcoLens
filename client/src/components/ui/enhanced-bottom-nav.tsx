import { cn } from '@/lib/utils';
import { Camera, Wallet, BarChart3, Trophy } from 'lucide-react';

interface EnhancedBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  {
    id: 'camera',
    label: 'Scan',
    icon: Camera,
    gradient: 'from-eco-green to-emerald-400',
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: Wallet,
    gradient: 'from-reward-yellow to-amber-400',
  },
  {
    id: 'stats',
    label: 'Stats',
    icon: BarChart3,
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'achievements',
    label: 'Awards',
    icon: Trophy,
    gradient: 'from-purple-500 to-pink-400',
  },
];

export function EnhancedBottomNav({ activeTab, onTabChange }: EnhancedBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 slide-in-up">
      <div className="glassmorphic-intense border-t border-white/20 backdrop-blur-xl">
        <div className="flex justify-around items-center py-3 px-4">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const IconComponent = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-300 transform",
                  "min-w-[64px] active:scale-95",
                  isActive
                    ? "bg-gradient-to-br " + item.gradient + " text-white shadow-lg scale-105"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/10"
                )}
              >
                <div className={cn(
                  "relative",
                  isActive && "drop-shadow-lg"
                )}>
                  <IconComponent className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isActive && "animate-pulse"
                  )} />
                  
                  {isActive && (
                    <div className="absolute inset-0 w-6 h-6 bg-white/30 rounded-full animate-ping" />
                  )}
                </div>
                
                <span className={cn(
                  "text-xs font-medium transition-all duration-300",
                  isActive ? "text-white" : "text-text-secondary"
                )}>
                  {item.label}
                </span>
                
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full bounce-in" />
                )}
              </button>
            );
          })}
        </div>
        
        {/* iOS Home Indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-32 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}