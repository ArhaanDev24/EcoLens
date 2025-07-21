import { useState, useEffect } from 'react';
import { useCamera } from '@/hooks/use-camera';
import { CameraViewfinder } from '@/components/ui/camera-viewfinder';
import { Button } from '@/components/ui/button';
import { GlassmorphicCard } from '@/components/ui/glassmorphic-card';

interface CameraPageProps {
  onCapture: (imageData: string) => void;
  greenCoins: number;
}

export function CameraPage({ onCapture, greenCoins }: CameraPageProps) {
  const { videoRef, canvasRef, isStreaming, startCamera, stopCamera, captureImage, error } = useCamera();
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleCapture = async () => {
    setIsCapturing(true);
    
    // Add ripple effect
    const captureBtn = document.getElementById('capture-btn');
    if (captureBtn) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      captureBtn.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    const imageData = captureImage();
    if (imageData) {
      setTimeout(() => {
        onCapture(imageData);
        setIsCapturing(false);
      }, 800);
    } else {
      setIsCapturing(false);
    }
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent('recycling center near me');
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassmorphicCard className="p-6 text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4" />
          <h2 className="text-lg font-medium mb-2">Camera Access Required</h2>
          <p className="text-sm text-text-secondary mb-4">{error}</p>
          <Button onClick={startCamera} variant="outline">
            Try Again
          </Button>
        </GlassmorphicCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">
      {/* Header */}
      <div className="flex justify-between items-center p-4 glassmorphic">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-eco-green rounded-full flex items-center justify-center">
            <i className="fas fa-leaf text-dark-bg text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">EcoLens</h1>
            <p className="text-xs text-text-secondary">AI Waste Recognition</p>
          </div>
        </div>
        
        {/* Coin Counter */}
        <div className="flex items-center space-x-2 bg-dark-surface-variant px-3 py-2 rounded-full">
          <i className="fas fa-coins text-reward-yellow text-sm" />
          <span className="text-reward-yellow font-medium">{greenCoins.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Camera Viewfinder */}
      <div className="flex-1 p-4">
        <CameraViewfinder ref={videoRef} isScanning={isStreaming && !isCapturing} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      
      {/* Bottom Controls */}
      <div className="p-6 flex justify-center items-center space-x-8 pb-24">
        {/* Gallery Button */}
        <Button variant="ghost" size="icon" className="w-12 h-12 bg-dark-surface-variant rounded-xl">
          <i className="fas fa-images text-text-secondary text-lg" />
        </Button>
        
        {/* Capture Button */}
        <Button
          id="capture-btn"
          onClick={handleCapture}
          disabled={!isStreaming || isCapturing}
          className="w-20 h-20 bg-eco-green rounded-full text-dark-bg text-2xl shadow-lg transform active:scale-95 transition-transform relative overflow-hidden hover:bg-eco-green"
        >
          <i className="fas fa-camera" />
        </Button>
        
        {/* Find Recycler Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={openGoogleMaps}
          className="w-12 h-12 bg-dark-surface-variant rounded-xl"
        >
          <i className="fas fa-map-marker-alt text-text-secondary text-lg" />
        </Button>
      </div>
    </div>
  );
}
