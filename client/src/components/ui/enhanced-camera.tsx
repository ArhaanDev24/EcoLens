import { useState, useEffect } from 'react';
import { useCamera } from '@/hooks/use-camera';
import { Button } from '@/components/ui/button';
import { Camera, Focus, Maximize2, RotateCcw, ZapOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedCameraProps {
  onCapture: (imageData: string) => void;
  greenCoins: number;
  dailyScansUsed?: number;
  dailyScansLimit?: number;
}

export function EnhancedCamera({ onCapture, greenCoins, dailyScansUsed = 0, dailyScansLimit = 6 }: EnhancedCameraProps) {
  const { videoRef, canvasRef, isStreaming, startCamera, stopCamera, captureImage, error } = useCamera();
  const [isCapturing, setIsCapturing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = async () => {
    // Check daily limit before capturing
    if (dailyScansUsed >= dailyScansLimit) {
      return;
    }
    
    setIsCapturing(true);
    
    // Enhanced capture animation
    const viewfinder = document.querySelector('.camera-viewfinder');
    if (viewfinder) {
      const flash = document.createElement('div');
      flash.className = 'camera-flash';
      viewfinder.appendChild(flash);
      
      // Add detection pulse effect
      const pulse = document.createElement('div');
      pulse.className = 'detection-pulse';
      viewfinder.appendChild(pulse);
      
      setTimeout(() => {
        flash.remove();
        pulse.remove();
      }, 1000);
    }

    const imageData = captureImage();
    if (imageData) {
      // Add coin particles animation
      createCoinParticles();
      
      setTimeout(() => {
        onCapture(imageData);
        setIsCapturing(false);
      }, 1000);
    } else {
      setIsCapturing(false);
    }
  };

  const createCoinParticles = () => {
    const container = document.querySelector('.camera-container');
    if (!container) return;

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'coin-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${i * 0.1}s`;
      container.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1200);
    }
  };

  const handleDemoMode = () => {
    // Create a demo image data (placeholder for demo purposes)
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, 400, 300);
      ctx.fillStyle = '#00C48C';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Demo Plastic Bottle', 200, 150);
      const demoImageData = canvas.toDataURL('image/jpeg', 0.8);
      onCapture(demoImageData);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glassmorphic p-8 text-center max-w-md fade-in-scale">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-text-primary">Camera Access Required</h2>
          <p className="text-sm text-text-secondary mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={startCamera} className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={handleDemoMode}
              variant="outline"
              className="w-full border-eco-green text-eco-green hover:bg-eco-green/10"
            >
              Try Demo Mode
            </Button>
          </div>
          <p className="text-xs text-text-secondary mt-4">
            Enable camera permissions to scan real items, or use demo mode to test the enhanced reward system
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col camera-container">
      {/* Enhanced Header */}
      <div className="glassmorphic-intense p-4 slide-in-up">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-eco-green/20 rounded-full flex items-center justify-center floating-animation">
              <Camera className="w-6 h-6 text-eco-green" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">EcoLens Scanner</h2>
              <p className="text-sm text-text-secondary">Detect recyclable items</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Daily Scan Counter */}
            <div className="text-right">
              <p className="text-xs text-text-secondary">Daily Scans</p>
              <p className={`text-sm font-bold ${
                dailyScansUsed >= dailyScansLimit ? 'text-red-400' : 
                dailyScansUsed >= dailyScansLimit - 1 ? 'text-yellow-400' : 
                'text-eco-green'
              }`}>
                {dailyScansUsed}/{dailyScansLimit}
              </p>
            </div>
            
            {/* Green Coins */}
            <div className="text-right">
              <p className="text-sm text-text-secondary">Green Coins</p>
              <p className="text-xl font-bold text-reward-yellow">{greenCoins}</p>
            </div>
            <div className="w-8 h-8 bg-reward-yellow/20 rounded-full flex items-center justify-center">
              <span className="text-reward-yellow text-lg">🪙</span>
            </div>
          </div>
        </div>
        
        {/* Daily Limit Warning */}
        {dailyScansUsed >= dailyScansLimit && (
          <div className="mx-4 mt-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm font-medium text-center">
              ⚠️ Daily scan limit reached! Come back tomorrow to continue recycling.
            </p>
          </div>
        )}
        
        {dailyScansUsed === dailyScansLimit - 1 && (
          <div className="mx-4 mt-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm font-medium text-center">
              ⚡ One scan remaining today! Make it count!
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Camera Viewfinder */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="relative flex-1 min-h-[400px] rounded-3xl overflow-hidden camera-viewfinder fade-in-scale bg-black border-2 border-eco-green/30">
          {/* Video Stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Enhanced Scan Line */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="scan-line" />
          </div>
          
          {/* Camera Grid */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-white/10" />
                ))}
              </div>
            </div>
          )}
          
          {/* Focus Points */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-6 left-6 w-6 h-6">
              <Focus className="w-full h-full text-eco-green/80 animate-pulse" />
            </div>
            <div className="absolute top-6 right-6 w-6 h-6">
              <Focus className="w-full h-full text-eco-green/80 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute bottom-6 left-6 w-6 h-6">
              <Focus className="w-full h-full text-eco-green/80 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <div className="absolute bottom-6 right-6 w-6 h-6">
              <Focus className="w-full h-full text-eco-green/80 animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>
        </div>

        {/* Enhanced Camera Controls */}
        <div className="mt-4 pb-24 slide-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-center items-center space-x-4 mb-4">
            {/* Settings */}
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowGrid(!showGrid)}
                className={cn(
                  "glassmorphic w-12 h-12 rounded-full",
                  showGrid && "bg-eco-green/20 text-eco-green"
                )}
              >
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Main Capture Button */}
            <Button
              onClick={handleCapture}
              disabled={!isStreaming || isCapturing || dailyScansUsed >= dailyScansLimit}
              className={cn(
                "w-20 h-20 rounded-full bg-eco-green hover:bg-eco-green/90 text-white shadow-lg",
                "disabled:opacity-50 transition-all duration-300",
                "hover:shadow-eco-green/50 hover:shadow-2xl hover:scale-105",
                isCapturing && "animate-pulse",
                dailyScansUsed >= dailyScansLimit && "bg-gray-500 cursor-not-allowed"
              )}
              id="capture-btn"
            >
              {isCapturing ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-8 h-8" />
              )}
            </Button>

            {/* Additional Controls */}
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={startCamera}
                className="glassmorphic w-12 h-12 rounded-full"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="glassmorphic w-12 h-12 rounded-full"
              >
                <ZapOff className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isStreaming ? "bg-eco-green animate-pulse" : "bg-red-500"
              )} />
              <span className="text-sm text-text-secondary">
                {dailyScansUsed >= dailyScansLimit ? "Daily Limit Reached" :
                 isStreaming ? "Camera Active" : "Connecting..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}