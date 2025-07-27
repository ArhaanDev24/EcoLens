import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Database, Users, Activity, Trophy, Coins } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  greenCoins: number;
  totalEarned: number;
  createdAt: string;
}

interface Detection {
  id: number;
  userId: number;
  detectedObjects: string;
  confidenceScore: number;
  coinsEarned: number;
  createdAt: string;
}

interface Stats {
  id: number;
  userId: number;
  totalDetections: number;
  totalCoinsEarned: number;
  plasticItemsDetected: number;
  paperItemsDetected: number;
  glassItemsDetected: number;
  metalItemsDetected: number;
  createdAt: string;
  updatedAt: string;
}

interface Achievement {
  id: number;
  userId: number;
  achievementType: string;
  title: string;
  description: string;
  unlockedAt: string;
}

export default function DatabasePage() {
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
    refetchInterval: 2000, // Refresh every 2 seconds
  });

  const { data: detections } = useQuery<Detection[]>({
    queryKey: ['/api/user/1/detections'],
    refetchInterval: 2000,
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ['/api/user/1/stats'],
    refetchInterval: 2000,
  });

  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ['/api/user/1/achievements'],
    refetchInterval: 2000,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const parseDetectedObjects = (objectsString: string) => {
    try {
      return JSON.parse(objectsString);
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-800">EcoLens Database Live View</h1>
          </div>
          <p className="text-gray-600">Real-time database updates (refreshes every 2 seconds)</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live Data</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Users Table
              </CardTitle>
              <CardDescription>User accounts and coin balances</CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">ID: {user.id}</p>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Coins className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">{user.greenCoins}</span>
                      </div>
                      <p className="text-xs text-gray-500">Total: {user.totalEarned}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Created: {formatDate(user.createdAt)}</p>
                </div>
              ) : (
                <p className="text-gray-500">Loading user data...</p>
              )}
            </CardContent>
          </Card>

          {/* Stats Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Stats Table
              </CardTitle>
              <CardDescription>User statistics and progress</CardDescription>
            </CardHeader>
            <CardContent>
              {stats ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 bg-blue-50 rounded">
                      <p className="text-sm font-medium">Total Detections</p>
                      <p className="text-xl font-bold text-blue-600">{stats.totalDetections}</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <p className="text-sm font-medium">Coins Earned</p>
                      <p className="text-xl font-bold text-green-600">{stats.totalCoinsEarned}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Plastic: {stats.plasticItemsDetected}</div>
                    <div>Paper: {stats.paperItemsDetected}</div>
                    <div>Glass: {stats.glassItemsDetected}</div>
                    <div>Metal: {stats.metalItemsDetected}</div>
                  </div>
                  <p className="text-xs text-gray-400">Updated: {formatDate(stats.updatedAt)}</p>
                </div>
              ) : (
                <p className="text-gray-500">Loading stats...</p>
              )}
            </CardContent>
          </Card>

          {/* Detections Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Detections Table
              </CardTitle>
              <CardDescription>Recent AI detection results</CardDescription>
            </CardHeader>
            <CardContent>
              {detections && detections.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {detections.map((detection) => {
                    const objects = parseDetectedObjects(detection.detectedObjects);
                    return (
                      <div key={detection.id} className="p-3 border rounded-lg bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">Detection #{detection.id}</p>
                            <div className="flex gap-2 mt-1">
                              {objects.map((obj: any, idx: number) => (
                                <Badge key={idx} variant="secondary">
                                  {obj.name} ({obj.confidence}%)
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">+{detection.coinsEarned} coins</p>
                            <p className="text-sm text-gray-500">{detection.confidenceScore}% confidence</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">{formatDate(detection.createdAt)}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No detections yet...</p>
              )}
            </CardContent>
          </Card>

          {/* Achievements Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Achievements Table
              </CardTitle>
              <CardDescription>Unlocked achievements and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              {achievements && achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="p-3 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <p className="font-semibold">{achievement.title}</p>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      <p className="text-xs text-gray-400">Unlocked: {formatDate(achievement.unlockedAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No achievements unlocked yet...</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">
          Database updates automatically • Last refresh: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}