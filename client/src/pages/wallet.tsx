import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GlassmorphicCard } from '@/components/ui/glassmorphic-card';
import { CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RewardFeatures } from '@/components/ui/reward-features';

interface Transaction {
  id: number;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  createdAt: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  greenCoins: number;
  totalEarned: number;
}

export default function WalletPage() {
  const queryClient = useQueryClient();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });

  const generateQRCode = async (rewardTier: 'small' | 'medium' | 'large') => {
    if (!user) return;
    
    const tiers = {
      small: { coins: 100, value: 50 },   // ₹50 for 100 coins
      medium: { coins: 250, value: 150 }, // ₹150 for 250 coins  
      large: { coins: 500, value: 350 }   // ₹350 for 500 coins (bonus value!)
    };

    const tier = tiers[rewardTier];
    
    if (user.greenCoins < tier.coins) {
      alert(`Insufficient coins! You need ${tier.coins} coins to generate a ₹${tier.value} QR code.`);
      return;
    }

    setIsGeneratingQR(true);
    
    try {
      const response = await apiRequest('POST', '/api/transactions/qr', {
        amount: tier.coins,
        value: tier.value
      });
      
      const data = await response.json();
      setQrCode(data.qrCode);
      
      // Invalidate user query to refresh balance
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      alert('Failed to generate QR code. Please try again.');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const resetQR = () => {
    setQrCode(null);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-eco-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading wallet...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary">Failed to load user data</p>
        </div>
      </div>
    );
  }

  const greenCoins = user.greenCoins;
  const equivalentValue = (greenCoins * 0.5).toFixed(2); // 1 coin = ₹0.5 (increased value!)

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg pb-24">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-eco-green/20 via-reward-yellow/10 to-eco-green/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 left-6 w-16 h-16 bg-eco-green/10 rounded-full animate-pulse"></div>
        <div className="absolute top-12 right-8 w-8 h-8 bg-reward-yellow/10 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-8 left-1/3 w-12 h-12 bg-eco-green/5 rounded-full animate-pulse delay-700"></div>
        
        <div className="relative z-10 p-6 pt-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-eco-green to-reward-yellow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <span className="text-3xl">💰</span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">My Wallet</h1>
            <p className="text-text-secondary">Manage your Green Coins and rewards</p>
          </div>
        </div>
      </div>

      <div className="px-2 -mt-4">
        <Tabs defaultValue="wallet" className="w-full max-w-full">
          <TabsList className="flex items-center justify-center w-full glassmorphic border border-eco-green/20 bg-dark-surface-variant/60 rounded-xl p-1 h-12 mx-0 mt-[11px] mb-[11px] gap-1">
            <TabsTrigger 
              value="wallet" 
              className="text-sm font-medium text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-eco-green/20 rounded-lg transition-all duration-200 flex items-center justify-center flex-1 h-10"
            >
              Wallet
            </TabsTrigger>
            <TabsTrigger 
              value="rewards" 
              className="text-sm font-medium text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-eco-green/20 rounded-lg transition-all duration-200 flex items-center justify-center flex-1 h-10"
            >
              Rewards
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="text-sm font-medium text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-eco-green/20 rounded-lg transition-all duration-200 flex items-center justify-center flex-1 h-10"
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6 px-2">
          {/* Enhanced Balance Card */}
          <GlassmorphicCard className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-eco-green/10 via-transparent to-reward-yellow/10 border-2 border-eco-green/20 shadow-2xl">
            <div className="text-center space-y-6">
              <div>
                <p className="text-sm text-text-secondary uppercase tracking-wider mb-2">Available Balance</p>
                <div className="text-5xl font-bold text-reward-yellow mb-3 count-up">
                  {greenCoins?.toLocaleString() || '0'}
                </div>
                <p className="text-text-secondary">Green Coins</p>
              </div>
              
              {/* Equivalent Value with Better Design */}
              <div className="bg-gradient-to-r from-dark-surface-variant/50 to-dark-surface/50 p-4 rounded-2xl border border-eco-green/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">Equivalent Value</p>
                    <p className="text-2xl font-bold text-eco-green">₹{equivalentValue}</p>
                  </div>
                  <div className="w-12 h-12 bg-eco-green/20 rounded-full flex items-center justify-center">
                    <span className="text-eco-green text-xl">💰</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
          
          {/* Enhanced QR Code Generation */}
          <GlassmorphicCard className="rounded-3xl border-2 border-dark-border shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-eco-green to-reward-yellow rounded-xl flex items-center justify-center">
                  <span className="text-dark-bg text-xl">📱</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">Generate QR Reward</h3>
                  <p className="text-sm text-text-secondary">Redeem your coins at stores</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {qrCode ? (
                  <div className="text-center space-y-4">
                    <div className="w-56 h-56 mx-auto bg-white rounded-3xl flex items-center justify-center p-6 shadow-2xl">
                      <div 
                        className="w-full h-full" 
                        dangerouslySetInnerHTML={{ __html: qrCode }}
                      />
                    </div>
                    <p className="text-text-secondary text-sm">Show this QR code at any partner store to redeem your reward</p>
                    <Button 
                      onClick={resetQR}
                      variant="outline"
                      className="border-eco-green text-eco-green hover:bg-eco-green/10"
                    >
                      Generate New QR
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-text-secondary text-sm mb-4">Choose a reward tier to generate your QR code:</p>
                    <div className="space-y-3">
                      <RewardButton tier="small" coins={100} value="₹50" onClick={() => generateQRCode('small')} disabled={user.greenCoins < 100} />
                      <RewardButton tier="medium" coins={250} value="₹150" onClick={() => generateQRCode('medium')} disabled={user.greenCoins < 250} />
                      <RewardButton tier="large" coins={500} value="₹350" onClick={() => generateQRCode('large')} disabled={user.greenCoins < 500} />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </GlassmorphicCard>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6 px-2">
          <RewardFeatures greenCoins={user.greenCoins} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6 px-2">
          <GlassmorphicCard className="rounded-3xl border-2 border-dark-border shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-eco-green to-reward-yellow rounded-xl flex items-center justify-center">
                  <span className="text-dark-bg text-xl">📋</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">Transaction History</h3>
                  <p className="text-sm text-text-secondary">Your recent activity</p>
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-eco-green border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-text-secondary text-sm">Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-dark-surface-variant rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-text-secondary">📝</span>
                  </div>
                  <p className="text-text-secondary">No transactions yet</p>
                  <p className="text-text-secondary text-sm mt-1">Start recycling to see your activity here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-dark-surface-variant/50 rounded-2xl border border-dark-border"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'earn' 
                            ? 'bg-eco-green/20 text-eco-green' 
                            : 'bg-reward-yellow/20 text-reward-yellow'
                        }`}>
                          <span className="text-sm">{transaction.type === 'earn' ? '📈' : '📱'}</span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{transaction.description}</p>
                          <p className="text-xs text-text-secondary">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.type === 'earn' ? 'text-eco-green' : 'text-reward-yellow'
                        }`}>
                          {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                        </p>
                        <p className="text-xs text-text-secondary">coins</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </GlassmorphicCard>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  );
}

// Reward Button Component
interface RewardButtonProps {
  tier: string;
  coins: number;
  value: string;
  onClick: () => void;
  disabled: boolean;
}

function RewardButton({ tier, coins, value, onClick, disabled }: RewardButtonProps) {
  const tierStyles = {
    small: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    medium: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    large: 'from-amber-500/20 to-amber-600/20 border-amber-500/30'
  };

  const tierIcons = {
    small: '🥉',
    medium: '🥈', 
    large: '🥇'
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
        disabled 
          ? 'bg-dark-surface-variant/30 border-dark-border text-text-secondary cursor-not-allowed' 
          : `bg-gradient-to-r ${tierStyles[tier as keyof typeof tierStyles]} hover:shadow-lg`
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{tierIcons[tier as keyof typeof tierIcons]}</span>
          <div className="text-left">
            <p className="font-bold text-text-primary capitalize">{tier} Reward</p>
            <p className="text-sm text-text-secondary">{coins} coins → {value}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-eco-green">{value}</p>
          <p className="text-xs text-text-secondary">Redeem</p>
        </div>
      </div>
    </Button>
  );
}