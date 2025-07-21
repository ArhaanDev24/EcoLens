import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'camera', icon: 'camera', label: 'Camera' },
    { id: 'wallet', icon: 'wallet', label: 'Wallet' },
    { id: 'stats', icon: 'chart-line', label: 'Stats' },
    { id: 'profile', icon: 'user', label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 glassmorphic border-t border-opacity-20 border-gray-600 z-50">
      <div className="flex justify-around py-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center space-y-1 p-2 transition-colors",
              activeTab === tab.id ? "text-eco-green" : "text-text-secondary"
            )}
          >
            <i className={`fas fa-${tab.icon} text-xl`} />
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
