import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Gift, 
  ShoppingCart, 
  Coffee, 
  Utensils, 
  Car, 
  Zap,
  Star,
  Crown
} from 'lucide-react';

interface RewardFeaturesProps {
  greenCoins: number;
}

export function RewardFeatures({ greenCoins }: RewardFeaturesProps) {
  const rewardCategories = [
    {
      title: "Food & Dining",
      icon: <Utensils className="w-5 h-5" />,
      color: "from-orange-500 to-red-500",
      items: [
        { name: "Coffee Voucher", coins: 75, value: "₹40", popular: true, premium: false },
        { name: "Fast Food Meal", coins: 150, value: "₹80", popular: false, premium: false },
        { name: "Restaurant Discount", coins: 300, value: "₹200", popular: false, premium: false },
      ]
    },
    {
      title: "Shopping & Retail",
      icon: <ShoppingCart className="w-5 h-5" />,
      color: "from-blue-500 to-purple-500",
      items: [
        { name: "Online Store Credit", coins: 200, value: "₹100", popular: false, premium: false },
        { name: "Fashion Discount", coins: 400, value: "₹250", popular: false, premium: false },
        { name: "Electronics Voucher", coins: 800, value: "₹500", popular: false, premium: true },
      ]
    },
    {
      title: "Transport & Travel",
      icon: <Car className="w-5 h-5" />,
      color: "from-green-500 to-teal-500",
      items: [
        { name: "Bus/Metro Pass", coins: 120, value: "₹60", popular: false, premium: false },
        { name: "Ride Share Credit", coins: 250, value: "₹150", popular: false, premium: false },
        { name: "Travel Voucher", coins: 600, value: "₹400", popular: false, premium: false },
      ]
    },
    {
      title: "Digital Services",
      icon: <Zap className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
      items: [
        { name: "Mobile Recharge", coins: 100, value: "₹50", popular: true, premium: false },
        { name: "Streaming Subscription", coins: 300, value: "₹199", popular: false, premium: false },
        { name: "Gaming Credits", coins: 400, value: "₹250", popular: false, premium: false },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-2">Reward Store</h2>
        <p className="text-sm text-text-secondary">Exchange your Green Coins for amazing rewards!</p>
      </div>

      {rewardCategories.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="glassmorphic border-dark-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center text-white`}>
                {category.icon}
              </div>
              <h3 className="font-semibold text-text-primary">{category.title}</h3>
            </div>

            <div className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className="flex items-center justify-between p-3 bg-dark-surface-variant rounded-xl"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-text-primary">{item.name}</span>
                      {item.popular && (
                        <div className="inline-flex items-center bg-reward-yellow/20 text-reward-yellow border border-reward-yellow/30 text-xs px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </div>
                      )}
                      {item.premium && (
                        <div className="inline-flex items-center bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs px-2 py-1 rounded-full">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-eco-green font-medium">{item.value}</span>
                      <span className="text-xs text-text-secondary">• {item.coins} coins</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    disabled={greenCoins < item.coins}
                    className={`px-4 py-2 text-sm ${
                      greenCoins >= item.coins
                        ? `bg-gradient-to-r ${category.color} text-white hover:opacity-90`
                        : 'bg-dark-surface text-text-secondary cursor-not-allowed'
                    }`}
                  >
                    {greenCoins >= item.coins ? 'Redeem' : 'Need More'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Special Offers */}
      <Card className="glassmorphic border-dark-border bg-gradient-to-r from-eco-green/10 to-reward-yellow/10">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-eco-green to-reward-yellow rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-dark-bg" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Limited Time Offers</h3>
              <p className="text-xs text-text-secondary">Special deals for eco-heroes!</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-dark-surface-variant rounded-xl border border-reward-yellow/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-text-primary">Eco Hero Bundle</span>
                    <div className="bg-reward-yellow text-dark-bg text-xs px-2 py-1 rounded-full font-bold">50% OFF</div>
                  </div>
                  <p className="text-sm text-eco-green font-medium">₹500 worth of rewards</p>
                  <p className="text-xs text-text-secondary">Restaurant + Shopping + Transport vouchers</p>
                </div>
                <Button
                  disabled={greenCoins < 400}
                  className="bg-gradient-to-r from-eco-green to-reward-yellow text-dark-bg hover:opacity-90"
                >
                  {greenCoins >= 400 ? '400 coins' : 'Need More'}
                </Button>
              </div>
            </div>

            <div className="p-3 bg-dark-surface-variant rounded-xl border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-text-primary">Green Champion Package</span>
                    <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">EXCLUSIVE</div>
                  </div>
                  <p className="text-sm text-eco-green font-medium">₹1000 value pack</p>
                  <p className="text-xs text-text-secondary">Premium rewards + bonus credits</p>
                </div>
                <Button
                  disabled={greenCoins < 700}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
                >
                  {greenCoins >= 700 ? '700 coins' : 'Need More'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}