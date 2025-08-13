import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GlassmorphicCard } from '@/components/ui/glassmorphic-card';
import { CardContent } from '@/components/ui/card';
import { Confetti } from '@/components/ui/confetti';
import { useAIDetection, DetectionResult } from '@/hooks/use-ai-detection';
import { useCamera } from '@/hooks/use-camera';
import { apiRequest } from '@/lib/queryClient';

interface ResultsPageProps {
  imageData: string;
  onBack: () => void;
  onCoinsEarned: (coins: number) => void;
}

function ResultsPage({ imageData, onBack, onCoinsEarned }: ResultsPageProps) {
  const { detect, isDetecting } = useAIDetection();
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [pendingDetection, setPendingDetection] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { videoRef, canvasRef, isStreaming, startCamera, stopCamera, captureImage } = useCamera();

  useEffect(() => {
    if (imageData) {
      detectObjects();
    }
  }, [imageData]);

  const detectObjects = async () => {
    try {
      const detectionResults = await detect(imageData);
      setResults(detectionResults);
    } catch (error) {
      console.error('Detection failed:', error);
    }
  };

  // Generate image hash for fraud prevention
  const generateImageHash = async (imageData: string): Promise<string> => {
    try {
      // Remove data URL prefix
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      
      // Convert base64 to array buffer
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Generate SHA-256 hash
      const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return hashHex;
    } catch (error) {
      console.warn('Failed to generate image hash:', error);
      return '';
    }
  };

  const collectRewards = async () => {
    setIsCollecting(true);
    
    try {
      const totalCoins = results.reduce((sum, result) => sum + result.coinsReward, 0);
      
      // Generate image hash for fraud prevention
      const imageHash = await generateImageHash(imageData);
      
      // Check if this is a high-value detection that needs disposal verification  
      const highValueThreshold = 10; // coins (lowered for super anti-cheating)
      const needsVerify = totalCoins >= highValueThreshold;
      
      if (needsVerify) {
        // Save detection as pending verification
        const result = results[0]; // Take first result for simplicity
        const response = await fetch('/api/detections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itemName: result.name,
            confidence: result.confidence,
            binType: result.binType,
            coinsAwarded: result.coinsReward,
            needsVerification: true,
            imageHash: imageHash
          })
        });

        if (response.ok) {
          const detection = await response.json();
          setPendingDetection(detection);
          setNeedsVerification(true);
        }
      } else {
        // Process normally for low-value items
        for (const result of results) {
          const response = await fetch('/api/detections', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              itemName: result.name,
              confidence: result.confidence,
              binType: result.binType,
              coinsAwarded: result.coinsReward,
              needsVerification: false,
              imageHash: imageHash
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            
            // Handle comprehensive anti-fraud errors gracefully
            if (response.status === 429) {
              alert(`Rate limit exceeded: ${errorData.error}\nPlease wait before scanning again.`);
              return;
            } else if (response.status === 400) {
              let alertMessage = `Detection rejected: ${errorData.error}`;
              
              // Add specific guidance based on fraud type
              if (errorData.suspiciousPattern) {
                alertMessage += "\n\nTip: Try scanning different types of items to show varied recycling behavior.";
              } else if (errorData.locationSuspicious) {
                alertMessage += "\n\nTip: Try recycling from different locations to demonstrate real-world usage.";
              } else if (errorData.dailyLimitExceeded) {
                alertMessage += "\n\nTip: Come back tomorrow to continue earning coins through recycling.";
              } else if (errorData.rapidScanningDetected) {
                alertMessage += "\n\nTip: Take at least 5 minutes between scans to properly dispose of each item.";
              } else if (errorData.unusualTimePattern) {
                alertMessage += "\n\nTip: Regular recycling patterns during normal hours show authentic behavior.";
              } else if (errorData.lowConfidenceHighValue) {
                alertMessage += "\n\nTip: Take clearer photos with better lighting for high-value items.";
              } else if (errorData.suspiciousConsistency) {
                alertMessage += "\n\nTip: Real-world recycling shows natural variation in detection confidence.";
              } else if (errorData.deviceOveruse) {
                alertMessage += "\n\nTip: Share recycling activities with family/friends for more authentic usage.";
              }
              
              alert(alertMessage);
              return;
            }
            throw new Error('Failed to submit detection');
          }
          
          // Handle enhanced fraud prevention response
          const responseData = await response.json();
          
          // Show behavior warnings to educate users
          if (responseData.behaviorWarnings && responseData.behaviorWarnings.length > 0) {
            const warningsText = responseData.behaviorWarnings.join('\n');
            alert(`Helpful recycling tips:\n\n${warningsText}`);
          }
          
          // Check if verification is required
          if (responseData.requiresVerification) {
            const detection = responseData.detection;
            setPendingDetection({ detection, verificationReason: responseData.verificationReason });
            setNeedsVerification(true);
            return;
          }
        }

        // Show success animation
        setShowConfetti(true);
        const totalCoins = results.reduce((sum, result) => sum + result.coinsReward, 0);
        onCoinsEarned(totalCoins);
        
        setTimeout(() => {
          onBack();
        }, 2000);
      }
    } catch (error) {
      console.error('Collection error:', error);
      alert('Failed to submit detection. Please try again.');
    } finally {
      setIsCollecting(false);
    }
  };

  const startVerification = async () => {
    setIsVerifying(true);
    await startCamera();
  };

  const captureVerificationPhoto = async () => {
    const verificationImage = captureImage();
    if (!verificationImage || !pendingDetection) return;

    try {
      const response = await fetch(`/api/detections/${pendingDetection.detection.id}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationImageUrl: verificationImage
        })
      });

      if (response.ok) {
        // Verification successful
        setShowConfetti(true);
        const totalCoins = results.reduce((sum, result) => sum + result.coinsReward, 0);
        onCoinsEarned(totalCoins);
        
        setTimeout(() => {
          stopCamera();
          onBack();
        }, 2000);
      } else {
        alert('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
      stopCamera();
    }
  };

  if (isDetecting) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-eco-green mx-auto mb-4"></div>
          <p className="text-text-primary text-xl">Analyzing your image...</p>
        </div>
      </div>
    );
  }

  if (needsVerification && !isVerifying) {
    return (
      <div className="min-h-screen bg-dark-bg p-4">
        <GlassmorphicCard className="max-w-md mx-auto mt-8">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Verification Required
            </h2>
            <p className="text-text-secondary mb-6">
              This high-value detection needs verification. Please take a photo showing proper disposal.
            </p>
            <Button onClick={startVerification} className="w-full mb-4">
              Start Verification
            </Button>
            <Button variant="outline" onClick={onBack} className="w-full">
              Cancel
            </Button>
          </CardContent>
        </GlassmorphicCard>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-dark-bg p-4">
        <div className="max-w-md mx-auto">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg mb-4"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="space-y-4">
            <Button onClick={captureVerificationPhoto} className="w-full">
              Capture Verification Photo
            </Button>
            <Button variant="outline" onClick={() => {
              setIsVerifying(false);
              stopCamera();
            }} className="w-full">
              Cancel Verification
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {showConfetti && <Confetti />}
      
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-text-primary">Detection Results</h1>
          <div></div>
        </div>

        <div className="max-w-md mx-auto">
          <img src={imageData} alt="Captured" className="w-full rounded-lg mb-4" />
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <GlassmorphicCard key={index} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{result.name}</h3>
                  <p className="text-text-secondary">Confidence: {result.confidence}%</p>
                  <p className="text-text-secondary">Bin Type: {result.binType}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-eco-green">
                    +{result.coinsReward} coins
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          ))}
        </div>

        {results.length > 0 && (
          <div className="text-center">
            <Button 
              onClick={collectRewards} 
              disabled={isCollecting}
              className="w-full max-w-xs"
            >
              {isCollecting ? 'Processing...' : `Collect ${results.reduce((sum, r) => sum + r.coinsReward, 0)} Coins`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsPage;