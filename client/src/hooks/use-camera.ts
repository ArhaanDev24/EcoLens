import { useState, useRef, useCallback } from 'react';

export interface CameraHook {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isStreaming: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureImage: () => string | null;
  error: string | null;
  facingMode: 'user' | 'environment';
  switchCamera: () => Promise<void>;
}

export function useCamera(): CameraHook {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async (requestedFacingMode?: 'user' | 'environment') => {
    try {
      setError(null);
      const currentFacingMode = requestedFacingMode || facingMode;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: currentFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setFacingMode(currentFacingMode);
      }
    } catch (err) {
      setError('Failed to access camera. Please ensure camera permissions are granted.');
      console.error('Camera access error:', err);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    // Compress image for API limits (max 400x300)
    const maxWidth = 400;
    const maxHeight = 300;
    const scale = Math.min(maxWidth / video.videoWidth, maxHeight / video.videoHeight, 0.5);
    
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Use lower quality for smaller file size
    return canvas.toDataURL('image/jpeg', 0.6);
  }, []);

  const switchCamera = useCallback(async () => {
    if (streamRef.current) {
      stopCamera();
    }
    const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    await startCamera(newFacingMode);
  }, [facingMode, startCamera, stopCamera]);

  return {
    videoRef,
    canvasRef,
    isStreaming,
    startCamera,
    stopCamera,
    captureImage,
    error,
    facingMode,
    switchCamera
  };
}
