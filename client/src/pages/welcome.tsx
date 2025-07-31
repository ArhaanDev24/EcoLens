import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Welcome() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
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
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg overflow-hidden relative cursor-none"
      style={{ 
        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(0,196,140,0.08) 0%, transparent 50%), linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 50%, #1A1A1A 100%)`
      }}
    >
      {/* Custom Cursor */}
      <div 
        className="fixed w-6 h-6 pointer-events-none z-50 mix-blend-difference transition-all duration-300 ease-out"
        style={{
          left: `${mousePosition.x * 100}%`,
          top: `${mousePosition.y * 100}%`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 2 : 1})`,
        }}
      >
        <div className="w-full h-full bg-eco-green rounded-full animate-pulse shadow-lg shadow-eco-green/50" />
      </div>

      {/* Interactive Background Elements */}
      <div className="absolute inset-0">
        {/* Primary Gradient Orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-br from-eco-green/15 to-reward-yellow/15 rounded-full blur-3xl transition-all duration-[3000ms] ease-out"
          style={{
            top: `${-10 + mousePosition.y * 10}%`,
            right: `${-10 + mousePosition.x * 10}%`,
            transform: `scale(${1 + mousePosition.x * 0.2})`,
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-br from-reward-yellow/15 to-eco-green/15 rounded-full blur-3xl transition-all duration-[3000ms] ease-out"
          style={{
            bottom: `${-10 + (1 - mousePosition.y) * 10}%`,
            left: `${-10 + (1 - mousePosition.x) * 10}%`,
            transform: `scale(${1 + (1 - mousePosition.y) * 0.2})`,
          }}
        />
        
        {/* Dynamic Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${4 + (i % 3)}px`,
              height: `${4 + (i % 3)}px`,
              left: `${10 + (i * 3) % 80}%`,
              top: `${15 + (i * 2.5) % 70}%`,
              background: i % 2 === 0 ? 'rgba(0,196,140,0.4)' : 'rgba(255,213,0,0.4)',
              transform: `translate(${mousePosition.x * 20 - 10}px, ${mousePosition.y * 20 - 10}px) scale(${1 + Math.sin(Date.now() * 0.001 + i) * 0.3})`,
              animationDelay: `${i * 0.1}s`,
              boxShadow: `0 0 ${8 + (i % 4) * 2}px currentColor`,
            }}
          />
        ))}

        {/* Mesh Gradient Effect */}
        <div 
          className="absolute inset-0 opacity-30 transition-opacity duration-1000"
          style={{
            background: `conic-gradient(from ${mousePosition.x * 360}deg at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              transparent 0deg, 
              rgba(0,196,140,0.1) 90deg, 
              transparent 180deg, 
              rgba(255,213,0,0.1) 270deg, 
              transparent 360deg)`
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 backdrop-blur-sm">
        <div 
          className="flex items-center space-x-3 group cursor-pointer transition-all duration-500"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-eco-green to-reward-yellow rounded-xl flex items-center justify-center shadow-xl transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-eco-green/25 group-hover:scale-110" 
               style={{ 
                 animation: 'spin 12s linear infinite',
                 transform: `rotate(${mousePosition.x * 360}deg) scale(${isHovering ? 1.1 : 1})`
               }}>
            <span className="text-2xl transition-transform duration-300 group-hover:scale-110">🌿</span>
          </div>
          <div className="transition-all duration-300 group-hover:translate-x-1">
            <h1 className="text-2xl font-bold text-text-primary transition-all duration-300 group-hover:text-eco-green">EcoLens</h1>
            <p className="text-sm text-text-secondary transition-all duration-300 group-hover:text-text-primary">AI-Powered Recycling</p>
          </div>
        </div>
        
        <Link href="/home">
          <Button 
            className="bg-gradient-to-r from-eco-green to-eco-green/80 hover:from-eco-green/90 hover:to-eco-green/70 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-eco-green/25 relative overflow-hidden group"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-6 text-center"
      >
        <div className="mb-12 relative">
          <div className="relative group">
            {/* Main Hero Icon */}
            <div 
              className="w-40 h-40 bg-gradient-to-br from-eco-green via-eco-green to-reward-yellow rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transition-all duration-700 group-hover:shadow-4xl group-hover:shadow-eco-green/30 relative overflow-hidden"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 10 - 5}deg) rotateY(${mousePosition.x * 10 - 5}deg) scale(${isHovering ? 1.05 : 1})`,
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span 
                className="text-7xl transition-all duration-500 relative z-10"
                style={{
                  transform: `scale(${1 + Math.sin(Date.now() * 0.002) * 0.1})`,
                  filter: `drop-shadow(0 0 20px rgba(0,196,140,0.5))`
                }}
              >
                📸
              </span>
              
              {/* Animated Background Gradient */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-reward-yellow/20 via-transparent to-eco-green/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `conic-gradient(from ${Date.now() * 0.05}deg, rgba(0,196,140,0.2), rgba(255,213,0,0.2), rgba(0,196,140,0.2))`
                }}
              />
            </div>
            
            {/* Enhanced Orbiting Icons */}
            {[
              { emoji: '♻️', color: 'eco-green', delay: 0 },
              { emoji: '🌱', color: 'reward-yellow', delay: 0.25 },
              { emoji: '🪙', color: 'eco-green', delay: 0.5 },
              { emoji: '🌍', color: 'reward-yellow', delay: 0.75 }
            ].map((item, index) => (
              <div
                key={index}
                className="absolute w-14 h-14 backdrop-blur-md rounded-full flex items-center justify-center text-2xl border transition-all duration-700 hover:scale-125 cursor-pointer"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: `${100 + index * 15}px 0px`,
                  transform: `translate(-50%, -50%) rotate(${index * 90 + mousePosition.x * 60}deg) scale(${1 + Math.sin(Date.now() * 0.001 + index) * 0.1})`,
                  background: `rgba(${item.color === 'eco-green' ? '0,196,140' : '255,213,0'}, 0.15)`,
                  borderColor: `rgba(${item.color === 'eco-green' ? '0,196,140' : '255,213,0'}, 0.3)`,
                  boxShadow: `0 0 20px rgba(${item.color === 'eco-green' ? '0,196,140' : '255,213,0'}, 0.2)`,
                  animation: `spin ${15 + index * 3}s linear infinite reverse`,
                  animationDelay: `${item.delay}s`
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <span className="filter drop-shadow-lg">{item.emoji}</span>
              </div>
            ))}

            {/* Pulsing Rings */}
            {[1, 2, 3].map((ring) => (
              <div
                key={ring}
                className="absolute top-1/2 left-1/2 border border-eco-green/10 rounded-full pointer-events-none"
                style={{
                  width: `${200 + ring * 80}px`,
                  height: `${200 + ring * 80}px`,
                  transform: 'translate(-50%, -50%)',
                  animation: `pulse ${2 + ring * 0.5}s ease-in-out infinite`,
                  animationDelay: `${ring * 0.3}s`,
                  opacity: 0.6 - ring * 0.15
                }}
              />
            ))}
          </div>
        </div>

        <div className="mb-8 relative">
          <h2 
            className={`text-6xl md:text-7xl font-bold text-text-primary mb-6 leading-tight transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{
              background: `linear-gradient(135deg, #FFFFFF 0%, rgba(0,196,140,0.8) 30%, rgba(255,213,0,0.8) 70%, #FFFFFF 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(0,196,140,0.3)',
            }}
          >
            Turn{' '}
            <span 
              className="relative inline-block transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00C48C, #00A876)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Recycling
            </span>
            <br />
            into{' '}
            <span 
              className="relative inline-block transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #FFD500, #FFA000)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Rewards
            </span>
          </h2>

          <p className={`text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Use cutting-edge AI to identify recyclable items, earn Green Coins, and redeem real rewards while making a{' '}
            <span className="text-eco-green font-semibold">positive environmental impact</span>.
          </p>
        </div>

        <div className={`flex flex-col sm:flex-row gap-6 mb-16 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link href="/home">
            <Button 
              className="group bg-gradient-to-r from-eco-green via-eco-green to-reward-yellow hover:from-eco-green/90 hover:via-eco-green/80 hover:to-reward-yellow/90 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-4xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 relative overflow-hidden"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                background: `linear-gradient(135deg, #00C48C 0%, #00A876 50%, #FFD500 100%)`,
                boxShadow: `0 10px 40px rgba(0,196,140,0.4), 0 0 0 1px rgba(255,255,255,0.1)`,
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>Start Recycling Now</span>
                <span className="text-2xl transition-transform duration-300 group-hover:translate-x-1">🚀</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Button>
          </Link>
          
          <Link href="/wallet">
            <Button 
              variant="outline" 
              className="group border-2 border-eco-green/50 text-eco-green hover:bg-eco-green/10 hover:border-eco-green px-10 py-5 rounded-2xl text-xl font-bold backdrop-blur-sm transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                background: 'rgba(0,196,140,0.05)',
                boxShadow: '0 8px 32px rgba(0,196,140,0.1), inset 0 0 0 1px rgba(0,196,140,0.2)',
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>View Wallet</span>
                <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">💰</span>
              </span>
            </Button>
          </Link>
        </div>

        {/* Enhanced Feature Showcase */}
        <div 
          className={`relative max-w-lg mx-auto transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div 
            className="backdrop-blur-xl p-8 rounded-3xl border transition-all duration-700 relative overflow-hidden group hover:scale-105"
            style={{
              background: 'rgba(0,196,140,0.05)',
              borderColor: 'rgba(0,196,140,0.2)',
              boxShadow: '0 20px 60px rgba(0,196,140,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Animated Background */}
            <div 
              className="absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-50"
              style={{
                background: `conic-gradient(from ${currentFeature * 90}deg, rgba(0,196,140,0.1), rgba(255,213,0,0.1), rgba(0,196,140,0.1))`,
              }}
            />
            
            <div className="text-center relative z-10">
              <div 
                className="text-6xl mb-4 transition-all duration-500"
                style={{
                  transform: `scale(${1 + Math.sin(Date.now() * 0.002) * 0.1})`,
                  filter: 'drop-shadow(0 0 20px rgba(0,196,140,0.3))',
                }}
              >
                {features[currentFeature].icon}
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3 transition-all duration-300">
                {features[currentFeature].title}
              </h3>
              <p className="text-lg text-text-secondary leading-relaxed">
                {features[currentFeature].description}
              </p>
            </div>
            
            {/* Enhanced Feature Indicators */}
            <div className="flex justify-center space-x-3 mt-6 relative z-10">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 hover:scale-150 cursor-pointer ${
                    index === currentFeature 
                      ? 'bg-eco-green scale-125 shadow-lg shadow-eco-green/50' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  style={{
                    boxShadow: index === currentFeature ? '0 0 15px rgba(0,196,140,0.5)' : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className={`relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 px-6 mb-16 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group backdrop-blur-xl rounded-2xl text-center border transition-all duration-500 hover:scale-110 hover:-translate-y-2 cursor-pointer relative overflow-hidden"
            style={{
              background: 'rgba(0,196,140,0.05)',
              borderColor: 'rgba(0,196,140,0.15)',
              boxShadow: '0 8px 32px rgba(0,196,140,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
              animationDelay: `${index * 0.1}s`,
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-eco-green/10 via-transparent to-reward-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 p-6">
              <div 
                className="text-4xl mb-3 transition-all duration-300 group-hover:scale-125"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(0,196,140,0.3))',
                }}
              >
                {stat.icon}
              </div>
              <div 
                className="text-3xl font-bold mb-2 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #00C48C, #FFD500)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary font-medium transition-colors duration-300 group-hover:text-text-primary">
                {stat.label}
              </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                 style={{
                   boxShadow: '0 0 30px rgba(0,196,140,0.3), inset 0 0 30px rgba(0,196,140,0.1)'
                 }} />
          </div>
        ))}
      </div>

      {/* Enhanced Bottom CTA */}
      <div className={`relative z-10 text-center pb-16 px-6 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div 
          className="backdrop-blur-2xl rounded-3xl border max-w-2xl mx-auto relative overflow-hidden group"
          style={{
            background: 'rgba(0,196,140,0.08)',
            borderColor: 'rgba(0,196,140,0.2)',
            boxShadow: '0 25px 80px rgba(0,196,140,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Animated Background Pattern */}
          <div 
            className="absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-40"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(0,196,140,0.2) 0%, transparent 70%)`
            }}
          />
          
          <div className="relative z-10 p-10">
            <div className="mb-6">
              <span className="text-5xl block mb-4 animate-bounce">🌍</span>
              <h3 
                className="text-3xl font-bold mb-4 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF, #00C48C, #FFD500)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Ready to Make a Difference?
              </h3>
              <p className="text-xl text-text-secondary leading-relaxed max-w-md mx-auto">
                Join <span className="text-eco-green font-bold">thousands of users</span> making the planet greener, one recyclable at a time.
              </p>
            </div>
            
            <Link href="/home">
              <Button 
                className="group w-full bg-gradient-to-r from-eco-green via-eco-green/90 to-reward-yellow text-white font-bold py-6 rounded-2xl text-xl shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #00C48C 0%, #00A876 25%, #FFD500 75%, #FFA000 100%)',
                  boxShadow: '0 15px 60px rgba(0,196,140,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  <span>Start Your Eco Journey</span>
                  <span className="text-3xl transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110">🚀</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}