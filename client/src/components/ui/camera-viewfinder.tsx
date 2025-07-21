import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CameraViewfinderProps {
  className?: string;
  isScanning?: boolean;
}

export const CameraViewfinder = forwardRef<HTMLVideoElement, CameraViewfinderProps>(
  ({ className, isScanning = false }, ref) => {
    return (
      <div className={cn("camera-viewfinder w-full h-full relative flex items-center justify-center min-h-[500px]", className)}>
        <video
          ref={ref}
          className="absolute inset-0 w-full h-full object-cover rounded-[18px]"
          autoPlay
          playsInline
          muted
        />
        
        {isScanning && <div className="scan-line" />}
        
        {/* Viewfinder corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-eco-green" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-eco-green" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-eco-green" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-eco-green" />
        
        {/* Center target */}
        <div className="w-20 h-20 border border-eco-green rounded-full flex items-center justify-center animate-pulse-slow z-10">
          <div className="w-2 h-2 bg-eco-green rounded-full" />
        </div>
        
        {/* AI Detection Hint */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 glassmorphic px-4 py-2 rounded-full z-10">
          <p className="text-sm text-text-secondary">Point camera at recyclable items</p>
        </div>
      </div>
    );
  }
);

CameraViewfinder.displayName = "CameraViewfinder";
