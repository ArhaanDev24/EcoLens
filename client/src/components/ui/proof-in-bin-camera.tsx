import { useState, useEffect } from 'react';
import { useCamera } from '@/hooks/use-camera';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, AlertTriangle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProofInBinCameraProps {
  onBinPhotoCapture: (imageData: string) => void;
  detectedItem: string;
  isProcessing: boolean;
  onCancel: () => void;
}

export function ProofInBinCamera({ 
  onBinPhotoCapture, 
  detectedItem, 
  isProcessing, 
  onCancel 
}: ProofInBinCameraProps) {
  const { videoRef, canvasRef, isStreaming, startCamera, stopCamera, captureImage, error } = useCamera();
  const [isCapturing, setIsCapturing] = useState(false);
  const [instructionStep, setInstructionStep] = useState(0);

  const instructions = [
    "Find a recycling bin for your item",
    "Hold your item above the bin opening",
    "Take a clear photo of the item going into the bin",
    "Make sure both the item and bin interior are visible"
  ];

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Auto-advance instructions
  useEffect(() => {
    const timer = setInterval(() => {
      setInstructionStep((prev) => (prev + 1) % instructions.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [instructions.length]);

  const handleBinPhotoCapture = async () => {
    setIsCapturing(true);
    
    // Capture animation
    const viewfinder = document.querySelector('.bin-camera-viewfinder');
    if (viewfinder) {
      const flash = document.createElement('div');
      flash.className = 'camera-flash';
      viewfinder.appendChild(flash);
      
      setTimeout(() => {
        flash.remove();
      }, 1000);
    }

    const imageData = captureImage();
    if (imageData) {
      setTimeout(() => {
        onBinPhotoCapture(imageData);
        setIsCapturing(false);
      }, 1000);
    } else {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark-bg/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-eco-green/20 to-reward-yellow/20 border-b border-eco-green/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">Proof-in-Bin Check</h2>
            <p className="text-text-secondary">Show your {detectedItem} going into the recycling bin</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={onCancel}
            className="text-text-secondary hover:text-text-primary"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-amber-400 font-bold text-sm">{instructionStep + 1}</span>
          </div>
          <p className="text-amber-100 font-medium text-sm">
            {instructions[instructionStep]}
          </p>
        </div>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-3">
          {instructions.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === instructionStep ? "bg-amber-400" : "bg-amber-400/30"
              )}
            />
          ))}
        </div>
      </div>

      {/* Camera Viewfinder */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="relative flex-1 min-h-[400px] rounded-3xl overflow-hidden bin-camera-viewfinder bg-black border-2 border-eco-green/30">
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
          
          {/* Overlay guides */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Target area for bin */}
            <div className="absolute inset-x-8 top-1/4 bottom-1/4 border-2 border-dashed border-eco-green/60 rounded-2xl">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-eco-green/20 px-3 py-1 rounded-lg">
                <span className="text-eco-green text-xs font-medium">Position item and bin here</span>
              </div>
            </div>
            
            {/* Anti-fraud warnings */}
            <div className="absolute bottom-4 left-4 right-4 bg-red-500/20 border border-red-500/40 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-100 text-xs font-medium">
                  Must be same item from previous scan - AI fraud detection active
                </span>
              </div>
            </div>
          </div>

          {/* Security indicators */}
          <div className="absolute top-4 right-4 space-y-2">
            <div className="bg-red-500/20 border border-red-500/40 rounded-lg px-3 py-1">
              <span className="text-red-100 text-xs font-bold">🔒 FRAUD DETECTION</span>
            </div>
            <div className="bg-eco-green/20 border border-eco-green/40 rounded-lg px-3 py-1">
              <span className="text-eco-green text-xs font-bold">📸 VERIFICATION</span>
            </div>
          </div>
        </div>

        {/* Camera Controls */}
        <div className="mt-4 pb-24">
          <div className="flex justify-center items-center space-x-4 mb-4">
            {/* Restart Camera */}
            <Button
              variant="ghost"
              size="icon"
              onClick={startCamera}
              className="glassmorphic w-12 h-12 rounded-full"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>

            {/* Main Capture Button */}
            <Button
              onClick={handleBinPhotoCapture}
              disabled={!isStreaming || isCapturing || isProcessing}
              className={cn(
                "w-20 h-20 rounded-full bg-eco-green hover:bg-eco-green/90 text-white shadow-lg",
                "disabled:opacity-50 transition-all duration-300",
                "hover:shadow-eco-green/50 hover:shadow-2xl hover:scale-105",
                (isCapturing || isProcessing) && "animate-pulse"
              )}
            >
              {isCapturing || isProcessing ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-8 h-8" />
              )}
            </Button>

            {/* Skip Button (but warn about reduced rewards) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="glassmorphic w-12 h-12 rounded-full text-yellow-400 hover:text-yellow-300"
            >
              <span className="text-xs">Skip</span>
            </Button>
          </div>

          {/* Status */}
          <div className="text-center space-y-2">
            {isProcessing ? (
              <div className="bg-eco-green/20 border border-eco-green/40 rounded-lg p-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-eco-green border-t-transparent rounded-full animate-spin" />
                  <span className="text-eco-green text-sm font-medium">Verifying photos with AI...</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isStreaming ? "bg-eco-green animate-pulse" : "bg-red-500"
                )} />
                <span className="text-sm text-text-secondary">
                  {isStreaming ? "Ready to capture proof" : "Connecting camera..."}
                </span>
              </div>
            )}

            {/* Warning about skipping */}
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-2">
              <p className="text-yellow-200 text-xs">
                Skipping verification reduces coin rewards by 50%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}