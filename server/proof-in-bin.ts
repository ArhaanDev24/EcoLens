import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ProofInBinComparison {
  isMatchingObject: boolean;
  matchScore: number;
  itemIdentified: string;
  binItemIdentified: string;
  confidence: number;
  reasoning: string;
  fraudRisk: number; // 0-100 fraud risk assessment
}

export async function compareItemToBinPhoto(
  itemImageBase64: string,
  binImageBase64: string,
  detectedObjects: any[]
): Promise<ProofInBinComparison> {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'demo-key') {
      console.log("Gemini API key not configured properly");
      return {
        isMatchingObject: false,
        matchScore: 0,
        itemIdentified: "unknown",
        binItemIdentified: "unknown", 
        confidence: 0,
        reasoning: "AI service unavailable",
        fraudRisk: 100
      };
    }

    const expectedItems = detectedObjects.map(obj => obj.name).join(", ");

    const prompt = `You are an expert fraud detection AI for a recycling verification system. Compare these two images:

IMAGE 1: Original scanned recyclable item(s): ${expectedItems}
IMAGE 2: Photo supposedly showing the same item(s) inside a recycling bin

Your task is to verify if the SAME EXACT OBJECT appears in both photos. This is critical anti-fraud verification.

ANALYSIS REQUIREMENTS:
1. Object Matching: Are the exact same physical objects visible in both photos?
2. Visual Characteristics: Compare shape, color, size, labels, wear patterns, unique features
3. Fraud Detection: Look for signs of deception like different objects, staged photos, or manipulation
4. Environmental Context: Is Image 2 clearly inside a recycling bin with appropriate surroundings?

FRAUD INDICATORS TO WATCH FOR:
- Different objects with similar appearance
- Same object type but different brand/model
- Professional stock photos vs real photos
- Inconsistent lighting or photo quality
- Objects not actually in recycling bins
- Multiple identical items (mass production fraud)

Return JSON response with this exact structure:
{
  "isMatchingObject": boolean,
  "matchScore": number (0-100),
  "itemIdentified": "description of item in first photo",
  "binItemIdentified": "description of item in bin photo", 
  "confidence": number (0-100),
  "reasoning": "detailed explanation of comparison",
  "fraudRisk": number (0-100, higher = more suspicious)
}

Be strict in verification - only mark as matching if you're confident it's the SAME EXACT object.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            isMatchingObject: { type: "boolean" },
            matchScore: { type: "number" },
            itemIdentified: { type: "string" },
            binItemIdentified: { type: "string" },
            confidence: { type: "number" },
            reasoning: { type: "string" },
            fraudRisk: { type: "number" }
          },
          required: ["isMatchingObject", "matchScore", "itemIdentified", "binItemIdentified", "confidence", "reasoning", "fraudRisk"]
        }
      },
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: itemImageBase64 || '',
                mimeType: "image/jpeg"
              }
            },
            {
              inlineData: {
                data: binImageBase64 || '',
                mimeType: "image/jpeg"
              }
            }
          ]
        }
      ]
    });

    const result = JSON.parse(response.text);
    
    console.log('Proof-in-Bin Analysis:', {
      matchScore: result.matchScore,
      isMatch: result.isMatchingObject,
      fraudRisk: result.fraudRisk,
      reasoning: result.reasoning.substring(0, 100) + "..."
    });

    return result;

  } catch (error) {
    console.error('Error in Proof-in-Bin comparison:', error);
    return {
      isMatchingObject: false,
      matchScore: 0,
      itemIdentified: "error",
      binItemIdentified: "error",
      confidence: 0,
      reasoning: "Technical error during comparison",
      fraudRisk: 100
    };
  }
}

// Enhanced fraud detection for bin verification
export function calculateBinVerificationFraudScore(
  comparison: ProofInBinComparison,
  verificationAttempts: number,
  timeBetweenPhotos: number // seconds
): number {
  let fraudScore = comparison.fraudRisk;

  // Multiple failed attempts
  if (verificationAttempts > 1) {
    fraudScore += 20 * (verificationAttempts - 1);
  }

  // Suspiciously quick verification (less than 30 seconds)
  if (timeBetweenPhotos < 30) {
    fraudScore += 25;
  }

  // Very long delay (more than 10 minutes - might be staged)
  if (timeBetweenPhotos > 600) {
    fraudScore += 15;
  }

  // Low match confidence
  if (comparison.confidence < 60) {
    fraudScore += 20;
  }

  // Low match score but claiming match
  if (comparison.isMatchingObject && comparison.matchScore < 70) {
    fraudScore += 30;
  }

  return Math.min(fraudScore, 100);
}