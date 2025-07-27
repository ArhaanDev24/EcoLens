import { TrendingUp, TrendingDown, Trophy, Target, Zap, Award } from 'lucide-react';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardContent } from './enhanced-card';
import { EnhancedProgress, CircularProgress } from './enhanced-progress';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'eco-green' | 'reward-yellow' | 'purple' | 'cyan' | 'pink';
  className?: string;
}

const colorClasses = {
  'eco-green': {
    bg: 'from-eco-green to-emerald-500',
    text: 'text-eco-green',
    light: 'bg-eco-green/10',
  },
  'reward-yellow': {
    bg: 'from-reward-yellow to-amber-400',
    text: 'text-reward-yellow',
    light: 'bg-reward-yellow/10',
  },
  'purple': {
    bg: 'from-purple-500 to-purple-600',
    text: 'text-purple-400',
    light: 'bg-purple-500/10',
  },
  'cyan': {
    bg: 'from-cyan-500 to-cyan-600',
    text: 'text-cyan-400',
    light: 'bg-cyan-500/10',
  },
  'pink': {
    bg: 'from-pink-500 to-pink-600',
    text: 'text-pink-400',
    light: 'bg-pink-500/10',
  },
};

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'eco-green',
  className 
}: StatsCardProps) {
  const colorClass = colorClasses[color];

  return (
    <EnhancedCard className={cn('enhanced-hover', className)} variant="intense">
      <EnhancedCardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className={cn('text-3xl 4k:text-4xl 8k:text-5xl font-bold', colorClass.text)}>
                {value}
              </h3>
              {trend && (
                <div className={cn(
                  'flex items-center text-sm font-medium',
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                )}>
                  {trend.isPositive ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(trend.value)}%
                </div>
              )}
            </div>
            {subtitle && (
              <p className="text-text-secondary text-xs mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            'p-3 4k:p-4 8k:p-5 rounded-2xl bg-gradient-to-br shadow-lg',
            colorClass.bg
          )}>
            <Icon className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
          </div>
        </div>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}

interface ProgressStatsCardProps {
  title: string;
  current: number;
  target: number;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'eco-green' | 'reward-yellow' | 'purple' | 'cyan' | 'pink';
  unit?: string;
  showCircular?: boolean;
}

export function ProgressStatsCard({
  title,
  current,
  target,
  icon: Icon,
  color = 'eco-green',
  unit = '',
  showCircular = false,
}: ProgressStatsCardProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const colorClass = colorClasses[color];

  return (
    <EnhancedCard className="enhanced-hover" variant="intense">
      <EnhancedCardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-text-primary mb-1">{title}</h3>
            <p className="text-sm text-text-secondary">
              {current}{unit} / {target}{unit}
            </p>
          </div>
          <div className={cn(
            'p-3 rounded-2xl bg-gradient-to-br shadow-lg',
            colorClass.bg
          )}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>

        {showCircular ? (
          <div className="flex justify-center">
            <CircularProgress
              value={current}
              max={target}
              size={80}
              strokeWidth={6}
              variant={color === 'eco-green' ? 'default' : color === 'reward-yellow' ? 'warning' : 'success'}
              showValue={true}
            />
          </div>
        ) : (
          <EnhancedProgress
            value={current}
            max={target}
            variant={color === 'eco-green' ? 'default' : color === 'reward-yellow' ? 'warning' : 'success'}
            showValue={true}
            animated={percentage > 0}
          />
        )}
      </EnhancedCardContent>
    </EnhancedCard>
  );
}

interface AchievementProgressCardProps {
  title: string;
  description: string;
  current: number;
  target: number;
  isUnlocked: boolean;
  coinReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500'
};

export function AchievementProgressCard({
  title,
  description,
  current,
  target,
  isUnlocked,
  coinReward,
  rarity,
}: AchievementProgressCardProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const rarityColor = rarityColors[rarity];

  return (
    <EnhancedCard 
      className={cn(
        'enhanced-hover',
        isUnlocked && 'border-eco-green/30 bg-gradient-to-br from-eco-green/10 to-emerald-500/5'
      )}
      variant="intense"
    >
      <EnhancedCardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className={cn(
              'font-bold text-lg mb-1',
              isUnlocked ? 'text-eco-green' : 'text-text-primary'
            )}>
              {title}
            </h3>
            <p className="text-text-secondary text-sm">{description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {isUnlocked && (
              <div className="flex items-center space-x-1 bg-eco-green/20 px-2 py-1 rounded-lg">
                <Trophy className="w-4 h-4 text-eco-green" />
                <span className="text-eco-green text-xs font-bold">{coinReward}</span>
              </div>
            )}
            <div className={cn(
              'p-2 rounded-xl bg-gradient-to-br shadow-md',
              rarityColor,
              !isUnlocked && 'opacity-50'
            )}>
              <Award className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <EnhancedProgress
            value={current}
            max={target}
            variant={isUnlocked ? 'success' : 'default'}
            showValue={true}
            animated={!isUnlocked && percentage > 0}
          />
          <div className="flex justify-between text-xs text-text-secondary">
            <span>Progress: {current}/{target}</span>
            <span className="capitalize">{rarity} Achievement</span>
          </div>
        </div>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}