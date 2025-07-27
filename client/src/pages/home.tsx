import { useState } from 'react';
import { EnhancedCamera } from '@/components/ui/enhanced-camera';
import { EnhancedResults } from '@/components/ui/enhanced-results';
import { WalletPage } from './wallet';
import EnhancedStatsPage from './enhanced-stats';
import Profile from './profile';
import AnalyticsPage from './analytics';
import { EnhancedBottomNav } from '@/components/ui/enhanced-bottom-nav';
import { EnhancedLoading } from '@/components/ui/enhanced-loading';
import { NotificationProvider } from '@/components/ui/enhanced-notifications';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  username: string;
  email: string;
  greenCoins: number;
  totalEarned: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
    retry: false,
  });

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setActiveTab('results');
  };

  const handleBackToCamera = () => {
    setCapturedImage(null);
    setActiveTab('camera');
  };

  const handleCoinsEarned = async (coins: number) => {
    // Update local state immediately for better UX
    queryClient.setQueryData(['/api/user'], (oldData: User | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        greenCoins: oldData.greenCoins + coins,
        totalEarned: oldData.totalEarned + coins
      };
    });

    // Invalidate to refetch fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
  };

  const handleCoinsSpent = async (coins: number) => {
    // Update local state immediately for better UX
    queryClient.setQueryData(['/api/user'], (oldData: User | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        greenCoins: oldData.greenCoins - coins
      };
    });

    // Invalidate to refetch fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
  };

  if (isLoading) {
    return <EnhancedLoading />;
  }

  const greenCoins = user?.greenCoins || 0;

  const renderActiveTab = () => {
    if (activeTab === 'results' && capturedImage) {
      return (
        <EnhancedResults
          imageData={capturedImage}
          onBack={handleBackToCamera}
          onCoinsEarned={handleCoinsEarned}
        />
      );
    }

    switch (activeTab) {
      case 'camera':
        return (
          <EnhancedCamera
            onCapture={handleCapture}
            greenCoins={greenCoins}
          />
        );
      case 'wallet':
        return (
          <WalletPage
            greenCoins={greenCoins}
            onCoinsSpent={handleCoinsSpent}
          />
        );
      case 'stats':
        return <EnhancedStatsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-dark-bg">
        {renderActiveTab()}
        
        {activeTab !== 'results' && (
          <EnhancedBottomNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </div>
    </NotificationProvider>
  );
}
