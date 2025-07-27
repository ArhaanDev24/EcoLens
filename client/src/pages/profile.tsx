import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Mail, Coins, Calendar, LogIn, LogOut, Settings, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  greenCoins: number;
  totalEarned: number;
  createdAt: string;
}

interface UserStats {
  totalDetections?: number;
  totalCoinsEarned?: number;
  streakDays?: number;
  plasticItemsDetected?: number;
  paperItemsDetected?: number;
  glassItemsDetected?: number;
  metalItemsDetected?: number;
}

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: ""
  });

  const { data: user, isLoading: userLoading } = useQuery<UserProfile>({
    queryKey: ["/api/user"],
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/stats"],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { username: string; email: string }) => {
      return await apiRequest("/api/user", "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditStart = () => {
    if (user) {
      setEditForm({
        username: user.username,
        email: user.email
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleLogin = () => {
    // Placeholder for login functionality
    toast({
      title: "Login Feature",
      description: "Login functionality will be implemented soon!",
    });
  };

  const handleLogout = () => {
    // Placeholder for logout functionality
    toast({
      title: "Logout Feature",
      description: "Logout functionality will be implemented soon!",
    });
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-3xl"></div>
            <div className="h-64 bg-white/20 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 pb-20">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Profile Header */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24 border-4 border-green-200 dark:border-green-700">
                <AvatarImage src="" alt={user?.username} />
                <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-500 text-white text-2xl font-bold">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
              {user?.username || "User"}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              EcoLens Member since {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-4 mb-6">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 px-4 py-2">
                <Coins className="w-4 h-4 mr-2" />
                {user?.greenCoins || 0} Coins
              </Badge>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                {user?.totalEarned || 0} Total Earned
              </Badge>
            </div>
            <div className="flex justify-center space-x-2">
              <Button
                onClick={handleEditStart}
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800 dark:text-white">
              <User className="w-5 h-5 mr-2 text-green-600" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="bg-white/50 dark:bg-gray-700/50"
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">Username</span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {user?.username || "Not set"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">Email</span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {user?.email || "Not set"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">Member Since</span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Summary */}
        {stats && (
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800 dark:text-white">
                <Settings className="w-5 h-5 mr-2 text-green-600" />
                Account Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{stats.totalDetections || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Detections</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-emerald-600">{stats.totalCoinsEarned || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Coins Earned</div>
                </div>
                <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-teal-600">{stats.streakDays || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Day Streak</div>
                </div>
                <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-cyan-600">
                    {((stats?.plasticItemsDetected || 0) + (stats?.paperItemsDetected || 0) + (stats?.glassItemsDetected || 0) + (stats?.metalItemsDetected || 0))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Items Recycled</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={handleLogin}
                className="bg-green-600 hover:bg-green-700 text-white justify-start"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login with Different Account
              </Button>
              <Button
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20 justify-start"
              >
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}