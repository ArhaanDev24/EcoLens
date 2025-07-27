import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { FadeIn, SlideIn } from '@/components/ui/enhanced-animations';
import { EnhancedProgress } from '@/components/ui/enhanced-progress';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { notify, NotificationProvider } from '@/components/ui/enhanced-notifications';
import { CountUp } from '@/components/ui/count-up';
import { 
  Target, 
  Leaf, 
  Droplet, 
  Zap, 
  TreePine, 
  Trash2, 
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Plus,
  Edit,
  Bell,
  BarChart3,
  Activity,
  Sparkles,
  CheckCircle2,
  Users,
  Sun,
  Moon,
  Coffee,
  Sunset
} from 'lucide-react';

interface PersonalGoal {
  id: number;
  title: string;
  description: string;
  goalType: string;
  targetType: string;
  targetValue: number;
  currentProgress: number;
  isActive: boolean;
  completedAt: Date | null;
  endDate: Date | null;
}

interface EnvironmentalImpact {
  totalCO2Saved: number;
  totalWaterSaved: number;
  totalEnergySaved: number;
  treesSaved: number;
  landfillDiverted: number;
  recyclingScore: number;
}

interface HabitInsights {
  averageDaily: number;
  bestStreak: number;
  favoriteTime: string;
  weeklyPattern: Record<string, number>;
}

interface AnalyticsDashboard {
  goals: {
    active: PersonalGoal[];
    completed: PersonalGoal[];
    completionRate: number;
    total: number;
  };
  environmentalImpact: EnvironmentalImpact;
  habits: {
    insights: HabitInsights;
    currentStreak: number;
    recentData: any[];
  };
  reminders: {
    active: any[];
    total: number;
  };
}

