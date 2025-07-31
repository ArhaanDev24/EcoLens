import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

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
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-eco-green/10 to-reward-yellow/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 80,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-reward-yellow/10 to-eco-green/10 rounded-full blur-3xl"
        />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-eco-green/30 rounded-full"
            animate={{
              y: [-100, -1000],
              x: [0, Math.sin(i) * 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${10 + (i * 4) % 80}%`,
              top: '100%',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex justify-between items-center p-6"
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 bg-gradient-to-br from-eco-green to-reward-yellow rounded-xl flex items-center justify-center shadow-xl"
          >
            <span className="text-2xl">🌿</span>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">EcoLens</h1>
            <p className="text-sm text-text-secondary">AI-Powered Recycling</p>
          </div>
        </div>
        
        <Link href="/camera">
          <Button className="bg-eco-green hover:bg-eco-green/90 text-white px-6 py-2 rounded-xl shadow-lg">
            Get Started
          </Button>
        </Link>
      </motion.header>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(0, 196, 140, 0.3)",
                  "0 0 40px rgba(0, 196, 140, 0.6)",
                  "0 0 20px rgba(0, 196, 140, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 bg-gradient-to-br from-eco-green to-reward-yellow rounded-3xl flex items-center justify-center mx-auto mb-6"
            >
              <span className="text-6xl">📸</span>
            </motion.div>
            
            {/* Orbiting Icons */}
            {['♻️', '🌱', '🪙', '🌍'].map((emoji, index) => (
              <motion.div
                key={index}
                className="absolute w-12 h-12 bg-dark-surface-variant/80 rounded-full flex items-center justify-center text-xl backdrop-blur-sm border border-eco-green/20"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 0.5,
                }}
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: `${80 + index * 10}px 0px`,
                  transform: `translate(-50%, -50%) rotate(${index * 90}deg)`,
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-5xl font-bold text-text-primary mb-4 leading-tight"
        >
          Turn <span className="text-eco-green">Recycling</span> into
          <br />
          <span className="text-reward-yellow">Rewards</span>
        </motion.h2>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-xl text-text-secondary mb-8 max-w-2xl leading-relaxed"
        >
          Use AI to identify recyclable items, earn Green Coins, and redeem real rewards while making a positive environmental impact.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <Link href="/camera">
            <Button className="bg-gradient-to-r from-eco-green to-eco-green/80 hover:from-eco-green/90 hover:to-eco-green/70 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Start Recycling Now
            </Button>
          </Link>
          <Link href="/wallet">
            <Button variant="outline" className="border-2 border-eco-green text-eco-green hover:bg-eco-green/10 px-8 py-4 rounded-2xl text-lg font-semibold">
              View Wallet
            </Button>
          </Link>
        </motion.div>

        {/* Feature Showcase */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="glassmorphic p-6 rounded-3xl border border-eco-green/20 max-w-md mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl mb-3">{features[currentFeature].icon}</div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {features[currentFeature].title}
              </h3>
              <p className="text-text-secondary">
                {features[currentFeature].description}
              </p>
            </motion.div>
          </AnimatePresence>
          
          {/* Feature Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {features.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentFeature ? 'bg-eco-green' : 'bg-gray-600'
                }`}
                animate={{
                  scale: index === currentFeature ? 1.2 : 1,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 px-6 mb-12"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="glassmorphic p-4 rounded-2xl text-center border border-eco-green/20"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
              className="text-2xl font-bold text-eco-green mb-1"
            >
              {stat.value}
            </motion.div>
            <div className="text-sm text-text-secondary">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.7 }}
        className="relative z-10 text-center pb-12 px-6"
      >
        <div className="glassmorphic p-8 rounded-3xl border border-eco-green/20 max-w-lg mx-auto">
          <h3 className="text-2xl font-bold text-text-primary mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-text-secondary mb-6">
            Join thousands of users making the planet greener, one recyclable at a time.
          </p>
          <Link href="/camera">
            <Button className="w-full bg-gradient-to-r from-eco-green to-reward-yellow text-dark-bg font-bold py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Start Your Eco Journey
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}