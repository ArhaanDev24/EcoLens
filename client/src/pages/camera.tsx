import { useState, useEffect } from 'react';
import { useCamera } from '@/hooks/use-camera';
import { CameraViewfinder } from '@/components/ui/camera-viewfinder';
import { Button } from '@/components/ui/button';
import { GlassmorphicCard } from '@/components/ui/glassmorphic-card';
import { DemoBanner } from '@/components/ui/demo-banner';

interface CameraPageProps {
  onCapture: (imageData: string) => void;
  greenCoins: number;
}

function CameraPage({ onCapture, greenCoins }: CameraPageProps) {
  const { videoRef, canvasRef, isStreaming, startCamera, stopCamera, captureImage, error, facingMode, switchCamera } = useCamera();
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
    <div className="min-h-screen flex flex-col bg-dark-bg relative">
      {/* Demo Banner */}
      <DemoBanner />
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 glassmorphic">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-eco-green rounded-full flex items-center justify-center p-1">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 8C17.5 8 12 13.5 12 20C12 26.5 17.5 32 24 32C30.5 32 36 26.5 36 20C36 13.5 30.5 8 24 8Z" fill="#1A1A1A"/>
              <circle cx="24" cy="20" r="6" fill="none" stroke="#00C48C" strokeWidth="1.5"/>
              <circle cx="24" cy="20" r="2" fill="#00C48C"/>
              <path d="M20 34L24 38L28 34" stroke="#FFD500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">EcoLens</h1>
            <p className="text-xs text-text-secondary">AI Waste Recognition</p>
          </div>
        </div>
        
        {/* Coin Counter */}
        <div className="flex items-center space-x-2 bg-dark-surface-variant px-3 py-2 rounded-full">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" fill="#FFD500" stroke="#FFA000" strokeWidth="1"/>
            <circle cx="12" cy="12" r="6" fill="none" stroke="#FFA000" strokeWidth="1"/>
            <text x="12" y="16" textAnchor="middle" fill="#1A1A1A" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="bold">ECO</text>
          </svg>
          <span className="text-reward-yellow font-medium">{greenCoins.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Camera Viewfinder */}
      <div className="flex-1 p-4">
        <CameraViewfinder ref={videoRef} isScanning={isStreaming && !isCapturing} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      
      {/* Camera Flip Button - Floating */}
      <div className="absolute top-20 right-4 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={switchCamera}
          disabled={!isStreaming}
          className="w-12 h-12 bg-dark-surface-variant/80 backdrop-blur-md rounded-xl border border-white/10 hover:bg-dark-surface-variant/90 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 12l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
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
          className="w-20 h-20 bg-eco-green rounded-full text-dark-bg shadow-lg transform active:scale-95 transition-transform relative overflow-hidden hover:bg-eco-green flex items-center justify-center"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="8" width="20" height="12" rx="3" fill="currentColor"/>
            <circle cx="12" cy="14" r="4" fill="none" stroke="#00C48C" strokeWidth="2"/>
            <circle cx="12" cy="14" r="2" fill="#00C48C"/>
            <rect x="16" y="6" width="2" height="2" rx="1" fill="currentColor"/>
            <path d="M8 8V6C8 5.45 8.45 5 9 5H15C15.55 5 16 6 16 6V8" fill="currentColor"/>
          </svg>
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

export default CameraPage;
