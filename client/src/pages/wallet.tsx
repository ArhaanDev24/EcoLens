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
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="p-4 glassmorphic">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-reward-yellow rounded-full flex items-center justify-center p-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" fill="#1A1A1A" stroke="#FFA000" strokeWidth="1"/>
              <circle cx="12" cy="12" r="6" fill="none" stroke="#FFA000" strokeWidth="1"/>
              <text x="12" y="16" textAnchor="middle" fill="#FFD500" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold">$</text>
              <ellipse cx="9" cy="9" rx="2" ry="3" fill="#FFEB3B" opacity="0.6" transform="rotate(-30 9 9)"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Green Wallet</h2>
            <p className="text-sm text-text-secondary">Redeem your eco rewards</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="wallet" className="px-4">
        <TabsList className="grid w-full grid-cols-3 glassmorphic border-dark-border mb-6">
          <TabsTrigger value="wallet" className="text-sm">Wallet</TabsTrigger>
          <TabsTrigger value="rewards" className="text-sm">Rewards</TabsTrigger>
          <TabsTrigger value="history" className="text-sm">History</TabsTrigger>
        </TabsList>

        <TabsContent value="wallet">
          {/* Balance Card */}
          <div className="mb-6">
            <GlassmorphicCard className="p-6 rounded-3xl bg-gradient-to-br from-eco-green to-reward-yellow bg-opacity-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-reward-yellow mb-2">
                  {greenCoins.toLocaleString()}
                </div>
                <div className="text-text-secondary mb-4">Green Coins Available</div>
                
                {/* Balance in currency */}
                <div className="bg-dark-surface-variant p-3 rounded-xl">
                  <div className="text-sm text-text-secondary">Equivalent Value</div>
                  <div className="text-lg font-medium text-eco-green">₹{equivalentValue}</div>
                </div>
              </div>
            </GlassmorphicCard>
          </div>
          
          {/* QR Code Generation */}
          <div className="mb-6">
            <GlassmorphicCard>
              <CardContent className="p-4">
                <h3 className="font-medium mb-4 flex items-center space-x-2">
                  <i className="fas fa-qrcode text-eco-green" />
                  <span>Generate QR Reward</span>
                </h3>
                
                <div className="text-center">
                  {qrCode ? (
                    <div className="mb-4">
                      <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center p-4">
                        <img src={qrCode} alt="QR Code" className="w-full h-full" />
                      </div>
                      <Button
                        onClick={resetQR}
                        variant="outline"
                        className="mb-2"
                      >
                        Generate New QR
                      </Button>
                      <p className="text-xs text-text-secondary">
                        Present this QR code at participating stores
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {/* Small Reward Tier */}
                        <Button
                          onClick={() => generateQRCode('small')}
                          disabled={isGeneratingQR || greenCoins < 100}
                          className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-medium py-3 px-4 rounded-2xl"
                        >
                          {isGeneratingQR ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                              Generating...
                            </>
                          ) : (
                            '₹50 QR Code (100 coins)'
                          )}
                        </Button>
                        
                        {/* Medium Reward Tier */}
                        <Button
                          onClick={() => generateQRCode('medium')}
                          disabled={isGeneratingQR || greenCoins < 250}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium py-3 px-4 rounded-2xl"
                        >
                          ₹150 QR Code (250 coins)
                        </Button>
                        
                        {/* Large Reward Tier - Best Value! */}
                        <Button
                          onClick={() => generateQRCode('large')}
                          disabled={isGeneratingQR || greenCoins < 500}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium py-3 px-4 rounded-2xl relative"
                        >
                          ₹350 QR Code (500 coins)
                          <span className="absolute -top-2 -right-2 bg-reward-yellow text-dark-bg text-xs px-2 py-1 rounded-full font-bold">
                            BEST VALUE!
                          </span>
                        </Button>
                      </div>
                      
                      <p className="text-xs text-text-secondary mt-3 text-center">
                        Present QR codes at participating stores, cafes, and online shops
                      </p>
                      
                      {greenCoins < 100 && (
                        <p className="text-xs text-red-400 mt-2 text-center">
                          You need {100 - greenCoins} more coins for the smallest reward
                        </p>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </GlassmorphicCard>
          </div>
      
        </TabsContent>

        <TabsContent value="rewards">
          <RewardFeatures greenCoins={greenCoins} />
        </TabsContent>

        <TabsContent value="history">
          <h3 className="font-medium mb-4">Recent Activity</h3>
        
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
  );
}
