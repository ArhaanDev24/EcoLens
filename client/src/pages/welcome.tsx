import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Welcome() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "🔍",
      title: "AI Detection",
      description: "Advanced AI identifies recyclable items instantly"
    },
    {
      icon: "🪙",
      title: "Earn Rewards",
      description: "Get Green Coins for every item you recycle"
    },
    {
      icon: "📱",
      title: "QR Redemption",
      description: "Convert coins to real rewards at partner stores"
    },
    {
      icon: "🌱",
      title: "Track Impact",
      description: "See your environmental contribution grow"
    }
  ];

  const stats = [
    { value: "50K+", label: "Items Detected", icon: "♻️" },
    { value: "2.5M", label: "Coins Earned", icon: "🪙" },
    { value: "15K", label: "Trees Saved", icon: "🌳" },
    { value: "98%", label: "Accuracy Rate", icon: "🎯" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-eco-green/10 to-reward-yellow/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-reward-yellow/10 to-eco-green/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-eco-green/30 rounded-full animate-bounce"
            style={{
              left: `${10 + (i * 4) % 80}%`,
              top: `${20 + (i * 2) % 60}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + i * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-eco-green to-reward-yellow rounded-xl flex items-center justify-center shadow-xl animate-spin" style={{ animationDuration: '8s' }}>
            <span className="text-2xl">🌿</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">EcoLens</h1>
            <p className="text-sm text-text-secondary">AI-Powered Recycling</p>
          </div>
        </div>
        
        <Link href="/home">
          <Button className="bg-eco-green hover:bg-eco-green/90 text-white px-6 py-2 rounded-xl shadow-lg">
            Get Started
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-eco-green to-reward-yellow rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-6xl">📸</span>
            </div>
            
            {/* Orbiting Icons */}
            {['♻️', '🌱', '🪙', '🌍'].map((emoji, index) => (
              <div
                key={index}
                className="absolute w-12 h-12 bg-dark-surface-variant/80 rounded-full flex items-center justify-center text-xl backdrop-blur-sm border border-eco-green/20 animate-spin"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: `${80 + index * 10}px 0px`,
                  transform: `translate(-50%, -50%) rotate(${index * 90}deg)`,
                  animationDuration: `${10 + index * 2}s`,
                  animationDelay: `${index * 0.5}s`
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        <h2 className={`text-5xl font-bold text-text-primary mb-4 leading-tight transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          Turn <span className="text-eco-green">Recycling</span> into
          <br />
          <span className="text-reward-yellow">Rewards</span>
        </h2>

        <p className={`text-xl text-text-secondary mb-8 max-w-2xl leading-relaxed transition-opacity duration-1000 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          Use AI to identify recyclable items, earn Green Coins, and redeem real rewards while making a positive environmental impact.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 mb-12 transition-opacity duration-1000 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Link href="/home">
            <Button className="bg-gradient-to-r from-eco-green to-eco-green/80 hover:from-eco-green/90 hover:to-eco-green/70 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Start Recycling Now
            </Button>
          </Link>
          <Link href="/wallet">
            <Button variant="outline" className="border-2 border-eco-green text-eco-green hover:bg-eco-green/10 px-8 py-4 rounded-2xl text-lg font-semibold">
              View Wallet
            </Button>
          </Link>
        </div>

        {/* Feature Showcase */}
        <div className={`glassmorphic p-6 rounded-3xl border border-eco-green/20 max-w-md mx-auto transition-opacity duration-1000 delay-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-center">
            <div className="text-4xl mb-3">{features[currentFeature].icon}</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              {features[currentFeature].title}
            </h3>
            <p className="text-text-secondary">
              {features[currentFeature].description}
            </p>
          </div>
          
          {/* Feature Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {features.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentFeature ? 'bg-eco-green scale-125' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 px-6 mb-12 transition-opacity duration-1000 delay-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glassmorphic p-4 rounded-2xl text-center border border-eco-green/20 hover:scale-105 transition-transform duration-300"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-eco-green mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className={`relative z-10 text-center pb-12 px-6 transition-opacity duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="glassmorphic p-8 rounded-3xl border border-eco-green/20 max-w-lg mx-auto">
          <h3 className="text-2xl font-bold text-text-primary mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-text-secondary mb-6">
            Join thousands of users making the planet greener, one recyclable at a time.
          </p>
          <Link href="/home">
            <Button className="w-full bg-gradient-to-r from-eco-green to-reward-yellow text-dark-bg font-bold py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Start Your Eco Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}