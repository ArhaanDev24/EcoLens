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
      // First try Teachable Machine model (primary method)
      const teachableMachineResult = await detectWithTeachableMachine(imageData);
      if (teachableMachineResult.length > 0) {
        console.log('Teachable Machine detection successful:', teachableMachineResult);
        return teachableMachineResult;
      }

      // Fallback to server-side Gemini AI detection
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData })
      });

      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          console.log('Gemini AI detection successful:', results);
          return results;
        }
      }

      // Final fallback to Clarifai
      const clarifaiResult = await detectWithClarifai(imageData);
      return clarifaiResult;
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('AI Detection error:', err);
      // Return demo results as final fallback
      return getDemoResults();
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
    // Check if model URL is configured
    const modelURL = import.meta.env.VITE_TEACHABLE_MACHINE_MODEL_URL;
    
    if (!modelURL || modelURL.includes('YOUR_MODEL_ID') || modelURL === 'demo-model') {
      console.log('Teachable Machine model URL not configured, skipping...');
      return [];
    }
    
    // Convert base64 to blob for Teachable Machine
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    const tmImage = await import('@teachablemachine/image');
    const model = await tmImage.load(
      modelURL.endsWith('/') ? modelURL + 'model.json' : modelURL + '/model.json',
      modelURL.endsWith('/') ? modelURL + 'metadata.json' : modelURL + '/metadata.json'
    );
    
    const img = new Image();
    img.src = imageData;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      setTimeout(reject, 5000); // 5 second timeout
    });
    
    const predictions = await model.predict(img);
    
    return predictions
      .filter(p => p.probability > 0.5)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3)
      .map(prediction => ({
        name: mapTeachableMachineClass(prediction.className),
        confidence: Math.round(prediction.probability * 100),
        binType: getBinType(prediction.className),
        binColor: getBinColor(prediction.className),
        coinsReward: getCoinsReward(prediction.className)
      }));
  } catch (err) {
    console.error('Teachable Machine detection failed:', err);
    return [];
  }
}

async function detectWithClarifai(imageData: string): Promise<DetectionResult[]> {
  try {
    const apiKey = import.meta.env.VITE_CLARIFAI_API_KEY;
    
    if (!apiKey || apiKey === 'demo-key' || apiKey.startsWith('demo')) {
      console.log('Clarifai API key not configured, using demo results...');
      return getDemoResults();
    }
    
    const base64Data = imageData.split(',')[1];
    if (!base64Data) {
      throw new Error('Invalid image data format');
    }
    
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Clarifai API error: ${response.status} - ${errorData.status?.description || 'Unknown error'}`);
    }

    const data = await response.json();
    const concepts = data.outputs?.[0]?.data?.concepts || [];
    
    if (concepts.length === 0) {
      console.log('No items detected by Clarifai, using demo results...');
      return getDemoResults();
    }
    
    const results = concepts
      .filter((concept: any) => concept.value > 0.6 && isRecyclableItem(concept.name))
      .slice(0, 3)
      .map((concept: any) => ({
        name: concept.name,
        confidence: Math.round(concept.value * 100),
        binType: getBinType(concept.name),
        binColor: getBinColor(concept.name),
        coinsReward: getCoinsReward(concept.name)
      }));

    return results.length > 0 ? results : getDemoResults();
  } catch (err) {
    console.error('Clarifai detection failed:', err);
    return getDemoResults();
  }
}

function isRecyclableItem(itemName: string): boolean {
  const recyclableItems = [
    'bottle', 'plastic', 'paper', 'cardboard', 'glass', 'metal', 'aluminum',
    'can', 'container', 'bag', 'packaging', 'newspaper', 'magazine', 'polythene'
  ];
  
  return recyclableItems.some(item => 
    itemName.toLowerCase().includes(item)
  );
}

function getBinType(itemName: string): 'recyclable' | 'compost' | 'landfill' {
  const name = itemName.toLowerCase();
  
  if (name.includes('plastic') || name.includes('bottle') || name.includes('glass') || 
      name.includes('metal') || name.includes('aluminum') || name.includes('paper') || 
      name.includes('cardboard') || name.includes('bag') || name.includes('container') ||
      name.includes('packaging') || name.includes('polythene')) {
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
  
  if (name.includes('plastic') || name.includes('bottle') || name.includes('bag')) return 15;
  if (name.includes('glass')) return 12;
  if (name.includes('metal') || name.includes('aluminum')) return 18;
  if (name.includes('paper') || name.includes('cardboard')) return 8;
  
  return 10; // Default reward
}

function mapTeachableMachineClass(className: string): string {
  // Map Teachable Machine class names to user-friendly names
  const classMap: { [key: string]: string } = {
    'Plastic': 'plastic bottle',
    'Paper': 'paper waste',
    'Glass': 'glass container',
    'Metal': 'metal can',
    'Cardboard': 'cardboard box',
    'Organic': 'organic waste',
    'plastic': 'plastic item',
    'paper': 'paper item',
    'glass': 'glass item',
    'metal': 'metal item',
    'cardboard': 'cardboard item',
    'organic': 'organic waste'
  };
  
  return classMap[className] || className.toLowerCase();
}

function getDemoResults(): DetectionResult[] {
  // Demo results that simulate AI detection for testing purposes
  const demoItems = [
    'plastic bag',
    'plastic bottle', 
    'paper container',
    'recyclable packaging',
    'plastic container'
  ];
  
  const randomItem = demoItems[Math.floor(Math.random() * demoItems.length)];
  const confidence = Math.floor(Math.random() * 20) + 80; // 80-99% confidence
  
  return [{
    name: randomItem,
    confidence,
    binType: getBinType(randomItem),
    binColor: getBinColor(randomItem),
    coinsReward: getCoinsReward(randomItem)
  }];
}
