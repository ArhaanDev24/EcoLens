import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GlassmorphicCard } from '@/components/ui/glassmorphic-card';
import { CardContent } from '@/components/ui/card';
import { Confetti } from '@/components/ui/confetti';
import { useAIDetection, DetectionResult } from '@/hooks/use-ai-detection';
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
      
      // Save detection to backend
      await apiRequest('POST', '/api/detections', {
        imageUrl: imageData,
        detectedObjects: results,
        confidenceScore: results[0]?.confidence || 0,
        coinsEarned: totalCoins
      });

      setShowConfetti(true);
      onCoinsEarned(totalCoins);
      
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      console.error('Failed to save detection:', error);
    } finally {
      setIsCollecting(false);
    }
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
                  <div className="w-12 h-12 bg-eco-green rounded-xl flex items-center justify-center">
                    <i className="fas fa-recycle text-dark-bg text-xl" />
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
            <i className="fas fa-coins" />
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
