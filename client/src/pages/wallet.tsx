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

// Enhanced Reward Button Component
interface EnhancedRewardButtonProps {
  tier: string;
  coins: number;
  value: string;
  originalValue: string;
  savings: string;
  icon: string;
  gradient: string;
  glowColor: string;
  onClick: () => void;
  disabled: boolean;
  userCoins: number;
  popular?: boolean;
  premium?: boolean;
}

function EnhancedRewardButton({ 
  tier, 
  coins, 
  value, 
  originalValue, 
  savings, 
  icon, 
  gradient, 
  glowColor, 
  onClick, 
  disabled, 
  userCoins,
  popular,
  premium 
}: EnhancedRewardButtonProps) {
  const canAfford = userCoins >= coins;
  const shortage = coins - userCoins;

  return (
    <div className="relative">
      {/* Popular/Premium Badge */}
      {popular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            🔥 MOST POPULAR
          </div>
        </div>
      )}
      {premium && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ⭐ BEST VALUE
          </div>
        </div>
      )}

      <Button
        onClick={onClick}
        disabled={disabled}
        className={`w-full p-0 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] overflow-hidden ${
          disabled 
            ? 'bg-gray-800/50 border-gray-600 cursor-not-allowed' 
            : `bg-gradient-to-r border-2 hover:shadow-lg`
        } ${popular || premium ? 'mt-4' : ''}`}
        style={{
          background: disabled 
            ? 'rgba(75, 85, 99, 0.8)' 
            : `linear-gradient(135deg, ${
                glowColor === 'blue' ? 'rgba(59, 130, 246, 0.3)' : 
                glowColor === 'purple' ? 'rgba(168, 85, 247, 0.3)' : 
                'rgba(245, 158, 11, 0.3)'
              }, ${
                glowColor === 'blue' ? 'rgba(37, 99, 235, 0.25)' : 
                glowColor === 'purple' ? 'rgba(147, 51, 234, 0.25)' : 
                'rgba(217, 119, 6, 0.25)'
              })`,
          borderColor: disabled 
            ? 'rgba(156, 163, 175, 0.5)' 
            : glowColor === 'blue' ? 'rgba(59, 130, 246, 0.6)' : 
              glowColor === 'purple' ? 'rgba(168, 85, 247, 0.6)' : 
              'rgba(245, 158, 11, 0.6)'
        }}
      >
        <div className="w-full p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                disabled 
                  ? 'bg-gray-600 text-gray-400' 
                  : `text-white`
              }`}
              style={{
                background: disabled 
                  ? undefined 
                  : `linear-gradient(135deg, ${
                      glowColor === 'blue' ? '#3B82F6, #2563EB' : 
                      glowColor === 'purple' ? '#A855F7, #9333EA' : 
                      '#F59E0B, #D97706'
                    })`
              }}>
                {icon}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-white capitalize text-lg mb-1" style={{ color: '#ffffff' }}>{tier} Reward</h4>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium" style={{ color: '#e5e7eb' }}>{coins} coins</span>
                  <span className="text-xs" style={{ color: '#d1d5db' }}>→</span>
                  <span className="font-bold" style={{ color: '#10b981' }}>{value}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs line-through" style={{ color: '#d1d5db' }}>{originalValue}</span>
                  <span className={`text-xs font-bold`} style={{ 
                    color: glowColor === 'blue' ? '#93c5fd' : 
                           glowColor === 'purple' ? '#c4b5fd' : 
                           '#fde68a'
                  }}>{savings}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              {!canAfford ? (
                <div className="text-center">
                  <p className="text-xs font-medium mb-1" style={{ color: '#fca5a5' }}>Need {shortage} more</p>
                  <div className="text-xs" style={{ color: '#e5e7eb' }}>coins</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1`} style={{ 
                    color: glowColor === 'blue' ? '#dbeafe' : 
                           glowColor === 'purple' ? '#ede9fe' : 
                           '#fef3c7'
                  }}>{value}</div>
                  <div className="text-xs font-medium px-2 py-1 rounded-full" style={{ 
                    color: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)'
                  }}>
                    ✨ Redeem
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar for coins needed */}
          {!canAfford && (
            <div className="mt-4">
              <div className="w-full bg-dark-surface-variant rounded-full h-2">
                <div 
                  className="h-2 rounded-full"
                  style={{ 
                    width: `${Math.min((userCoins / coins) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${
                      glowColor === 'blue' ? '#3B82F6, #2563EB' : 
                      glowColor === 'purple' ? '#A855F7, #9333EA' : 
                      '#F59E0B, #D97706'
                    })`
                  }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-center font-medium" style={{ color: '#e5e7eb' }}>
                {userCoins} / {coins} coins ({Math.round((userCoins / coins) * 100)}%)
              </p>
            </div>
          )}
        </div>
      </Button>
    </div>
  );
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
          <GlassmorphicCard className="rounded-3xl border-2 border-eco-green/20 shadow-2xl bg-gradient-to-br from-eco-green/5 via-transparent to-reward-yellow/5">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-eco-green via-eco-green to-reward-yellow rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🎁</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary mb-1">Generate QR Reward</h3>
                  <p className="text-text-secondary">Redeem your coins at partner stores</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {qrCode ? (
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="w-64 h-64 mx-auto bg-white rounded-3xl flex items-center justify-center p-8 shadow-2xl border-4 border-eco-green/20">
                        <div 
                          className="w-full h-full" 
                          dangerouslySetInnerHTML={{ __html: qrCode }}
                        />
                      </div>
                      {/* Animated border glow */}
                      <div className="absolute inset-0 w-64 h-64 mx-auto rounded-3xl border-2 border-eco-green animate-pulse"></div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-eco-green/10 to-reward-yellow/10 p-4 rounded-2xl border border-eco-green/20">
                      <p className="text-text-primary font-medium mb-1">✨ Ready to Redeem!</p>
                      <p className="text-text-secondary text-sm">Show this QR code at any partner store to claim your reward</p>
                    </div>
                    
                    <div className="flex gap-3 justify-center">
                      <Button 
                        onClick={resetQR}
                        variant="outline"
                        className="border-2 border-eco-green text-eco-green hover:bg-eco-green/10 hover:scale-105 transition-all duration-300 px-6 py-2 rounded-xl font-medium"
                      >
                        🔄 Generate New QR
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h4 className="text-lg font-semibold text-text-primary mb-2">Choose Your Reward Tier</h4>
                      <p className="text-text-secondary text-sm">Select the reward value you want to redeem</p>
                    </div>
                    
                    <div className="space-y-4">
                      <EnhancedRewardButton 
                        tier="small" 
                        coins={100} 
                        value="₹50" 
                        originalValue="₹40"
                        savings="₹10 bonus!"
                        icon="🥉"
                        gradient="from-blue-500 to-blue-600"
                        glowColor="blue"
                        onClick={() => generateQRCode('small')} 
                        disabled={user.greenCoins < 100}
                        userCoins={user.greenCoins}
                      />
                      <EnhancedRewardButton 
                        tier="medium" 
                        coins={250} 
                        value="₹150" 
                        originalValue="₹125"
                        savings="₹25 bonus!"
                        icon="🥈"
                        gradient="from-purple-500 to-purple-600"
                        glowColor="purple"
                        onClick={() => generateQRCode('medium')} 
                        disabled={user.greenCoins < 250}
                        userCoins={user.greenCoins}
                        popular={true}
                      />
                      <EnhancedRewardButton 
                        tier="large" 
                        coins={500} 
                        value="₹350" 
                        originalValue="₹250"
                        savings="₹100 bonus!"
                        icon="🥇"
                        gradient="from-amber-500 to-amber-600"
                        glowColor="amber"
                        onClick={() => generateQRCode('large')} 
                        disabled={user.greenCoins < 500}
                        userCoins={user.greenCoins}
                        premium={true}
                      />
                    </div>
                    
                    {isGeneratingQR && (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 border-4 border-eco-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-text-secondary">Generating your QR reward...</p>
                      </div>
                    )}
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