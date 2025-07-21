import { useState, useCallback } from 'react';

export interface DetectionResult {
  name: string;
  confidence: number;
  binType: 'recyclable' | 'compost' | 'landfill';
  binColor: string;
  coinsReward: number;
}

export interface AIDetectionHook {
  detect: (imageData: string) => Promise<DetectionResult[]>;
  isDetecting: boolean;
  error: string | null;
}

export function useAIDetection(): AIDetectionHook {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(async (imageData: string): Promise<DetectionResult[]> => {
    setIsDetecting(true);
    setError(null);

    try {
      // First try Teachable Machine model
      const teachableMachineResult = await detectWithTeachableMachine(imageData);
      if (teachableMachineResult.length > 0) {
        return teachableMachineResult;
      }

      // Fallback to Clarifai
      const clarifaiResult = await detectWithClarifai(imageData);
      return clarifaiResult;
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('AI Detection error:', err);
      return [];
    } finally {
      setIsDetecting(false);
    }
  }, []);

  return {
    detect,
    isDetecting,
    error
  };
}

async function detectWithTeachableMachine(imageData: string): Promise<DetectionResult[]> {
  try {
    // Convert base64 to blob for Teachable Machine
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    // Load Teachable Machine model
    const modelURL = import.meta.env.VITE_TEACHABLE_MACHINE_MODEL_URL || 'https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/';
    
    if (!modelURL.includes('YOUR_MODEL_ID')) {
      const tmImage = await import('@teachablemachine/image');
      const model = await tmImage.load(modelURL + 'model.json', modelURL + 'metadata.json');
      
      const img = new Image();
      img.src = imageData;
      await new Promise(resolve => img.onload = resolve);
      
      const predictions = await model.predict(img);
      
      return predictions
        .filter(p => p.probability > 0.7)
        .map(prediction => ({
          name: prediction.className,
          confidence: Math.round(prediction.probability * 100),
          binType: getBinType(prediction.className),
          binColor: getBinColor(prediction.className),
          coinsReward: getCoinsReward(prediction.className)
        }));
    }
  } catch (err) {
    console.error('Teachable Machine detection failed:', err);
  }
  
  return [];
}

async function detectWithClarifai(imageData: string): Promise<DetectionResult[]> {
  try {
    const apiKey = import.meta.env.VITE_CLARIFAI_API_KEY || process.env.CLARIFAI_API_KEY || 'demo-key';
    
    const base64Data = imageData.split(',')[1];
    
    const response = await fetch('https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: [{
          data: {
            image: {
              base64: base64Data
            }
          }
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.status?.description || 'Clarifai API error');
    }

    const concepts = data.outputs?.[0]?.data?.concepts || [];
    
    return concepts
      .filter((concept: any) => concept.value > 0.7 && isRecyclableItem(concept.name))
      .slice(0, 3) // Top 3 results
      .map((concept: any) => ({
        name: concept.name,
        confidence: Math.round(concept.value * 100),
        binType: getBinType(concept.name),
        binColor: getBinColor(concept.name),
        coinsReward: getCoinsReward(concept.name)
      }));
  } catch (err) {
    console.error('Clarifai detection failed:', err);
    throw err;
  }
}

function isRecyclableItem(itemName: string): boolean {
  const recyclableItems = [
    'bottle', 'plastic', 'paper', 'cardboard', 'glass', 'metal', 'aluminum',
    'can', 'container', 'bag', 'packaging', 'newspaper', 'magazine'
  ];
  
  return recyclableItems.some(item => 
    itemName.toLowerCase().includes(item)
  );
}

function getBinType(itemName: string): 'recyclable' | 'compost' | 'landfill' {
  const name = itemName.toLowerCase();
  
  if (name.includes('plastic') || name.includes('bottle') || name.includes('glass') || 
      name.includes('metal') || name.includes('aluminum') || name.includes('paper') || 
      name.includes('cardboard')) {
    return 'recyclable';
  }
  
  if (name.includes('organic') || name.includes('food') || name.includes('fruit') || 
      name.includes('vegetable')) {
    return 'compost';
  }
  
  return 'landfill';
}

function getBinColor(itemName: string): string {
  const binType = getBinType(itemName);
  
  switch (binType) {
    case 'recyclable': return '#3B82F6'; // Blue
    case 'compost': return '#10B981'; // Green
    case 'landfill': return '#6B7280'; // Gray
    default: return '#6B7280';
  }
}

function getCoinsReward(itemName: string): number {
  const name = itemName.toLowerCase();
  
  if (name.includes('plastic') || name.includes('bottle')) return 15;
  if (name.includes('glass')) return 12;
  if (name.includes('metal') || name.includes('aluminum')) return 18;
  if (name.includes('paper') || name.includes('cardboard')) return 8;
  
  return 10; // Default reward
}
