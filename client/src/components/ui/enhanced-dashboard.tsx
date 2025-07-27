import { Trophy, TrendingUp, Recycle, Coins, Target, Award, Star, Zap } from 'lucide-react';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardContent } from './enhanced-card';
import { StatsCard, ProgressStatsCard } from './enhanced-stats-widgets';
import { FadeIn, SlideIn, CountUp } from './enhanced-animations';
import { useQuery } from '@tanstack/react-query';

interface DashboardStats {
  totalDetections: number;
  totalCoinsEarned: number;
  totalCoinsSpent: number;
  streakDays: number;
  plasticItemsDetected: number;
  paperItemsDetected: number;
  glassItemsDetected: number;
  metalItemsDetected: number;
}

export function EnhancedDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/user/1/stats'],
  });

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 4k:gap-8 8k:gap-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 bg-dark-surface/30 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  const totalRecycled = stats.plasticItemsDetected + stats.paperItemsDetected + 
                       stats.glassItemsDetected + stats.metalItemsDetected;
  const netCoins = stats.totalCoinsEarned - stats.totalCoinsSpent;

  return (
    <div className="space-y-8 4k:space-y-12 8k:space-y-16">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 4k:gap-8 8k:gap-10">
        <FadeIn delay={0}>
          <StatsCard
            title="Total Scans"
            value={<CountUp end={stats.totalDetections} duration={1500} />}
            subtitle="AI detections completed"
            icon={Target}
            color="eco-green"
            trend={{ value: 12, isPositive: true }}
          />
        </FadeIn>

        <FadeIn delay={100}>
          <StatsCard
            title="Green Coins"
            value={<CountUp end={netCoins} duration={1500} />}
            subtitle={`${stats.totalCoinsEarned} earned • ${stats.totalCoinsSpent} spent`}
            icon={Coins}
            color="reward-yellow"
            trend={{ value: 8, isPositive: true }}
          />
        </FadeIn>

        <FadeIn delay={200}>
          <StatsCard
            title="Items Recycled"
            value={<CountUp end={totalRecycled} duration={1500} />}
            subtitle="Environmental impact made"
            icon={Recycle}
            color="cyan"
            trend={{ value: 15, isPositive: true }}
          />
        </FadeIn>

        <FadeIn delay={300}>
          <StatsCard
            title="Streak Days"
            value={<CountUp end={stats.streakDays} duration={1500} />}
            subtitle="Consecutive recycling days"
            icon={Zap}
            color="purple"
            trend={{ value: 3, isPositive: true }}
          />
        </FadeIn>
      </div>

      {/* Progress Goals */}
      <SlideIn direction="up" delay={400}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 4k:gap-8 8k:gap-10">
          <ProgressStatsCard
            title="Weekly Goal"
            current={stats.totalDetections % 7}
            target={10}
            icon={Target}
            color="eco-green"
            unit=" scans"
          />

          <ProgressStatsCard
            title="Coin Milestone"
            current={stats.totalCoinsEarned % 100}
            target={100}
            icon={Trophy}
            color="reward-yellow"
            unit=" coins"
            showCircular={true}
          />

          <ProgressStatsCard
            title="Recycling Champion"
            current={totalRecycled}
            target={50}
            icon={Award}
            color="purple"
            unit=" items"
          />
        </div>
      </SlideIn>

      {/* Category Breakdown */}
      <SlideIn direction="up" delay={600}>
        <EnhancedCard variant="intense" className="p-6 4k:p-8 8k:p-10">
          <EnhancedCardHeader>
            <h3 className="text-xl 4k:text-2xl 8k:text-3xl font-bold text-text-primary mb-2">
              Recycling Breakdown
            </h3>
            <p className="text-text-secondary">Items detected by category</p>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 4k:gap-6 8k:gap-8">
              <div className="text-center p-4 4k:p-6 8k:p-8 bg-blue-500/10 rounded-2xl">
                <div className="w-12 h-12 4k:w-16 4k:h-16 8k:w-20 8k:h-20 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-3">
                  <Recycle className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
                </div>
                <div className="text-2xl 4k:text-3xl 8k:text-4xl font-bold text-blue-400">
                  <CountUp end={stats.plasticItemsDetected} duration={2000} />
                </div>
                <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary">Plastic</div>
              </div>

              <div className="text-center p-4 4k:p-6 8k:p-8 bg-green-500/10 rounded-2xl">
                <div className="w-12 h-12 4k:w-16 4k:h-16 8k:w-20 8k:h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-3">
                  <Recycle className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
                </div>
                <div className="text-2xl 4k:text-3xl 8k:text-4xl font-bold text-green-400">
                  <CountUp end={stats.paperItemsDetected} duration={2000} />
                </div>
                <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary">Paper</div>
              </div>

              <div className="text-center p-4 4k:p-6 8k:p-8 bg-cyan-500/10 rounded-2xl">
                <div className="w-12 h-12 4k:w-16 4k:h-16 8k:w-20 8k:h-20 mx-auto bg-cyan-500 rounded-full flex items-center justify-center mb-3">
                  <Recycle className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
                </div>
                <div className="text-2xl 4k:text-3xl 8k:text-4xl font-bold text-cyan-400">
                  <CountUp end={stats.glassItemsDetected} duration={2000} />
                </div>
                <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary">Glass</div>
              </div>

              <div className="text-center p-4 4k:p-6 8k:p-8 bg-amber-500/10 rounded-2xl">
                <div className="w-12 h-12 4k:w-16 4k:h-16 8k:w-20 8k:h-20 mx-auto bg-amber-500 rounded-full flex items-center justify-center mb-3">
                  <Recycle className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
                </div>
                <div className="text-2xl 4k:text-3xl 8k:text-4xl font-bold text-amber-400">
                  <CountUp end={stats.metalItemsDetected} duration={2000} />
                </div>
                <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary">Metal</div>
              </div>
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      </SlideIn>

      {/* Impact Summary */}
      <SlideIn direction="up" delay={800}>
        <EnhancedCard variant="elevated" gradient={true} className="p-8 4k:p-10 8k:p-12 text-center bg-gradient-to-br from-eco-green/10 to-emerald-500/5">
          <div className="flex items-center justify-center mb-6">
            <div className="p-6 4k:p-8 8k:p-10 bg-gradient-to-br from-eco-green to-emerald-500 rounded-full shadow-2xl">
              <Star className="w-12 h-12 4k:w-16 4k:h-16 8k:w-20 8k:h-20 text-white" />
            </div>
          </div>
          <h2 className="text-3xl 4k:text-4xl 8k:text-5xl font-bold text-text-primary mb-4">
            Your Environmental Impact
          </h2>
          <p className="text-xl 4k:text-2xl 8k:text-3xl text-text-secondary mb-6">
            You've helped recycle <CountUp end={totalRecycled} className="text-eco-green font-bold" /> items
            and earned <CountUp end={stats.totalCoinsEarned} className="text-reward-yellow font-bold" /> Green Coins!
          </p>
          <div className="flex justify-center space-x-8 4k:space-x-12 8k:space-x-16 text-sm 4k:text-base 8k:text-lg text-text-secondary">
            <div>🌱 Carbon footprint reduced</div>
            <div>♻️ Waste diverted from landfills</div>
            <div>🌍 Contributing to a cleaner planet</div>
          </div>
        </EnhancedCard>
      </SlideIn>
    </div>
  );
}