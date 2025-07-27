import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIDetection } from '@/hooks/use-ai-detection';
import { Camera, ArrowLeft, Coins, Sparkles, CheckCircle, Trophy, Recycle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
          // Create detection records in database first
          await Promise.all(results.map(async (item) => {
            try {
              await fetch('/api/detections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  itemName: item.name,
                  confidence: item.confidence,
                  binType: item.binType,
                  coinsAwarded: item.coinsReward
                })
              });
            } catch (err) {
              console.error('Failed to save detection:', err);
            }
          }));
          
          // Award coins after successful database storage
          const totalCoins = results.reduce((sum, item) => sum + item.coinsReward, 0);
          onCoinsEarned(totalCoins);
          setCoinsAnimation(true);
          setShowConfetti(true);
          
          setTimeout(() => {
            setCoinsAnimation(false);
            setShowConfetti(false);
          }, 2000);
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
              
              {/* Reward Section */}
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
                {detectionResult[0].binType === 'recyclable' && 
                  "Clean and dry this item before placing it in the recycling bin. Remove any caps or labels if possible."
                }
                {detectionResult[0].binType === 'compost' && 
                  "This organic material can be composted. Break it into smaller pieces to speed decomposition."
                }
                {detectionResult[0].binType === 'landfill' && 
                  "Unfortunately, this item cannot be recycled. Consider reusing it or finding alternative eco-friendly options."
                }
                {detectionResult[0].binType === 'hazardous' && 
                  "This item requires special disposal. Take it to a hazardous waste facility to prevent environmental damage."
                }
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