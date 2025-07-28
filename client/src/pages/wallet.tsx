import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GlassmorphicCard } from '@/components/ui/glassmorphic-card';
import { CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { RewardFeatures } from '@/components/ui/reward-features';

interface WalletPageProps {
  greenCoins: number;
  onCoinsSpent: (coins: number) => void;
}

interface Transaction {
  id: number;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  createdAt: string;
}

export function WalletPage({ greenCoins, onCoinsSpent }: WalletPageProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });

  const generateQRCode = async (rewardTier: 'small' | 'medium' | 'large') => {
    const tiers = {
      small: { coins: 100, value: 50 },   // ₹50 for 100 coins
      medium: { coins: 250, value: 150 }, // ₹150 for 250 coins  
      large: { coins: 500, value: 350 }   // ₹350 for 500 coins (bonus value!)
    };

    const tier = tiers[rewardTier];
    
    if (greenCoins < tier.coins) {
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
      onCoinsSpent(tier.coins);
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

  const equivalentValue = (greenCoins * 0.5).toFixed(2); // 1 coin = ₹0.5 (increased value!)

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg pb-24">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-eco-green/20 via-reward-yellow/10 to-eco-green/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-bg/50"></div>
        
        {/* Header Content */}
        <div className="relative p-6 pt-16">
          <div className="flex items-center justify-between mb-8 slide-in-down">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-eco-green to-reward-yellow rounded-2xl flex items-center justify-center shadow-xl floating-animation">
                <span className="text-3xl">🪙</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Green Wallet</h1>
                <p className="text-sm text-text-secondary">Redeem your eco rewards</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-secondary uppercase tracking-wider">Balance</p>
              <p className="text-4xl font-bold text-reward-yellow count-up">{greenCoins}</p>
              <p className="text-sm text-eco-green font-medium">≈ ₹{(greenCoins * 0.5).toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-2 -mt-4">
        <Tabs defaultValue="wallet" className="w-full max-w-full">
          <TabsList className="items-center justify-center text-muted-foreground w-full grid grid-cols-3 glassmorphic border border-eco-green/20 bg-dark-surface-variant/60 rounded-xl p-0.5 h-11 mx-0 mt-[11px] mb-[11px] pl-[5px] pr-[5px] pt-[0px] pb-[0px] ml-[0px] mr-[0px] text-center text-[18px]">
            <TabsTrigger 
              value="wallet" 
              className="text-sm font-medium text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-eco-green/20 rounded-lg transition-all duration-200 px-1 py-2 h-10"
            >
              Wallet
            </TabsTrigger>
            <TabsTrigger 
              value="rewards" 
              className="text-sm font-medium text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-eco-green/20 rounded-lg transition-all duration-200 px-1 py-2 h-10"
            >
              Rewards
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="text-sm font-medium text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-eco-green/20 rounded-lg transition-all duration-200 px-1 py-2 h-10"
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
                  {greenCoins.toLocaleString()}
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
                      <img src={qrCode} alt="QR Code" className="w-full h-full" />
                    </div>
                    <div className="space-y-3">
                      <Button
                        onClick={resetQR}
                        variant="outline"
                        className="border-2 border-eco-green text-eco-green hover:bg-eco-green/10 rounded-xl px-6 py-3"
                      >
                        Generate New QR
                      </Button>
                      <p className="text-sm text-text-secondary">
                        Present this QR code at participating stores
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {/* Small Reward Tier */}
                      <Button
                        onClick={() => generateQRCode('small')}
                        disabled={isGeneratingQR || greenCoins < 100}
                        className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {isGeneratingQR ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" />
                            Generating QR...
                          </div>
                        ) : (
                          '₹50 QR Code (100 coins)'
                        )}
                      </Button>
                      
                      {/* Medium Reward Tier */}
                      <Button
                        onClick={() => generateQRCode('medium')}
                        disabled={isGeneratingQR || greenCoins < 250}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        ₹150 QR Code (250 coins)
                      </Button>
                      
                      {/* Large Reward Tier - Best Value! */}
                      <Button
                        onClick={() => generateQRCode('large')}
                        disabled={isGeneratingQR || greenCoins < 500}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl relative shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        ₹350 QR Code (500 coins)
                        <span className="absolute -top-3 -right-3 bg-gradient-to-r from-reward-yellow to-yellow-400 text-dark-bg text-xs px-3 py-1 rounded-full font-black shadow-lg">
                          BEST VALUE!
                        </span>
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-eco-green/10 to-reward-yellow/10 rounded-2xl border border-eco-green/20">
                      <p className="text-sm text-text-secondary text-center">
                        Present QR codes at participating stores, cafes, and online shops
                      </p>
                      {greenCoins < 100 && (
                        <p className="text-sm text-red-400 mt-2 text-center font-medium">
                          You need {100 - greenCoins} more coins for the smallest reward
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </GlassmorphicCard>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <RewardFeatures greenCoins={greenCoins} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <h3 className="font-medium mb-4 text-text-primary">Recent Activity</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <GlassmorphicCard key={i}>
                <CardContent className="p-4">
                  <div className="animate-pulse flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-600 rounded mb-2" />
                      <div className="h-3 bg-gray-600 rounded w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </GlassmorphicCard>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <GlassmorphicCard>
            <CardContent className="p-6 text-center">
              <i className="fas fa-receipt text-4xl text-text-secondary mb-4" />
              <h4 className="font-medium mb-2">No Transactions Yet</h4>
              <p className="text-sm text-text-secondary">
                Start recycling to earn your first green coins!
              </p>
            </CardContent>
          </GlassmorphicCard>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 10).map((transaction) => (
              <GlassmorphicCard key={transaction.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'earn' ? 'bg-eco-green' : 'bg-reward-yellow'
                    }`}>
                      <i className={`fas ${
                        transaction.type === 'earn' ? 'fa-plus' : 'fa-minus'
                      } text-dark-bg text-sm`} />
                    </div>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-text-secondary">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className={`font-medium ${
                    transaction.type === 'earn' ? 'text-eco-green' : 'text-reward-yellow'
                  }`}>
                    {transaction.type === 'earn' ? '+' : '-'}{transaction.amount} coins
                  </div>
                </CardContent>
              </GlassmorphicCard>
            ))}
          </div>
        )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
