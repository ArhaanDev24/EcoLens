import { useState } from 'react';
import { EnhancedCamera } from '@/components/ui/enhanced-camera';
import { EnhancedResults } from '@/components/ui/enhanced-results';
import { WalletPage } from './wallet';
import EnhancedStatsPage from './enhanced-stats';
import { EnhancedBottomNav } from '@/components/ui/enhanced-bottom-nav';
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
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center fade-in-scale">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto bg-eco-green/20 rounded-full flex items-center justify-center floating-animation">
              <div className="w-8 h-8 border-3 border-eco-green border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="absolute inset-0 w-16 h-16 mx-auto border border-eco-green/30 rounded-full animate-ping" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">EcoLens</h2>
          <p className="text-text-secondary">Initializing AI Scanner...</p>
        </div>
      </div>
    );
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
      case 'achievements':
        return <EnhancedStatsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {renderActiveTab()}
      
      {activeTab !== 'results' && (
        <EnhancedBottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
}
