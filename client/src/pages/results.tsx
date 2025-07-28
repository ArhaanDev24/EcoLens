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

export function ResultsPage({ imageData, onBack, onCoinsEarned }: ResultsPageProps) {
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

  const collectRewards = async () => {
    setIsCollecting(true);
    
    try {
      const totalCoins = results.reduce((sum, result) => sum + result.coinsReward, 0);
      
      // Check if this is a high-value detection that needs verification  
      const highValueThreshold = 15; // coins (lowered from 20)
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
            needsVerification: true
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
          try {
            const response = await fetch('/api/detections', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                itemName: result.name,
                confidence: result.confidence,
                binType: result.binType,
                coinsAwarded: result.coinsReward
              })
            });

            if (!response.ok) {
              console.error('Failed to save detection:', await response.text());
            }
          } catch (err) {
            console.error('Detection save error:', err);
          }
        }

        // Show success animation
        setShowConfetti(true);
        onCoinsEarned(totalCoins);
        
        setTimeout(() => {
          onBack();
        }, 2000);
      }
    } catch (error) {
      console.error('Collection error:', error);
      // Still show success animation
      setShowConfetti(true);
      const totalCoins = results.reduce((sum, result) => sum + result.coinsReward, 0);
      onCoinsEarned(totalCoins);
      setTimeout(() => {
        onBack();
      }, 2000);
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
    }
  };

  const skipVerification = () => {
    setNeedsVerification(false);
    setIsVerifying(false);
    stopCamera();
    // Award reduced coins for unverified detection
    const reducedCoins = Math.floor(results.reduce((sum, result) => sum + result.coinsReward, 0) * 0.5);
    onCoinsEarned(reducedCoins);
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent('recycling center near me');
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  const primaryResult = results[0];
  const secondaryResults = results.slice(1);
  const totalCoins = results.reduce((sum, result) => sum + result.coinsReward, 0);

  if (isDetecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassmorphicCard className="p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-eco-green border-t-transparent rounded-full mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Analyzing Image</h3>
          <p className="text-sm text-text-secondary">AI is detecting recyclable items...</p>
        </GlassmorphicCard>
      </div>
    );
  }

  // Verification Screen
  if (needsVerification) {
    return (
      <div className="min-h-screen bg-dark-bg pb-24">
        {/* Header */}
        <div className="flex items-center p-4 glassmorphic">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNeedsVerification(false)}
            className="w-10 h-10 bg-dark-surface-variant rounded-full mr-4"
          >
            <i className="fas fa-arrow-left text-text-primary" />
          </Button>
          <div>
            <h2 className="text-lg font-medium">Verify Recycling</h2>
            <p className="text-sm text-text-secondary">Show us you actually recycled!</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4">
          <GlassmorphicCard>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                  <i className="fas fa-camera text-white" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Anti-Fraud Verification Required</h3>
                  <p className="text-sm text-text-secondary mb-2">
                    High-value items need verification to prevent fraud. Please:
                  </p>
                  <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
                    <li>Place the item in the correct recycling bin</li>
                    <li>Take a photo showing the item going into the bin</li>
                    <li>Submit for verification to earn full rewards</li>
                  </ol>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <div>
                  <div className="text-amber-400 font-medium">Full Reward: +{results.reduce((sum, result) => sum + result.coinsReward, 0)} coins</div>
                  <div className="text-xs text-text-secondary">Skip verification: +{Math.floor(results.reduce((sum, result) => sum + result.coinsReward, 0) * 0.5)} coins</div>
                </div>
              </div>
            </CardContent>
          </GlassmorphicCard>
        </div>

        {/* Camera View */}
        {isVerifying && (
          <div className="p-4">
            <div className="w-full h-64 rounded-2xl border border-dark-surface-variant overflow-hidden bg-black relative">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              {/* Overlay Guide */}
              <div className="absolute inset-4 border-2 border-eco-green border-dashed rounded-xl flex items-center justify-center">
                <div className="text-center text-white bg-black/50 p-3 rounded-xl">
                  <i className="fas fa-recycle text-2xl mb-2 text-eco-green" />
                  <p className="text-sm">Show item going into bin</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          {!isVerifying ? (
            <Button
              onClick={startVerification}
              className="w-full bg-eco-green text-dark-bg font-medium py-4 rounded-2xl flex items-center justify-center space-x-2"
            >
              <i className="fas fa-camera" />
              <span>Start Verification</span>
            </Button>
          ) : (
            <Button
              onClick={captureVerificationPhoto}
              disabled={!isStreaming}
              className="w-full bg-eco-green text-dark-bg font-medium py-4 rounded-2xl flex items-center justify-center space-x-2"
            >
              <i className="fas fa-camera" />
              <span>Capture Proof</span>
            </Button>
          )}
          
          <Button
            onClick={skipVerification}
            variant="secondary"
            className="w-full bg-dark-surface-variant text-text-primary font-medium py-4 rounded-2xl"
          >
            Skip Verification (Half Rewards)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header with back button */}
      <div className="flex items-center p-4 glassmorphic">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="w-10 h-10 bg-dark-surface-variant rounded-full mr-4"
        >
          <i className="fas fa-arrow-left text-text-primary" />
        </Button>
        <div>
          <h2 className="text-lg font-medium">Detection Results</h2>
          <p className="text-sm text-text-secondary">AI Analysis Complete</p>
        </div>
      </div>
      
      {/* Captured Image */}
      <div className="p-4">
        <div className="w-full h-48 rounded-2xl border border-dark-surface-variant overflow-hidden">
          <img 
            src={imageData} 
            alt="Captured" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Detection Results */}
      <div className="px-4 space-y-4">
        {primaryResult && (
          <GlassmorphicCard>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-eco-green rounded-xl flex items-center justify-center p-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 6V3C7 2.45 7.45 2 8 2H16C16.55 2 17 2.45 17 3V6H19C19.55 6 20 6.45 20 7C20 7.55 19.55 8 19 8H18V19C18 20.1 17.1 21 16 21H8C6.9 21 6 20.1 6 19V8H5C4.45 8 4 7.55 4 7C4 6.45 4.45 6 5 6H7ZM8 4V6H16V4H8ZM8 8V19H16V8H8Z" fill="#1A1A1A"/>
                      <path d="M10 12L12 10L14 12" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      <path d="M12 10V16" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">{primaryResult.name}</h3>
                    <p className="text-sm text-text-secondary">
                      Confidence: {primaryResult.confidence}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-reward-yellow font-medium">+{primaryResult.coinsReward} coins</div>
                  <div className="text-xs text-text-secondary">Reward</div>
                </div>
              </div>
              
              {/* Bin Recommendation */}
              <div 
                className="p-3 rounded-xl border border-opacity-30"
                style={{ 
                  backgroundColor: `${primaryResult.binColor}20`,
                  borderColor: `${primaryResult.binColor}30`
                }}
              >
                <div className="flex items-center space-x-2">
                  <i className="fas fa-trash-alt" style={{ color: primaryResult.binColor }} />
                  <span className="font-medium" style={{ color: primaryResult.binColor }}>
                    {primaryResult.binType === 'recyclable' ? 'Recyclable Bin' :
                     primaryResult.binType === 'compost' ? 'Compost Bin' : 'Landfill Bin'}
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: primaryResult.binColor }}>
                  {primaryResult.binType === 'recyclable' ? 'Clean plastic containers go in the blue recycling bin' :
                   primaryResult.binType === 'compost' ? 'Organic materials go in the green compost bin' :
                   'Non-recyclable items go in the general waste bin'}
                </p>
              </div>
            </CardContent>
          </GlassmorphicCard>
        )}
        
        {/* Secondary Detections */}
        {secondaryResults.length > 0 && (
          <GlassmorphicCard>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Also Detected:</h4>
              <div className="space-y-3">
                {secondaryResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-recycle text-eco-green text-lg" />
                      <span className="text-text-secondary">{result.name}</span>
                    </div>
                    <div className="text-reward-yellow">+{result.coinsReward} coins</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlassmorphicCard>
        )}
        
        {results.length === 0 && (
          <GlassmorphicCard>
            <CardContent className="p-6 text-center">
              <i className="fas fa-search text-4xl text-text-secondary mb-4" />
              <h3 className="text-lg font-medium mb-2">No Recyclables Detected</h3>
              <p className="text-sm text-text-secondary">
                Try capturing items like plastic bottles, paper, or metal cans
              </p>
            </CardContent>
          </GlassmorphicCard>
        )}
      </div>
      
      {/* Action Buttons */}
      {results.length > 0 && (
        <div className="p-4 mt-6 space-y-3">
          <Button
            onClick={collectRewards}
            disabled={isCollecting}
            className="w-full bg-eco-green text-dark-bg font-medium py-4 rounded-2xl flex items-center justify-center space-x-2 transform active:scale-98 transition-transform hover:bg-eco-green"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" fill="#FFD500" stroke="#FFA000" strokeWidth="1"/>
              <circle cx="12" cy="12" r="6" fill="none" stroke="#FFA000" strokeWidth="1"/>
              <text x="12" y="16" textAnchor="middle" fill="#1A1A1A" fontFamily="Arial, sans-serif" fontSize="6" fontWeight="bold">ECO</text>
            </svg>
            <span>
              {isCollecting ? 'Collecting...' : `Collect ${totalCoins} Green Coins`}
            </span>
          </Button>
          
          <Button
            onClick={openGoogleMaps}
            variant="secondary"
            className="w-full bg-dark-surface-variant text-text-primary font-medium py-4 rounded-2xl flex items-center justify-center space-x-2"
          >
            <i className="fas fa-map-marker-alt" />
            <span>Find Nearest Recycler</span>
          </Button>
        </div>
      )}
      
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
    </div>
  );
}
