import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIDetection } from '@/hooks/use-ai-detection';
import { Camera, ArrowLeft, Coins, Sparkles, CheckCircle, Trophy, Recycle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamic recycling tips based on detected items
function getRecyclingTip(item: any): string {
  const name = item.name.toLowerCase();
  const binType = item.binType;
  
  // Specific tips for different item types
  if (name.includes('bottle')) {
    if (binType === 'recyclable') {
      return "Remove the cap and label, rinse clean, then place in recycling bin. Plastic bottles can be recycled into new bottles, clothing, or carpeting!";
    }
  }
  
  if (name.includes('can') || name.includes('aluminum')) {
    return "Rinse clean and crush if possible to save space. Aluminum cans can be recycled infinitely without losing quality - they could be back on shelves in just 60 days!";
  }
  
  if (name.includes('glass')) {
    return "Remove caps and lids, rinse clean. Glass can be recycled endlessly into new bottles and jars. Consider reusing glass containers for storage!";
  }
  
  if (name.includes('paper') || name.includes('cardboard')) {
    return "Keep dry and remove any tape or staples. Cardboard boxes should be flattened. Paper can be recycled 5-7 times before fibers become too short!";
  }
  
  if (name.includes('bag') || name.includes('plastic')) {
    if (binType === 'recyclable') {
      return "Check recycling number on bottom. #1-2 are widely accepted. Clean bags can often be recycled at grocery store drop-offs!";
    } else {
      return "Most plastic bags aren't recyclable in regular bins. Take clean bags to grocery store collection points or reuse as trash liners!";
    }
  }
  
  if (name.includes('tobacco') || name.includes('cigarette')) {
    return "Cigarette butts contain toxic chemicals and take 10+ years to decompose. Dispose in trash and consider quitting to help the environment!";
  }
  
  if (name.includes('food') || name.includes('organic')) {
    return "Perfect for composting! Food scraps create nutrient-rich soil. If composting isn't available, dispose in organic waste bin.";
  }
  
  if (name.includes('snack')) {
    return "Most snack packaging isn't recyclable due to mixed materials. Look for recyclable alternatives or buy in bulk to reduce packaging waste!";
  }
  
  // General tips by bin type
  switch (binType) {
    case 'recyclable':
      return "Clean and dry this item before recycling. Check local recycling guidelines as programs vary by location.";
    case 'compost':
      return "This organic material can be composted! Break into smaller pieces to speed decomposition and create rich soil.";
    case 'landfill':
      return "This item goes to landfill, but you're still helping by disposing properly instead of littering. Consider eco-friendly alternatives next time!";
    default:
      return "Proper disposal prevents environmental harm. Research local waste programs for the best disposal method.";
  }
}

// Remove unused interface

interface EnhancedResultsProps {
  imageData: string;
  onBack: () => void;
  onCoinsEarned: (coins: number) => void;
}

export function EnhancedResults({ imageData, onBack, onCoinsEarned }: EnhancedResultsProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [coinsAnimation, setCoinsAnimation] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  
  const { detect, isDetecting, error } = useAIDetection();
  const [detectionResult, setDetectionResult] = useState<any[]>([]);

  // Run detection on mount - only once
  useEffect(() => {
    let isDetectionComplete = false;
    
    const runDetection = async () => {
      if (isDetectionComplete) return;
      
      try {
        const results = await detect(imageData);
        if (isDetectionComplete) return; // Prevent duplicate processing
        
        isDetectionComplete = true;
        setDetectionResult(results);
        
        if (results && results.length > 0) {
          const totalCoins = results.reduce((sum, item) => sum + item.coinsReward, 0);
          const highValueThreshold = 12; // coins
          const needsVerify = totalCoins >= highValueThreshold;
          
          if (needsVerify) {
            // High-value items need verification - don't award coins yet
            console.log('High-value detection requires verification:', totalCoins, 'coins');
            
            // Save detection as pending verification
            const item = results[0]; // Take first result for simplicity
            try {
              const response = await fetch('/api/detections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  itemName: item.name,
                  confidence: item.confidence,
                  binType: item.binType,
                  coinsAwarded: item.coinsReward,
                  needsVerification: true
                })
              });
              
              if (response.ok) {
                // Show verification required message instead of coins
                setNeedsVerification(true);
                setShowResults(true);
                return; // Don't award coins or show confetti
              }
            } catch (err) {
              console.error('Failed to save detection for verification:', err);
            }
          } else {
            // Low-value items get coins immediately
            await Promise.all(results.map(async (item) => {
              try {
                await fetch('/api/detections', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    itemName: item.name,
                    confidence: item.confidence,
                    binType: item.binType,
                    coinsAwarded: item.coinsReward,
                    needsVerification: false
                  })
                });
              } catch (err) {
                console.error('Failed to save detection:', err);
              }
            }));
            
            // Award coins after successful database storage
            onCoinsEarned(totalCoins);
            setCoinsAnimation(true);
            setShowConfetti(true);
            
            setTimeout(() => {
              setCoinsAnimation(false);
              setShowConfetti(false);
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Detection failed:', error);
        isDetectionComplete = true;
      }
    };
    
    runDetection();
    
    return () => {
      isDetectionComplete = true; // Cleanup
    };
  }, [imageData]); // Remove detect and onCoinsEarned from dependencies

  useEffect(() => {
    if (detectionResult && !isDetecting) {
      setTimeout(() => setShowResults(true), 500);
    }
  }, [detectionResult, isDetecting]);

  const createConfetti = () => {
    const container = document.querySelector('.results-container');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random() * 2}s`;
      confetti.style.backgroundColor = Math.random() > 0.5 ? '#00C48C' : '#FFD500';
      container.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 3000);
    }
  };

  useEffect(() => {
    if (showConfetti) {
      createConfetti();
    }
  }, [showConfetti]);

  const getBinInfo = (binType: string) => {
    const binTypes = {
      recyclable: { color: '#00C48C', icon: '♻️', label: 'Recyclable' },
      compost: { color: '#8B5A00', icon: '🌱', label: 'Compostable' },
      landfill: { color: '#6B7280', icon: '🗑️', label: 'Landfill' },
      hazardous: { color: '#DC2626', icon: '⚠️', label: 'Hazardous' }
    };
    return binTypes[binType as keyof typeof binTypes] || binTypes.landfill;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 results-container">
        <div className="glassmorphic p-8 text-center max-w-md fade-in-scale">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-text-primary">Detection Failed</h2>
          <p className="text-sm text-text-secondary mb-6">{error}</p>
          <Button onClick={onBack} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col results-container">
      {/* Enhanced Header */}
      <div className="glassmorphic-intense p-4 slide-in-up">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="glassmorphic w-12 h-12 rounded-full hover:bg-eco-green/20"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-lg font-semibold text-text-primary">AI Detection Results</h2>
            <p className="text-sm text-text-secondary">
              {isDetecting ? 'Analyzing...' : 'Analysis Complete'}
            </p>
          </div>
          
          <div className="w-12 h-12" /> {/* Spacer */}
        </div>
      </div>

      {/* Captured Image */}
      <div className="p-4">
        <div className="relative rounded-2xl overflow-hidden fade-in-scale">
          <img
            src={imageData}
            alt="Captured item"
            className="w-full h-64 object-cover"
          />
          
          {/* Scanning Overlay */}
          {isDetecting && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-eco-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white font-medium">Analyzing with AI...</p>
                <p className="text-white/70 text-sm mt-1">Identifying recyclable materials</p>
              </div>
            </div>
          )}
          
          {/* Results Overlay */}
          {detectionResult && detectionResult.length > 0 && showResults && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <div className="w-full bounce-in">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-eco-green/20 text-eco-green border-eco-green/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Detected
                  </Badge>
                  <span className="text-white/80 text-sm">
                    {detectionResult[0].confidence}% confidence
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detection Results */}
      {detectionResult && detectionResult.length > 0 && (
        <div className="flex-1 p-4 space-y-4">
          {detectionResult.map((detection, index) => (
            <div 
              key={index}
              className={cn(
                "glassmorphic p-6 rounded-2xl transition-all duration-500",
                showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-eco-green/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-eco-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary capitalize">
                      {detection.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      AI Detection Result
                    </p>
                  </div>
                </div>
                
                {getBinInfo(detection.binType) && (
                  <div className="text-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                      style={{ backgroundColor: getBinInfo(detection.binType).color + '20' }}
                    >
                      <span className="text-lg">
                        {getBinInfo(detection.binType).icon}
                      </span>
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: getBinInfo(detection.binType).color }}
                    >
                      {getBinInfo(detection.binType).label}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Confidence Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">Confidence Level</span>
                  <span className="text-eco-green font-medium">{detection.confidence}%</span>
                </div>
                <div className="w-full bg-dark-surface-variant rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-eco-green to-reward-yellow h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${detection.confidence}%` }}
                  />
                </div>
              </div>
              
              {/* Reward/Verification Section */}
              {needsVerification ? (
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 rounded-xl border border-orange-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <Camera className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">Verification Required</p>
                        <p className="text-lg font-bold text-orange-500">
                          {detection.coinsReward} coins pending
                        </p>
                        <p className="text-xs text-text-secondary mt-1">
                          Take photo of item in recycling bin to earn coins
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-1">
                        <span className="text-orange-500 text-lg">⚠️</span>
                      </div>
                      <p className="text-xs text-text-secondary">High value</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={cn(
                  "bg-gradient-to-r from-reward-yellow/20 to-eco-green/20 p-4 rounded-xl border border-reward-yellow/30",
                  coinsAnimation && "animate-pulse"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-reward-yellow/20 rounded-full flex items-center justify-center">
                        <Coins className="w-5 h-5 text-reward-yellow" />
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">Reward Earned</p>
                        <p className="text-lg font-bold text-reward-yellow">
                          +{detection.coinsReward} Green Coins
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Trophy className="w-8 h-8 text-reward-yellow mx-auto mb-1" />
                      <p className="text-xs text-text-secondary">Great job!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Recycling Tips */}
          <div className={cn(
            "glassmorphic p-6 rounded-2xl transition-all duration-700",
            showResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-eco-green/20 rounded-full flex items-center justify-center">
                <Recycle className="w-5 h-5 text-eco-green" />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">Recycling Tip</h4>
                <p className="text-sm text-text-secondary">How to properly dispose</p>
              </div>
            </div>
            
            <div className="bg-dark-surface-variant p-4 rounded-xl">
              <p className="text-sm text-text-primary">
                {getRecyclingTip(detectionResult[0])}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 pb-8">
        <div className="flex space-x-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 glassmorphic border-eco-green/30 hover:bg-eco-green/10"
          >
            <Camera className="w-4 h-4 mr-2" />
            Scan Another
          </Button>
          
          <Button
            onClick={onBack}
            className="flex-1 bg-eco-green hover:bg-eco-green/90"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}