export default function AnalyticsPage() {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const queryClient = useQueryClient();

  const { data: analytics, isLoading } = useQuery<AnalyticsDashboard>({
    queryKey: ['/api/user/1/analytics-dashboard'],
    retry: false,
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: any) => {
      return apiRequest('POST', '/api/user/1/goals', goalData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/1/analytics-dashboard'] });
      setShowGoalForm(false);
      notify.success('Success', 'Goal created successfully!');
    },
  });

  const createReminderMutation = useMutation({
    mutationFn: async (reminderData: any) => {
      return apiRequest('POST', '/api/user/1/reminders', reminderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/1/analytics-dashboard'] });
      notify.success('Success', 'Smart reminder created!');
    },
  });

  // Auto-create smart reminders based on user behavior - disabled for now
  // useEffect(() => {
  //   if (analytics?.habits.currentStreak === 0 && analytics?.reminders.active.length === 0) {
  //     // Create a reminder if user hasn't recycled in a while
  //     createReminderMutation.mutate({
  //       reminderType: 'recycling',
  //       frequency: 'daily',
  //       message: "Haven't recycled in 3 days - find something to recycle today!",
  //       isActive: true,
  //       nextScheduled: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  //     });
  //   }
  // }, [analytics]);

  const getTimeIcon = (time: string) => {
    switch (time) {
      case 'morning': return Sun;
      case 'afternoon': return Coffee;
      case 'evening': return Sunset;
      case 'night': return Moon;
      default: return Clock;
    }
  };

  const formatNumber = (num: number, unit: string) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k ${unit}`;
    }
    return `${num} ${unit}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-green"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">No Analytics Data</h2>
          <p className="text-gray-400">Start recycling to see your impact!</p>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-dark-bg text-white">
      
      {/* Header */}
      <FadeIn>
        <div className="p-4 sm:p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-eco-green to-emerald-400 bg-clip-text text-transparent mb-2">
              Personal Impact Dashboard
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Track your environmental impact and recycling habits
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Environmental Impact Cards */}
      <FadeIn>
        <div className="px-4 sm:px-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Leaf className="mr-2 text-eco-green" />
            Environmental Impact
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <EnhancedCard className="p-4 text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-green-500 to-eco-green rounded-full flex items-center justify-center mb-3">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-eco-green mb-1">
                <CountUp end={analytics.environmentalImpact.totalCO2Saved} duration={1500} />g
              </div>
              <div className="text-xs text-gray-300">CO₂ Saved</div>
            </EnhancedCard>

            <EnhancedCard className="p-4 text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-3">
                <Droplet className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">
                <CountUp end={analytics.environmentalImpact.totalWaterSaved} duration={1500} />L
              </div>
              <div className="text-xs text-gray-300">Water Saved</div>
            </EnhancedCard>

            <EnhancedCard className="p-4 text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                <CountUp end={analytics.environmentalImpact.totalEnergySaved} duration={1500} />Wh
              </div>
              <div className="text-xs text-gray-300">Energy Saved</div>
            </EnhancedCard>

            <EnhancedCard className="p-4 text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-3">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                <CountUp end={analytics.environmentalImpact.treesSaved} duration={1500} />
              </div>
              <div className="text-xs text-gray-300">Trees Saved</div>
            </EnhancedCard>

            <EnhancedCard className="p-4 text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">
                <CountUp end={analytics.environmentalImpact.landfillDiverted} duration={1500} />g
              </div>
              <div className="text-xs text-gray-300">Waste Diverted</div>
            </EnhancedCard>

            <EnhancedCard className="p-4 text-center">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-indigo-400 mb-1">
                <CountUp end={analytics.environmentalImpact.recyclingScore} duration={1500} />
              </div>
              <div className="text-xs text-gray-300">Eco Score</div>
            </EnhancedCard>
          </div>
        </div>
      </FadeIn>

      {/* Personal Goals Section */}
      <SlideIn direction="left">
        <div className="px-4 sm:px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Target className="mr-2 text-eco-green" />
              Personal Goals
            </h2>
            <EnhancedButton
              size="sm"
              onClick={() => setShowGoalForm(true)}
              icon={Plus}
            >
              Add Goal
            </EnhancedButton>
          </div>

          <div className="grid gap-4">
            {analytics.goals.active.length === 0 ? (
              <EnhancedCard className="p-6 text-center">
                <Target className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Active Goals</h3>
                <p className="text-gray-400 mb-4">Set your first recycling goal to get started!</p>
                <EnhancedButton onClick={() => setShowGoalForm(true)} icon={Plus}>
                  Create Your First Goal
                </EnhancedButton>
              </EnhancedCard>
            ) : (
              analytics.goals.active.map((goal) => (
                <EnhancedCard key={goal.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white">{goal.title}</h3>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {goal.endDate ? new Date(goal.endDate).toLocaleDateString() : 'Ongoing'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4">{goal.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Progress</span>
                      <span className="text-eco-green">
                        {goal.currentProgress} / {goal.targetValue} {goal.targetType}
                      </span>
                    </div>
                    <EnhancedProgress 
                      value={(goal.currentProgress / goal.targetValue) * 100}
                      className="h-2"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-eco-green/20 text-eco-green rounded-full">
                      {goal.goalType} Goal
                    </span>
                    <EnhancedButton size="sm" variant="ghost" icon={Edit}>
                      Edit
                    </EnhancedButton>
                  </div>
                </EnhancedCard>
              ))
            )}
          </div>

          {analytics.goals.completed.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-semibold text-white mb-3 flex items-center">
                <CheckCircle2 className="mr-2 text-eco-green" />
                Completed Goals ({analytics.goals.completed.length})
              </h3>
              <div className="grid gap-3">
                {analytics.goals.completed.slice(0, 3).map((goal) => (
                  <EnhancedCard key={goal.id} className="p-3 opacity-75">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{goal.title}</h4>
                        <p className="text-xs text-gray-400">
                          Completed {goal.completedAt ? new Date(goal.completedAt).toLocaleDateString() : ''}
                        </p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-eco-green" />
                    </div>
                  </EnhancedCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </SlideIn>

      {/* Habit Analytics */}
      <SlideIn direction="right">
        <div className="px-4 sm:px-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="mr-2 text-eco-green" />
            Habit Analytics
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <EnhancedCard className="p-4 text-center">
              <div className="w-10 h-10 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-3">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-bold text-orange-400 mb-1">
                <CountUp end={analytics.habits.currentStreak} duration={1000} />
              </div>
              <div className="text-xs text-gray-300">Current Streak</div>
            </EnhancedCard>

            <EnhancedCard className="p-4 text-center">
              <div className="w-10 h-10 mx-auto bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-bold text-purple-400 mb-1">
                <CountUp end={analytics.habits.insights.bestStreak} duration={1000} />
              </div>
              <div className="text-xs text-gray-300">Best Streak</div>
            </EnhancedCard>

            <EnhancedCard className="p-4 text-center">
              <div className="w-10 h-10 mx-auto bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl font-bold text-green-400 mb-1">
                <CountUp end={analytics.habits.insights.averageDaily} duration={1000} />
              </div>
              <div className="text-xs text-gray-300">Daily Average</div>
            </EnhancedCard>

            <EnhancedCard className="p-4 text-center">
              <div className="w-10 h-10 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-3">
                {React.createElement(getTimeIcon(analytics.habits.insights.favoriteTime), { className: "w-5 h-5 text-white" })}
              </div>
              <div className="text-sm font-bold text-yellow-400 mb-1 capitalize">
                {analytics.habits.insights.favoriteTime}
              </div>
              <div className="text-xs text-gray-300">Favorite Time</div>
            </EnhancedCard>
          </div>

          {/* Weekly Pattern */}
          <EnhancedCard className="p-4">
            <h3 className="font-semibold text-white mb-4 flex items-center">
              <Calendar className="mr-2 text-eco-green" />
              Weekly Activity Pattern
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.habits.insights.weeklyPattern).map(([day, count]) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 w-20">{day}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-eco-green to-emerald-400 h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${Math.max((count / Math.max(...Object.values(analytics.habits.insights.weeklyPattern))) * 100, 5)}%` 
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-eco-green font-medium w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </EnhancedCard>
        </div>
      </SlideIn>

      {/* Smart Reminders */}
      <SlideIn direction="up">
        <div className="px-4 sm:px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Bell className="mr-2 text-eco-green" />
              Smart Reminders
            </h2>
            <span className="text-sm text-gray-400">
              {analytics.reminders.active.length} active
            </span>
          </div>

          {analytics.reminders.active.length === 0 ? (
            <EnhancedCard className="p-6 text-center">
              <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Smart Reminders Active</h3>
              <p className="text-gray-400 text-sm">
                EcoLens will automatically create helpful reminders based on your recycling habits.
                Keep recycling to unlock personalized insights!
              </p>
            </EnhancedCard>
          ) : (
            <div className="grid gap-3">
              {analytics.reminders.active.map((reminder, index) => (
                <EnhancedCard key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-eco-green/20 rounded-full flex items-center justify-center mr-3">
                        <Bell className="w-4 h-4 text-eco-green" />
                      </div>
                      <div>
                        <p className="text-sm text-white">{reminder.message}</p>
                        <p className="text-xs text-gray-400">
                          {reminder.frequency} reminder
                        </p>
                      </div>
                    </div>
                    <EnhancedButton size="sm" variant="ghost">
                      Edit
                    </EnhancedButton>
                  </div>
                </EnhancedCard>
              ))}
            </div>
          )}
        </div>
      </SlideIn>

      {/* Goal Creation Form Modal */}
      {showGoalForm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowGoalForm(false);
            }
          }}
        >
          <FadeIn>
            <EnhancedCard 
              className="w-full max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Create New Goal</h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const endDateValue = formData.get('endDate') as string;
                createGoalMutation.mutate({
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  goalType: formData.get('goalType') as string,
                  targetType: formData.get('targetType') as string,
                  targetValue: parseInt(formData.get('targetValue') as string),
                  endDate: endDateValue && endDateValue.trim() ? endDateValue : null
                });
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Goal Title
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    placeholder="e.g., Recycle 50 items this month"
                    className="w-full p-3 bg-gray-800/90 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-eco-green focus:outline-none focus:ring-1 focus:ring-eco-green"
                    style={{ zIndex: 60 }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Optional description..."
                    className="w-full p-3 bg-gray-800/90 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-eco-green focus:outline-none focus:ring-1 focus:ring-eco-green"
                    rows={3}
                    style={{ zIndex: 60 }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Goal Type
                    </label>
                    <select
                      name="goalType"
                      required
                      className="w-full p-3 bg-gray-800/90 border border-gray-600 rounded-lg text-white focus:border-eco-green focus:outline-none focus:ring-1 focus:ring-eco-green"
                      style={{ zIndex: 60 }}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Type
                    </label>
                    <select
                      name="targetType"
                      required
                      className="w-full p-3 bg-gray-800/90 border border-gray-600 rounded-lg text-white focus:border-eco-green focus:outline-none focus:ring-1 focus:ring-eco-green"
                      style={{ zIndex: 60 }}
                    >
                      <option value="detections">Items Recycled</option>
                      <option value="coins">Green Coins</option>
                      <option value="streak">Streak Days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Target Value
                  </label>
                  <input
                    name="targetValue"
                    type="number"
                    required
                    min="1"
                    placeholder="e.g., 50"
                    className="w-full p-3 bg-gray-800/90 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-eco-green focus:outline-none focus:ring-1 focus:ring-eco-green"
                    style={{ zIndex: 60 }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    name="endDate"
                    type="date"
                    className="w-full p-3 bg-gray-800/90 border border-gray-600 rounded-lg text-white focus:border-eco-green focus:outline-none focus:ring-1 focus:ring-eco-green"
                    style={{ zIndex: 60 }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <EnhancedButton
                    type="button"
                    variant="outline"
                    onClick={() => setShowGoalForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </EnhancedButton>
                  <EnhancedButton
                    type="submit"
                    disabled={createGoalMutation.isPending}
                    className="flex-1"
                  >
                    {createGoalMutation.isPending ? 'Creating...' : 'Create Goal'}
                  </EnhancedButton>
                </div>
              </form>
            </EnhancedCard>
          </FadeIn>
        </div>
      )}
      </div>
    </NotificationProvider>
  );
}