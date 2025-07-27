import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Mail, Coins, Calendar, LogIn, LogOut, Settings, Edit, Trophy, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EnhancedCard, EnhancedCardHeader, EnhancedCardContent } from "@/components/ui/enhanced-card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { LoadingCard } from "@/components/ui/enhanced-loading";
import { FadeIn, SlideIn, CountUp } from "@/components/ui/enhanced-animations";
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
      <div className="min-h-screen bg-dark-bg pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-eco-green/5 via-dark-bg to-emerald-900/5 opacity-60" />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <LoadingCard />
          <div className="mt-6">
            <LoadingCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-20 relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-eco-green/8 via-dark-bg to-purple-900/8" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-eco-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-reward-yellow/5 rounded-full blur-2xl animate-pulse animation-delay-1000" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8 4k:space-y-12 8k:space-y-16">
        {/* Ultimate Profile Hero Section */}
        <FadeIn>
          <div className="relative">
            <EnhancedCard variant="elevated" className="overflow-hidden bg-gradient-to-br from-eco-green/15 to-purple-500/10 border-2 border-eco-green/20">
              {/* Hero Background Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-eco-green/10 to-transparent animate-shimmer" />
              </div>
              
              <EnhancedCardContent className="relative z-10 p-8 4k:p-12 8k:p-16">
                <div className="text-center mb-8">
                  {/* Premium Avatar with Multiple Effects */}
                  <div className="flex justify-center mb-6">
                    <div className="relative group">
                      {/* Glow Ring Animation */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-eco-green via-reward-yellow to-eco-green rounded-full opacity-75 group-hover:opacity-100 animate-spin-slow blur-sm" />
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-eco-green to-purple-500 rounded-full opacity-50 animate-pulse blur-sm" />
                      
                      <Avatar className="relative w-40 h-40 4k:w-52 4k:h-52 8k:w-64 8k:h-64 border-4 border-white/20 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                        <AvatarImage src="" alt={user?.username} />
                        <AvatarFallback className="bg-gradient-to-br from-eco-green via-emerald-500 to-teal-500 text-white text-5xl 4k:text-6xl 8k:text-7xl font-bold">
                          {user?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Status Badge */}
                      <div className="absolute -top-3 -right-3 flex space-x-2">
                        <div className="w-10 h-10 4k:w-12 4k:h-12 8k:w-14 8k:h-14 bg-gradient-to-br from-reward-yellow to-amber-400 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                          <Star className="w-5 h-5 4k:w-6 4k:h-6 8k:w-7 8k:h-7 text-white" />
                        </div>
                        <div className="w-8 h-8 4k:w-10 4k:h-10 8k:w-12 8k:h-12 bg-gradient-to-br from-eco-green to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <Trophy className="w-4 h-4 4k:w-5 4k:h-5 8k:w-6 8k:h-6 text-white" />
                        </div>
                      </div>
                      
                      {/* Online Status */}
                      <div className="absolute bottom-2 right-2 w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 bg-green-400 rounded-full border-4 border-dark-surface animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Enhanced Typography */}
                  <div className="space-y-3">
                    <h1 className="text-4xl 4k:text-5xl 8k:text-6xl font-black bg-gradient-to-r from-eco-green via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                      {user?.username || "EcoChampion"}
                    </h1>
                    <div className="flex items-center justify-center space-x-2 text-text-secondary text-lg 4k:text-xl 8k:text-2xl">
                      <Calendar className="w-5 h-5" />
                      <span>Member since {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Status Tags */}
                    <div className="flex justify-center space-x-3 mt-4">
                      <div className="px-4 py-2 bg-eco-green/20 rounded-full border border-eco-green/30">
                        <span className="text-eco-green font-semibold text-sm">Active Recycler</span>
                      </div>
                      <div className="px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                        <span className="text-purple-400 font-semibold text-sm">Eco Champion</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Premium Stats Dashboard */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 4k:gap-6 8k:gap-8 mb-8">
                  <div className="group relative p-6 4k:p-8 8k:p-10 glassmorphic-intense rounded-3xl border border-white/10 hover:border-reward-yellow/30 transition-all duration-300 transform hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-reward-yellow/5 to-amber-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 4k:w-20 4k:h-20 8k:w-24 8k:h-24 mx-auto bg-gradient-to-br from-reward-yellow to-amber-400 rounded-2xl flex items-center justify-center mb-4 shadow-2xl group-hover:animate-pulse">
                        <Coins className="w-8 h-8 4k:w-10 4k:h-10 8k:w-12 8k:h-12 text-white" />
                      </div>
                      <div className="text-3xl 4k:text-4xl 8k:text-5xl font-black text-reward-yellow mb-1">
                        <CountUp end={user?.greenCoins || 0} duration={2000} />
                      </div>
                      <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary font-medium">Green Coins</div>
                    </div>
                  </div>
                  
                  <div className="group relative p-6 4k:p-8 8k:p-10 glassmorphic-intense rounded-3xl border border-white/10 hover:border-eco-green/30 transition-all duration-300 transform hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-eco-green/5 to-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 4k:w-20 4k:h-20 8k:w-24 8k:h-24 mx-auto bg-gradient-to-br from-eco-green to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-2xl group-hover:animate-pulse">
                        <Trophy className="w-8 h-8 4k:w-10 4k:h-10 8k:w-12 8k:h-12 text-white" />
                      </div>
                      <div className="text-3xl 4k:text-4xl 8k:text-5xl font-black text-eco-green mb-1">
                        <CountUp end={user?.totalEarned || 0} duration={2000} />
                      </div>
                      <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary font-medium">Total Earned</div>
                    </div>
                  </div>
                  
                  <div className="group relative p-6 4k:p-8 8k:p-10 glassmorphic-intense rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 transform hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 4k:w-20 4k:h-20 8k:w-24 8k:h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-2xl group-hover:animate-pulse">
                        <Star className="w-8 h-8 4k:w-10 4k:h-10 8k:w-12 8k:h-12 text-white" />
                      </div>
                      <div className="text-3xl 4k:text-4xl 8k:text-5xl font-black text-purple-400 mb-1">
                        <CountUp end={stats?.streakDays || 0} duration={2000} />
                      </div>
                      <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary font-medium">Day Streak</div>
                    </div>
                  </div>
                  
                  <div className="group relative p-6 4k:p-8 8k:p-10 glassmorphic-intense rounded-3xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300 transform hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 text-center">
                      <div className="w-16 h-16 4k:w-20 4k:h-20 8k:w-24 8k:h-24 mx-auto bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-2xl group-hover:animate-pulse">
                        <Award className="w-8 h-8 4k:w-10 4k:h-10 8k:w-12 8k:h-12 text-white" />
                      </div>
                      <div className="text-3xl 4k:text-4xl 8k:text-5xl font-black text-cyan-400 mb-1">
                        <CountUp end={stats?.totalDetections || 0} duration={2000} />
                      </div>
                      <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary font-medium">Detections</div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-center space-x-6 4k:space-x-8 8k:space-x-10">
                  <EnhancedButton
                    onClick={handleEditStart}
                    variant="primary"
                    size="xl"
                    icon={Edit}
                    className="px-8 py-4 text-lg font-bold shadow-2xl"
                  >
                    Edit Profile
                  </EnhancedButton>
                  <EnhancedButton
                    onClick={handleLogout}
                    variant="outline"
                    size="xl"
                    icon={LogOut}
                    className="px-8 py-4 text-lg font-bold"
                  >
                    Logout
                  </EnhancedButton>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>
        </FadeIn>

        {/* Enhanced Profile Information */}
        <SlideIn direction="up" delay={200}>
          <EnhancedCard variant="intense">
            <EnhancedCardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-eco-green to-emerald-500 rounded-2xl shadow-lg">
                    <User className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl 4k:text-3xl 8k:text-4xl font-bold text-text-primary">Profile Information</h2>
                    <p className="text-text-secondary">Manage your account details</p>
                  </div>
                </div>
                {!isEditing && (
                  <EnhancedButton
                    onClick={handleEditStart}
                    variant="ghost"
                    size="sm"
                    icon={Settings}
                  >
                    Edit
                  </EnhancedButton>
                )}
              </div>
            </EnhancedCardHeader>
            <EnhancedCardContent className="space-y-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-text-primary font-medium">Username</Label>
                    <Input
                      id="username"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="glassmorphic-intense border border-white/20 text-text-primary placeholder:text-text-secondary"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-text-primary font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="glassmorphic-intense border border-white/20 text-text-primary placeholder:text-text-secondary"
                    />
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <EnhancedButton
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                      variant="success"
                      size="lg"
                      loading={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </EnhancedButton>
                    <EnhancedButton
                      onClick={() => setIsEditing(false)}
                      variant="ghost"
                      size="lg"
                    >
                      Cancel
                    </EnhancedButton>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 glassmorphic-intense rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-eco-green/20 rounded-lg">
                        <User className="w-5 h-5 text-eco-green" />
                      </div>
                      <span className="text-text-secondary font-medium">Username</span>
                    </div>
                    <span className="font-bold text-text-primary text-lg">
                      {user?.username || "Not set"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 glassmorphic-intense rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-text-secondary font-medium">Email</span>
                    </div>
                    <span className="font-bold text-text-primary text-lg">
                      {user?.email || "Not set"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 glassmorphic-intense rounded-2xl border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="text-text-secondary font-medium">Member Since</span>
                    </div>
                    <span className="font-bold text-text-primary text-lg">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                    </span>
                  </div>
                </div>
              )}
            </EnhancedCardContent>
          </EnhancedCard>
        </SlideIn>

        {/* Enhanced Statistics Summary */}
        {stats && (
          <SlideIn direction="up" delay={400}>
            <EnhancedCard variant="intense">
              <EnhancedCardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                    <Trophy className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl 4k:text-3xl 8k:text-4xl font-bold text-text-primary">Account Statistics</h2>
                    <p className="text-text-secondary">Your recycling impact overview</p>
                  </div>
                </div>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 4k:gap-6 8k:gap-8">
                  <div className="text-center p-4 4k:p-6 8k:p-8 glassmorphic-intense rounded-2xl border border-white/10">
                    <div className="w-12 h-12 4k:w-16 4k:h-16 8k:w-20 8k:h-20 mx-auto bg-gradient-to-br from-eco-green to-emerald-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                      <Trophy className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
                    </div>
                    <div className="text-2xl 4k:text-3xl 8k:text-4xl font-bold text-eco-green">
                      <CountUp end={stats.totalDetections || 0} duration={1500} />
                    </div>
                    <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary">Total Detections</div>
                  </div>
                  
                  <div className="text-center p-4 4k:p-6 8k:p-8 glassmorphic-intense rounded-2xl border border-white/10">
                    <div className="w-12 h-12 4k:w-16 4k:h-16 8k:w-20 8k:h-20 mx-auto bg-gradient-to-br from-reward-yellow to-amber-400 rounded-full flex items-center justify-center mb-3 shadow-lg">
                      <Coins className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
                    </div>
                    <div className="text-2xl 4k:text-3xl 8k:text-4xl font-bold text-reward-yellow">
                      <CountUp end={stats.totalCoinsEarned || 0} duration={1500} />
                    </div>
                    <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary">Coins Earned</div>
                  </div>
                  
                  <div className="text-center p-4 4k:p-6 8k:p-8 glassmorphic-intense rounded-2xl border border-white/10">
                    <div className="w-12 h-12 4k:w-16 4k:h-16 8k:w-20 8k:h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                      <Star className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
                    </div>
                    <div className="text-2xl 4k:text-3xl 8k:text-4xl font-bold text-purple-400">
                      <CountUp end={stats.streakDays || 0} duration={1500} />
                    </div>
                    <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary">Day Streak</div>
                  </div>
                  
                  <div className="text-center p-4 4k:p-6 8k:p-8 glassmorphic-intense rounded-2xl border border-white/10">
                    <div className="w-12 h-12 4k:w-16 4k:h-16 8k:w-20 8k:h-20 mx-auto bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                      <Trophy className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
                    </div>
                    <div className="text-2xl 4k:text-3xl 8k:text-4xl font-bold text-cyan-400">
                      <CountUp 
                        end={((stats?.plasticItemsDetected || 0) + (stats?.paperItemsDetected || 0) + (stats?.glassItemsDetected || 0) + (stats?.metalItemsDetected || 0))} 
                        duration={1500} 
                      />
                    </div>
                    <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary">Items Recycled</div>
                  </div>
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </SlideIn>
        )}

        {/* Enhanced Quick Actions */}
        <SlideIn direction="up" delay={600}>
          <EnhancedCard variant="intense">
            <EnhancedCardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
                  <Settings className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl 4k:text-3xl 8k:text-4xl font-bold text-text-primary">Quick Actions</h2>
                  <p className="text-text-secondary">Manage your account and preferences</p>
                </div>
              </div>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 4k:gap-6 8k:gap-8">
                <EnhancedButton
                  onClick={handleLogin}
                  variant="primary"
                  size="lg"
                  icon={LogIn}
                  className="justify-start"
                >
                  Login with Different Account
                </EnhancedButton>
                <EnhancedButton
                  variant="outline"
                  size="lg"
                  icon={Settings}
                  className="justify-start"
                >
                  Account Settings
                </EnhancedButton>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </SlideIn>
      </div>
    </div>
  );
}