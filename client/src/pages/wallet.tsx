import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GlassmorphicCard } from '@/components/ui/glassmorphic-card';
import { CardContent } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

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

  const generateQRCode = async () => {
    if (greenCoins < 50) {
      alert('Insufficient coins! You need 50 coins to generate a ₹20 QR code.');
      return;
    }

    setIsGeneratingQR(true);
    
    try {
      const response = await apiRequest('POST', '/api/transactions/qr', {
        amount: 50,
        value: 20 // ₹20 value
      });
      
      const data = await response.json();
      setQrCode(data.qrCode);
      onCoinsSpent(50);
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

  const equivalentValue = (greenCoins * 0.02).toFixed(2); // 1 coin = ₹0.02

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="p-4 glassmorphic">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-reward-yellow rounded-full flex items-center justify-center">
            <i className="fas fa-wallet text-dark-bg text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Green Wallet</h2>
            <p className="text-sm text-text-secondary">Redeem your eco rewards</p>
          </div>
        </div>
      </div>
      
      {/* Balance Card */}
      <div className="p-4">
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
      <div className="px-4 mb-6">
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
                  <Button
                    onClick={generateQRCode}
                    disabled={isGeneratingQR || greenCoins < 50}
                    className="bg-eco-green text-dark-bg font-medium py-3 px-8 rounded-2xl hover:bg-eco-green"
                  >
                    {isGeneratingQR ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full mr-2" />
                        Generating...
                      </>
                    ) : (
                      'Generate ₹20 QR Code (50 coins)'
                    )}
                  </Button>
                  
                  <p className="text-xs text-text-secondary mt-3">
                    Present this QR code at participating stores
                  </p>
                  
                  {greenCoins < 50 && (
                    <p className="text-xs text-red-400 mt-2">
                      You need {50 - greenCoins} more coins to generate a QR code
                    </p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </GlassmorphicCard>
      </div>
      
      {/* Recent Transactions */}
      <div className="px-4">
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
      </div>
    </div>
  );
}
