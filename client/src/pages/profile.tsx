import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Mail, Coins, Calendar, LogIn, LogOut, Settings, Edit, Trophy, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { LoadingCard } from "@/components/ui/enhanced-loading";
import { FadeIn, SlideIn, CountUp } from "@/components/ui/enhanced-animations";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  email: string;
  greenCoins: number;
  createdAt: string;
}

interface UserStats {
  totalDetections: number;
  streakDays: number;
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
  });
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/user/1/stats"],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { username: string; email: string }) => {
      return await apiRequest("PATCH", `/api/user/${user?.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsEditing(false);
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
        username: user.username || "",
        email: user.email || "",
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleLogout = () => {
    // Logout functionality would go here
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (isLoading) {
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
      {/* Dark Theme Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-eco-green/5 via-dark-bg to-purple-900/5" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-eco-green/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>
      
      <div className="relative z-10 container-responsive py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
        {/* Dark Theme Profile Hero Section */}
        <FadeIn>
          <div className="bg-dark-surface/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 padding-responsive">
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              {/* Avatar */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="relative">
                  <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 2xl:w-40 2xl:h-40 border-2 sm:border-4 border-eco-green/50 shadow-2xl">
                    <AvatarImage src="" alt={user?.username} />
                    <AvatarFallback className="bg-gradient-to-br from-eco-green to-emerald-500 text-white text-responsive-base font-bold">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Status Badges */}
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-reward-yellow to-amber-400 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="icon-responsive-sm text-white" />
                  </div>
                  
                  {/* Online Status */}
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-green-400 rounded-full border-2 sm:border-4 border-dark-surface animate-pulse" />
                </div>
              </div>
              
              {/* User Info */}
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-responsive-lg font-bold text-white mb-1 sm:mb-2">
                  {user?.username || "EcoChampion"}
                </h1>
                <div className="flex items-center justify-center space-x-2 text-gray-300 text-responsive-xs">
                  <Calendar className="icon-responsive-sm text-gray-400" />
                  <span>Member since {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                
                {/* Status Tags */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <div className="px-3 py-1 sm:px-4 sm:py-2 bg-eco-green/20 rounded-full border border-eco-green/40">
                    <span className="text-eco-green font-semibold text-xs sm:text-sm">Active Recycler</span>
                  </div>
                  <div className="px-3 py-1 sm:px-4 sm:py-2 bg-purple-500/20 rounded-full border border-purple-500/40">
                    <span className="text-purple-300 font-semibold text-xs sm:text-sm">Eco Champion</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-responsive mb-4 sm:mb-6 md:mb-8">
              <div className="bg-dark-surface/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 padding-responsive-sm text-center hover:scale-105 transition-transform duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mx-auto bg-gradient-to-br from-reward-yellow to-amber-400 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <Coins className="icon-responsive-sm text-white" />
                </div>
                <div className="text-responsive-sm font-bold text-reward-yellow mb-1">
                  <CountUp end={user?.greenCoins || 0} duration={1500} />
                </div>
                <div className="text-responsive-xs text-gray-300 font-medium">Green Coins</div>
              </div>
              
              <div className="bg-dark-surface/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 padding-responsive-sm text-center hover:scale-105 transition-transform duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mx-auto bg-gradient-to-br from-eco-green to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <Trophy className="icon-responsive-sm text-white" />
                </div>
                <div className="text-responsive-sm font-bold text-eco-green mb-1">87</div>
                <div className="text-responsive-xs text-gray-300 font-medium">Total Earned</div>
              </div>
              
              <div className="bg-dark-surface/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 padding-responsive-sm text-center hover:scale-105 transition-transform duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <Star className="icon-responsive-sm text-white" />
                </div>
                <div className="text-responsive-sm font-bold text-purple-400 mb-1">0</div>
                <div className="text-responsive-xs text-gray-300 font-medium">Day Streak</div>
              </div>
              
              <div className="bg-dark-surface/60 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 padding-responsive-sm text-center hover:scale-105 transition-transform duration-300">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mx-auto bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <Award className="icon-responsive-sm text-white" />
                </div>
                <div className="text-responsive-sm font-bold text-cyan-400 mb-1">0</div>
                <div className="text-responsive-xs text-gray-300 font-medium">Detections</div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <EnhancedButton
                onClick={handleEditStart}
                variant="primary"
                size="lg"
                icon={Edit}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </EnhancedButton>
              <EnhancedButton
                onClick={handleLogout}
                variant="outline"
                size="lg"
                icon={LogOut}
                className="w-full sm:w-auto"
              >
                Logout
              </EnhancedButton>
            </div>
          </div>
        </FadeIn>
        
        {/* Profile Information Card */}
        <FadeIn>
          <div className="bg-dark-surface/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 padding-responsive">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-eco-green/20 to-emerald-500/20 rounded-xl sm:rounded-2xl border border-eco-green/30">
                  <User className="icon-responsive-sm text-eco-green" />
                </div>
                <div>
                  <h2 className="text-responsive-base font-bold text-white">Profile Information</h2>
                  <p className="text-responsive-xs text-gray-300">Manage your account details</p>
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
            
            {isEditing ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="username" className="text-white font-medium text-responsive-xs">Username</Label>
                  <Input
                    id="username"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="bg-dark-surface/50 border border-white/20 text-white placeholder:text-gray-400 text-responsive-xs"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="email" className="text-white font-medium text-responsive-xs">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="bg-dark-surface/50 border border-white/20 text-white placeholder:text-gray-400 text-responsive-xs"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <EnhancedButton
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    variant="success"
                    size="lg"
                    loading={updateProfileMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </EnhancedButton>
                  <EnhancedButton
                    onClick={() => setIsEditing(false)}
                    variant="ghost"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </EnhancedButton>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-dark-surface/50 rounded-xl sm:rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div className="p-2 bg-eco-green/20 rounded-lg">
                      <User className="icon-responsive-sm text-eco-green" />
                    </div>
                    <span className="text-gray-300 font-medium text-responsive-xs">Username</span>
                  </div>
                  <span className="font-bold text-white text-responsive-xs ml-9 sm:ml-0">
                    {user?.username || "Not set"}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-dark-surface/50 rounded-xl sm:rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Mail className="icon-responsive-sm text-blue-400" />
                    </div>
                    <span className="text-gray-300 font-medium text-responsive-xs">Email</span>
                  </div>
                  <span className="font-bold text-white text-responsive-xs ml-9 sm:ml-0 break-all">
                    {user?.email || "Not set"}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-dark-surface/50 rounded-xl sm:rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Calendar className="icon-responsive-sm text-purple-400" />
                    </div>
                    <span className="text-gray-300 font-medium text-responsive-xs">Member Since</span>
                  </div>
                  <span className="font-bold text-white text-responsive-xs ml-9 sm:ml-0">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </FadeIn>
        
        {/* Login Card for non-authenticated users */}
        {!user && (
          <FadeIn>
            <div className="bg-dark-surface/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 padding-responsive text-center">
              <div className="space-y-4 sm:space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-eco-green/20 to-emerald-500/20 rounded-full flex items-center justify-center border border-eco-green/30">
                  <LogIn className="icon-responsive text-eco-green" />
                </div>
                <div>
                  <h2 className="text-responsive-base font-bold text-white mb-2">Login Required</h2>
                  <p className="text-gray-300 text-responsive-xs">Please login to view your profile</p>
                </div>
                <EnhancedButton
                  variant="primary"
                  size="lg"
                  icon={LogIn}
                  className="w-full sm:w-auto mx-auto"
                >
                  Login Now
                </EnhancedButton>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}