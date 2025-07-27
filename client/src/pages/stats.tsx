import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Award, Zap, Target, Recycle } from 'lucide-react';

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

export default function StatsPage() {
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ['/api/stats'],
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  if (statsLoading || achievementsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const totalRecycled = (stats?.plasticItemsDetected || 0) + 
                       (stats?.paperItemsDetected || 0) + 
                       (stats?.glassItemsDetected || 0) + 
                       (stats?.metalItemsDetected || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Eco Impact
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your recycling journey and environmental contribution
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Details</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Detections</CardTitle>
                  <Recycle className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalDetections || 0}</div>
                  <p className="text-xs text-green-100">Items scanned</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Green Coins Earned</CardTitle>
                  <TrendingUp className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCoinsEarned || 0}</div>
                  <p className="text-xs text-yellow-100">Total rewards</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                  <Zap className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.streakDays || 0}</div>
                  <p className="text-xs text-blue-100">Days active</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                  <Award className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{achievements?.length || 0}</div>
                  <p className="text-xs text-purple-100">Unlocked</p>
                </CardContent>
              </Card>
            </div>

            {/* Recycling Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Recycling Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Plastic Items</span>
                    <Badge variant="secondary">{stats?.plasticItemsDetected || 0}</Badge>
                  </div>
                  <Progress 
                    value={totalRecycled > 0 ? ((stats?.plasticItemsDetected || 0) / totalRecycled) * 100 : 0} 
                    className="h-2" 
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Paper Items</span>
                    <Badge variant="secondary">{stats?.paperItemsDetected || 0}</Badge>
                  </div>
                  <Progress 
                    value={totalRecycled > 0 ? ((stats?.paperItemsDetected || 0) / totalRecycled) * 100 : 0} 
                    className="h-2" 
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Glass Items</span>
                    <Badge variant="secondary">{stats?.glassItemsDetected || 0}</Badge>
                  </div>
                  <Progress 
                    value={totalRecycled > 0 ? ((stats?.glassItemsDetected || 0) / totalRecycled) * 100 : 0} 
                    className="h-2" 
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Metal Items</span>
                    <Badge variant="secondary">{stats?.metalItemsDetected || 0}</Badge>
                  </div>
                  <Progress 
                    value={totalRecycled > 0 ? ((stats?.metalItemsDetected || 0) / totalRecycled) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earning Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Coins Earned:</span>
                    <span className="font-bold text-green-600">{stats?.totalCoinsEarned || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Coins Spent:</span>
                    <span className="font-bold text-red-600">{stats?.totalCoinsSpent || 0}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Net Coins:</span>
                    <span className="font-bold text-blue-600">
                      {(stats?.totalCoinsEarned || 0) - (stats?.totalCoinsSpent || 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Detections:</span>
                    <span className="font-bold">{stats?.totalDetections || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Streak:</span>
                    <span className="font-bold">{stats?.streakDays || 0} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Favorite Type:</span>
                    <span className="font-bold capitalize">
                      {stats?.favoriteItemType || 'None yet'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements && achievements.length > 0 ? (
                achievements.map((achievement) => (
                  <Card key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Award className="h-6 w-6 text-yellow-600" />
                        <Badge variant="secondary" className="text-xs">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold text-lg mb-1">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {achievement.description}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">No achievements yet</h3>
                  <p className="text-gray-400">Start detecting recyclables to unlock achievements!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}