import { useState, useEffect } from 'react';
import { Trophy, Star, Target, Zap, Award, Crown, Shield, Flame } from 'lucide-react';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardContent } from './enhanced-card';
import { EnhancedButton } from './enhanced-button';
import { useQuery } from '@tanstack/react-query';

interface Achievement {
  id: number;
  achievementType: string;
  title: string;
  description: string;
  requirement: number;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  coinReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const achievementIcons = {
  'first_scan': Target,
  'coin_collector': Trophy,
  'eco_warrior': Shield,
  'streak_master': Flame,
  'detection_expert': Star,
  'recycling_champion': Crown,
  default: Award
};

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500'
};

const rarityBorders = {
  common: 'border-gray-400/30',
  rare: 'border-blue-400/30',
  epic: 'border-purple-400/30',
  legendary: 'border-yellow-400/30'
};

interface AchievementCardProps {
  achievement: Achievement;
  onClaim?: (id: number) => void;
}

function AchievementCard({ achievement, onClaim }: AchievementCardProps) {
  const Icon = achievementIcons[achievement.achievementType] || achievementIcons.default;
  const progressPercentage = Math.min((achievement.progress / achievement.requirement) * 100, 100);
  
  return (
    <EnhancedCard 
      className={`relative overflow-hidden ${rarityBorders[achievement.rarity]} ${achievement.isUnlocked ? 'bg-gradient-to-br from-eco-green/20 to-emerald-500/10' : ''}`}
      hover={true}
      glow={achievement.isUnlocked}
    >
      {/* Rarity Indicator */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${rarityColors[achievement.rarity]} opacity-20 rounded-bl-3xl`} />
      
      <EnhancedCardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${rarityColors[achievement.rarity]} ${achievement.isUnlocked ? 'shadow-lg' : 'opacity-50'}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${achievement.isUnlocked ? 'text-eco-green' : 'text-text-primary'}`}>
                {achievement.title}
              </h3>
              <p className="text-text-secondary text-sm">{achievement.description}</p>
            </div>
          </div>
          {achievement.isUnlocked && (
            <div className="flex items-center space-x-1 bg-eco-green/20 px-2 py-1 rounded-lg">
              <Trophy className="w-4 h-4 text-eco-green" />
              <span className="text-eco-green font-semibold text-sm">{achievement.coinReward}</span>
            </div>
          )}
        </div>
      </EnhancedCardHeader>
      
      <EnhancedCardContent>
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-dark-surface rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${rarityColors[achievement.rarity]} transition-all duration-500 rounded-full`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>{achievement.progress}</span>
              <span>{achievement.requirement}</span>
            </div>
          </div>
          
          {/* Achievement Status */}
          {achievement.isUnlocked ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-eco-green">
                <Zap className="w-4 h-4" />
                <span className="font-semibold text-sm">Unlocked!</span>
              </div>
              {achievement.unlockedAt && (
                <span className="text-xs text-text-secondary">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          ) : (
            <div className="text-center text-text-secondary text-sm">
              {progressPercentage === 100 ? 'Ready to unlock!' : `${Math.round(progressPercentage)}% complete`}
            </div>
          )}
        </div>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}

interface EnhancedAchievementSystemProps {
  className?: string;
}

export function EnhancedAchievementSystem({ className }: EnhancedAchievementSystemProps) {
  const { data: achievements, isLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  });

  // Generate dynamic achievements based on stats
  const generateAchievements = (): Achievement[] => {
    if (!stats) return [];
    
    return [
      {
        id: 1,
        achievementType: 'first_scan',
        title: 'First Steps',
        description: 'Complete your first recycling scan',
        requirement: 1,
        progress: Math.min(stats.totalDetections || 0, 1),
        isUnlocked: (stats.totalDetections || 0) >= 1,
        coinReward: 10,
        rarity: 'common' as const,
        unlockedAt: (stats.totalDetections || 0) >= 1 ? new Date().toISOString() : undefined
      },
      {
        id: 2,
        achievementType: 'coin_collector',
        title: 'Coin Collector',
        description: 'Earn your first 50 Green Coins',
        requirement: 50,
        progress: Math.min(stats.totalCoinsEarned || 0, 50),
        isUnlocked: (stats.totalCoinsEarned || 0) >= 50,
        coinReward: 25,
        rarity: 'rare' as const,
        unlockedAt: (stats.totalCoinsEarned || 0) >= 50 ? new Date().toISOString() : undefined
      },
      {
        id: 3,
        achievementType: 'eco_warrior',
        title: 'Eco Warrior',
        description: 'Successfully recycle 25 items',
        requirement: 25,
        progress: Math.min(
          (stats.plasticItemsDetected || 0) + 
          (stats.paperItemsDetected || 0) + 
          (stats.glassItemsDetected || 0) + 
          (stats.metalItemsDetected || 0), 
          25
        ),
        isUnlocked: ((stats.plasticItemsDetected || 0) + (stats.paperItemsDetected || 0) + (stats.glassItemsDetected || 0) + (stats.metalItemsDetected || 0)) >= 25,
        coinReward: 50,
        rarity: 'epic' as const,
        unlockedAt: ((stats.plasticItemsDetected || 0) + (stats.paperItemsDetected || 0) + (stats.glassItemsDetected || 0) + (stats.metalItemsDetected || 0)) >= 25 ? new Date().toISOString() : undefined
      },
      {
        id: 4,
        achievementType: 'streak_master',
        title: 'Streak Master',
        description: 'Maintain a 7-day recycling streak',
        requirement: 7,
        progress: Math.min(stats.streakDays || 0, 7),
        isUnlocked: (stats.streakDays || 0) >= 7,
        coinReward: 100,
        rarity: 'legendary' as const,
        unlockedAt: (stats.streakDays || 0) >= 7 ? new Date().toISOString() : undefined
      },
      {
        id: 5,
        achievementType: 'detection_expert',
        title: 'Detection Expert',
        description: 'Complete 100 AI detections',
        requirement: 100,
        progress: Math.min(stats.totalDetections || 0, 100),
        isUnlocked: (stats.totalDetections || 0) >= 100,
        coinReward: 75,
        rarity: 'epic' as const,
        unlockedAt: (stats.totalDetections || 0) >= 100 ? new Date().toISOString() : undefined
      }
    ];
  };

  const dynamicAchievements = generateAchievements();
  const unlockedCount = dynamicAchievements.filter(a => a.isUnlocked).length;
  const totalCoinsEarned = dynamicAchievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.coinReward, 0);

  if (isLoading || !stats) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-eco-green/20 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-eco-green animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Loading Achievements...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Achievement Overview */}
      <EnhancedCard variant="elevated" className="text-center">
        <EnhancedCardHeader gradient={true}>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-4 bg-gradient-to-br from-eco-green to-emerald-500 rounded-2xl shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-text-primary">Achievements</h2>
              <p className="text-text-secondary">Track your recycling milestones</p>
            </div>
          </div>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-eco-green/10 rounded-2xl">
              <div className="text-2xl font-bold text-eco-green">{unlockedCount}</div>
              <div className="text-sm text-text-secondary">Unlocked</div>
            </div>
            <div className="text-center p-4 bg-amber-500/10 rounded-2xl">
              <div className="text-2xl font-bold text-amber-500">{dynamicAchievements.length}</div>
              <div className="text-sm text-text-secondary">Total</div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-2xl">
              <div className="text-2xl font-bold text-purple-500">{totalCoinsEarned}</div>
              <div className="text-sm text-text-secondary">Bonus Coins</div>
            </div>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Achievement Cards */}
      <div className="grid gap-4">
        {dynamicAchievements.map((achievement) => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement}
          />
        ))}
      </div>
    </div>
  );
}