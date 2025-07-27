import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Mail, Coins, Calendar, LogIn, LogOut, Settings, Edit, Trophy, Star } from "lucide-react";
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
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-eco-green/5 via-dark-bg to-emerald-900/5 opacity-60" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8 4k:space-y-12 8k:space-y-16">
        {/* Enhanced Profile Header */}
        <FadeIn>
          <EnhancedCard variant="elevated" className="text-center bg-gradient-to-br from-eco-green/10 to-emerald-500/5">
            <EnhancedCardHeader className="pb-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 4k:w-40 4k:h-40 8k:w-48 8k:h-48 border-4 border-eco-green/30 shadow-2xl">
                    <AvatarImage src="" alt={user?.username} />
                    <AvatarFallback className="bg-gradient-to-br from-eco-green to-emerald-500 text-white text-4xl 4k:text-5xl 8k:text-6xl font-bold">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 w-8 h-8 4k:w-10 4k:h-10 8k:w-12 8k:h-12 bg-gradient-to-br from-reward-yellow to-amber-400 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-4 h-4 4k:w-5 4k:h-5 8k:w-6 8k:h-6 text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-3xl 4k:text-4xl 8k:text-5xl font-bold text-text-primary mb-2">
                {user?.username || "User"}
              </h1>
              <p className="text-text-secondary text-lg 4k:text-xl 8k:text-2xl">
                EcoLens Member since {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
              </p>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="flex justify-center space-x-6 4k:space-x-8 8k:space-x-10 mb-8">
                <div className="text-center p-4 4k:p-6 8k:p-8 glassmorphic-intense rounded-2xl border border-white/10">
                  <div className="w-12 h-12 4k:w-16 4k:h-16 8k:w-20 8k:h-20 mx-auto bg-gradient-to-br from-reward-yellow to-amber-400 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <Coins className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
                  </div>
                  <div className="text-2xl 4k:text-3xl 8k:text-4xl font-bold text-reward-yellow">
                    <CountUp end={user?.greenCoins || 0} duration={1500} />
                  </div>
                  <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary">Green Coins</div>
                </div>
                
                <div className="text-center p-4 4k:p-6 8k:p-8 glassmorphic-intense rounded-2xl border border-white/10">
                  <div className="w-12 h-12 4k:w-16 4k:h-16 8k:w-20 8k:h-20 mx-auto bg-gradient-to-br from-eco-green to-emerald-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <Trophy className="w-6 h-6 4k:w-8 4k:h-8 8k:w-10 8k:h-10 text-white" />
                  </div>
                  <div className="text-2xl 4k:text-3xl 8k:text-4xl font-bold text-eco-green">
                    <CountUp end={user?.totalEarned || 0} duration={1500} />
                  </div>
                  <div className="text-sm 4k:text-base 8k:text-lg text-text-secondary">Total Earned</div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 4k:space-x-6 8k:space-x-8">
                <EnhancedButton
                  onClick={handleEditStart}
                  variant="outline"
                  size="lg"
                  icon={Edit}
                >
                  Edit Profile
                </EnhancedButton>
                <EnhancedButton
                  onClick={handleLogout}
                  variant="danger"
                  size="lg"
                  icon={LogOut}
                >
                  Logout
                </EnhancedButton>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
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