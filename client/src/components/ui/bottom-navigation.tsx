import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { 
      id: 'camera', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="8" width="20" height="12" rx="3" fill="currentColor"/>
          <circle cx="12" cy="14" r="4" fill="none" stroke="#00C48C" strokeWidth="2"/>
          <circle cx="12" cy="14" r="2" fill="#00C48C"/>
          <rect x="16" y="6" width="2" height="2" rx="1" fill="currentColor"/>
        </svg>
      ), 
      label: 'Camera' 
    },
    { 
      id: 'wallet', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" fill="currentColor"/>
          <circle cx="12" cy="12" r="6" fill="none" stroke="#FFD500" strokeWidth="1"/>
          <text x="12" y="16" textAnchor="middle" fill="#FFD500" fontFamily="Arial" fontSize="6" fontWeight="bold">$</text>
        </svg>
      ), 
      label: 'Wallet' 
    },
    { 
      id: 'stats', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 17V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V17H3ZM5 19V17H7V19H5ZM9 19V17H11V19H9ZM13 19V17H15V19H13ZM17 19V17H19V19H17Z" fill="currentColor"/>
          <path d="M3 3V15H21V3H3ZM19 13H5V5H19V13Z" fill="currentColor"/>
        </svg>
      ), 
      label: 'Stats' 
    },
    { 
      id: 'profile', 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" fill="currentColor"/>
          <path d="M12 14C8.13 14 5 17.13 5 21H19C19 17.13 15.87 14 12 14Z" fill="currentColor"/>
        </svg>
      ), 
      label: 'Profile' 
    }
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
            {tab.icon}
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
