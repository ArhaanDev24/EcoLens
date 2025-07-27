import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Award, Zap, Target, Recycle, Trophy, Coins, BarChart3 } from 'lucide-react';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardContent } from "@/components/ui/enhanced-card";
import { LoadingCard } from "@/components/ui/enhanced-loading";
import { EnhancedAchievementSystem } from "@/components/ui/enhanced-achievement-system";
import { EnhancedDashboard } from "@/components/ui/enhanced-dashboard";
import { cn } from '@/lib/utils';

interface Stats {
  totalDetections: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  favoriteItemType: string | null;
  streakDays: number;
  plasticItemsDetected: number;
  paperItemsDetected: number;
  glassItemsDetected: number;
  metalItemsDetected: number;
}

interface Achievement {
  id: number;
  achievementType: string;
  title: string;
  description: string;
  iconType: string;
  unlockedAt: string;
}

export default function EnhancedStatsPage() {
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ['/api/user/1/stats'],
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/user/1/achievements'],
  });

  if (statsLoading || achievementsLoading) {
    return (
      <div className="min-h-screen bg-dark-bg pb-20">
        <div className="container mx-auto px-4 py-8">
          <LoadingCard />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <LoadingCard />
            <LoadingCard />
          </div>
          <div className="mt-6">
            <LoadingCard />
          </div>
        </div>
      </div>
    );
  }

  const totalRecycled = (stats?.plasticItemsDetected || 0) + 
                       (stats?.paperItemsDetected || 0) + 
                       (stats?.glassItemsDetected || 0) + 
                       (stats?.metalItemsDetected || 0);

  const getAchievementIcon = (iconType: string) => {
    switch (iconType) {
      case 'streak': return <Zap className="w-6 h-6" />;
      case 'detection': return <Target className="w-6 h-6" />;
      case 'coins': return <Coins className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Enhanced Header */}
      <div className="glassmorphic-intense p-6 slide-in-up">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-eco-green/20 rounded-full flex items-center justify-center floating-animation">
            <BarChart3 className="w-6 h-6 text-eco-green" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Your Eco Impact</h1>
            <p className="text-text-secondary">Track your recycling journey</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-4 slide-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="glassmorphic p-6 rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Scans</p>
                <p className="text-2xl font-bold text-eco-green">{stats?.totalDetections || 0}</p>
              </div>
              <div className="w-12 h-12 bg-eco-green/20 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-eco-green" />
              </div>
            </div>
          </div>

          <div className="glassmorphic p-6 rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Green Coins</p>
                <p className="text-2xl font-bold text-reward-yellow">{stats?.totalCoinsEarned || 0}</p>
              </div>
              <div className="w-12 h-12 bg-reward-yellow/20 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-reward-yellow" />
              </div>
            </div>
          </div>
        </div>

        {/* Streak & Total Items */}
        <div className="grid grid-cols-2 gap-4 slide-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="glassmorphic p-6 rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Streak Days</p>
                <p className="text-2xl font-bold text-orange-400">{stats?.streakDays || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-400/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="glassmorphic p-6 rounded-3xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Items Recycled</p>
                <p className="text-2xl font-bold text-blue-400">{totalRecycled}</p>
              </div>
              <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center">
                <Recycle className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Material Breakdown */}
        <div className="glassmorphic p-6 rounded-3xl slide-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-eco-green" />
            Material Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Plastic
              </span>
              <span className="text-text-primary font-medium">{stats?.plasticItemsDetected || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Paper
              </span>
              <span className="text-text-primary font-medium">{stats?.paperItemsDetected || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                Glass
              </span>
              <span className="text-text-primary font-medium">{stats?.glassItemsDetected || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                Metal
              </span>
              <span className="text-text-primary font-medium">{stats?.metalItemsDetected || 0}</span>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        {achievements && achievements.length > 0 && (
          <div className="glassmorphic p-6 rounded-3xl slide-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-reward-yellow" />
              Recent Achievements
            </h3>
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement, index) => (
                <div 
                  key={achievement.id} 
                  className="flex items-center space-x-3 p-3 bg-dark-surface-variant rounded-xl bounce-in"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="w-10 h-10 bg-reward-yellow/20 rounded-full flex items-center justify-center">
                    {getAchievementIcon(achievement.iconType)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">{achievement.title}</h4>
                    <p className="text-sm text-text-secondary">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Environmental Impact */}
        <div className="glassmorphic p-6 rounded-3xl slide-in-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
            <Recycle className="w-5 h-5 mr-2 text-eco-green" />
            Environmental Impact
          </h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-eco-green/10 rounded-xl border border-eco-green/20">
              <p className="text-3xl font-bold text-eco-green mb-2">{totalRecycled * 0.5}kg</p>
              <p className="text-sm text-text-secondary">CO₂ Saved</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-500/10 rounded-xl">
                <p className="text-xl font-bold text-blue-400">{totalRecycled * 2}L</p>
                <p className="text-xs text-text-secondary">Water Saved</p>
              </div>
              <div className="text-center p-3 bg-green-500/10 rounded-xl">
                <p className="text-xl font-bold text-green-400">{totalRecycled}</p>
                <p className="text-xs text-text-secondary">Items Diverted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}