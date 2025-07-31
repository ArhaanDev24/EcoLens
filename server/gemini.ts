import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface RecyclableDetection {
  name: string;
  confidence: number;
  isRecyclable: boolean;
  binType: 'recyclable' | 'compost' | 'landfill';
  material: string;
}

export async function detectRecyclableItems(imageBase64: string): Promise<RecyclableDetection[]> {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'demo-key') {
      console.log("Gemini API key not configured properly");
      return [];
    }

    console.log('Attempting Gemini detection...');

    const prompt = `Analyze this image and identify any recyclable items. For each item detected, provide:
1. Item name (e.g., "plastic bottle", "aluminum can", "cardboard box")
2. Confidence level (0-100)
3. Whether it's recyclable (true/false)
4. Which bin type (recyclable, compost, landfill)
5. Material type (plastic, metal, glass, paper, organic)

Focus on common recyclable items like:
- Plastic bottles, containers, bags
- Metal cans, aluminum containers
- Glass bottles, jars
- Paper, cardboard, newspapers
- Organic waste

Return response as JSON array with this structure:
[{"name": "item name", "confidence": 95, "isRecyclable": true, "binType": "recyclable", "material": "plastic"}]

Only include items you can clearly identify with confidence above 70%.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              confidence: { type: "number" },
              isRecyclable: { type: "boolean" },
              binType: { type: "string", enum: ["recyclable", "compost", "landfill"] },
              material: { type: "string" }
            },
            required: ["name", "confidence", "isRecyclable", "binType", "material"]
          }
        }
      },
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: imageBase64,
                mimeType: "image/jpeg"
              }
            }
          ]
        }
      ]
    });

    const result = response.text;
    if (!result) {
      console.error("Empty response from Gemini");
      return [];
    }

    try {
      const detections: RecyclableDetection[] = JSON.parse(result);
      return detections.filter(item => item.confidence >= 70);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      console.error("Raw response:", result);
      return [];
    }

  } catch (error) {
    console.error("Gemini detection failed:", error);
    return [];
  }
}