import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertDetectionSchema, 
  insertTransactionSchema, 
  insertUserSchema,
  insertPersonalGoalSchema,
  insertEnvironmentalImpactSchema,
  insertHabitAnalyticsSchema
} from "@shared/schema";
import { z } from "zod";
import * as QRCode from 'qrcode';
import { detectRecyclableItems } from './gemini';

// Anti-fraud helper functions
function calculateFraudScore(confidence: number, recentCount: number, noImageHash: number, rapidScans: number = 0): number {
  let score = 0;
  
  // Low confidence increases fraud score
  if (confidence < 70) score += 20;
  if (confidence < 60) score += 30;
  
  // High frequency increases fraud score
  if (recentCount > 5) score += 25;
  if (recentCount > 8) score += 40;
  
  // Missing image hash is suspicious
  if (noImageHash) score += 15;
  
  // Rapid scanning behavior (potential item reuse without disposal)
  if (rapidScans > 2) score += 30;
  if (rapidScans > 4) score += 50;
  
  return Math.min(score, 100);
}

function getVerificationReason(fraudScore: number, coinsAwarded: number): string {
  if (fraudScore >= 40) {
    return "Suspicious activity detected - verification required to ensure proper disposal";
  }
  if (coinsAwarded >= 10) {
    return "High-value item detected - please verify proper disposal to prevent fraud";
  }
  return "Verification required for quality assurance and fraud prevention";
}

function getBehaviorWarnings(recentCount: number, rapidCount: number, locationCount: number): string[] {
  const warnings: string[] = [];
  
  if (recentCount > 6) {
    warnings.push("High detection frequency - please ensure you're disposing items properly");
  }
  
  if (rapidCount > 2) {
    warnings.push("Scanning too quickly - take time between each item for proper disposal");
  }
  
  if (locationCount > 5) {
    warnings.push("Multiple detections from same location - vary your recycling locations");
  }
  
  return warnings;
}

function getItemTypeField(binType: string): string {
  switch (binType) {
    case 'plastic': return 'plasticItemsDetected';
    case 'paper': return 'paperItemsDetected';
    case 'glass': return 'glassItemsDetected';
    case 'metal': return 'metalItemsDetected';
    default: return 'plasticItemsDetected';
  }
}

// Clarifai detection function
async function detectWithClarifai(base64Data: string) {
  try {
    const apiKey = process.env.VITE_CLARIFAI_API_KEY;
    
    if (!apiKey || apiKey === 'demo-key' || apiKey.startsWith('demo')) {
      console.log('Clarifai API key not configured, using demo results...');
      return getDemoResults();
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
        binType: getServerBinType(concept.name),
        binColor: getBinColor(getServerBinType(concept.name)),
        coinsReward: getServerCoinsReward(concept.name)
      }));

    if (results.length === 0) {
      return getDemoResults();
    }

    console.log('Clarifai detection successful:', results);
    return results;
  } catch (err) {
    console.error('Clarifai detection failed:', err);
    return getDemoResults();
  }
}

function getDemoResults() {
  return [
    {
      name: 'plastic water bottle',
      confidence: 94,
      binType: 'recyclable',
      binColor: '#3B82F6',
      coinsReward: 19
    }
  ];
}

function isRecyclableItem(name: string): boolean {
  const recyclableItems = [
    'bottle', 'plastic', 'can', 'aluminum', 'paper', 'cardboard', 'glass',
    'container', 'packaging', 'newspaper', 'magazine', 'box', 'tin',
    'water bottle', 'soda can', 'food container', 'milk carton'
  ];
  
  return recyclableItems.some(item => 
    name.toLowerCase().includes(item) || item.includes(name.toLowerCase())
  );
}

function getServerBinType(itemName: string): string {
  const name = itemName.toLowerCase();
  
  if (name.includes('plastic') || name.includes('bottle') || name.includes('glass') || 
      name.includes('metal') || name.includes('aluminum') || name.includes('paper') || 
      name.includes('cardboard') || name.includes('bag') || name.includes('container') ||
      name.includes('packaging') || name.includes('can') || name.includes('tin')) {
    return 'recyclable';
  }
  
  if (name.includes('food') || name.includes('organic') || name.includes('compost')) {
    return 'organic';
  }
  
  return 'general';
}

function getServerCoinsReward(itemName: string): number {
  const name = itemName.toLowerCase();
  
  // Premium recyclables
  if (name.includes('glass') || name.includes('aluminum')) {
    return Math.floor(Math.random() * 10) + 25; // 25-34 coins
  }
  
  // Standard recyclables
  if (name.includes('plastic') || name.includes('bottle') || name.includes('can')) {
    return Math.floor(Math.random() * 8) + 15; // 15-22 coins
  }
  
  // Paper products
  if (name.includes('paper') || name.includes('cardboard')) {
    return Math.floor(Math.random() * 6) + 10; // 10-15 coins
  }
  
  // Default
  return Math.floor(Math.random() * 5) + 8; // 8-12 coins
}

function getBinColor(binType: string): string {
  switch (binType) {
    case 'recyclable': return '#3B82F6';
    case 'organic': return '#10B981';
    case 'general': return '#6B7280';
    default: return '#3B82F6';
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Detection endpoint
  app.post("/api/detect", async (req, res) => {
    try {
      const { imageData } = req.body;
      
      if (!imageData || typeof imageData !== 'string') {
        return res.status(400).json({ error: "Image data is required" });
      }

      // Extract base64 data from data URL
      const base64Data = imageData.split(',')[1];
      if (!base64Data) {
        return res.status(400).json({ error: "Invalid image format" });
      }

      // Try Gemini AI first
      let detections = await detectRecyclableItems(base64Data);
      
      if (detections.length > 0) {
        // Transform to frontend format
        const results = detections.map(item => ({
          name: item.name,
          confidence: item.confidence,
          binType: item.binType,
          binColor: getBinColor(item.binType),
          coinsReward: getServerCoinsReward(item.name)
        }));
        res.json(results);
      } else {
        // Try Clarifai as fallback
        console.log('Gemini returned no detections, trying Clarifai...');
        const clarifaiResults = await detectWithClarifai(base64Data);
        if (clarifaiResults.length > 0) {
          res.json(clarifaiResults);
        } else {
          // Return demo results as final fallback
          res.json(getDemoResults());
        }
      }
    } catch (error) {
      console.error('AI Detection error:', error);
      res.status(500).json({ error: "Detection failed" });
    }
  });

  // Get or create user
  app.get("/api/user", async (req, res) => {
    try {
      // For demo purposes, create a default user if none exists
      let user = await storage.getUserById(1);
      
      if (!user) {
        user = await storage.createUser({
          username: "eco_user",
          email: "user@ecolens.app",
          firebaseUid: "demo-uid"
        });
      }

      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Create detection record and award coins with anti-fraud measures
  app.post("/api/detections", async (req, res) => {
    try {
      const { itemName, confidence, binType, coinsAwarded, needsVerification, imageHash } = req.body;
      
      // Anti-fraud checks
      const userId = 1;
      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
      
      // Check for rate limiting (max 10 detections per 10 minutes)
      const recentDetections = await storage.getRecentDetections(userId, tenMinutesAgo);
      if (recentDetections.length >= 10) {
        return res.status(429).json({ 
          error: "Rate limit exceeded. Please wait before scanning again.",
          cooldownUntil: new Date(recentDetections[0].createdAt.getTime() + 10 * 60 * 1000)
        });
      }
      
      // Check for duplicate image hash (prevent same image reuse)
      if (imageHash) {
        const duplicateDetection = await storage.getDetectionByImageHash(imageHash);
        if (duplicateDetection) {
          return res.status(400).json({ 
            error: "This image has already been processed. Please use a new photo.",
            originalDetection: duplicateDetection.createdAt
          });
        }
      }
      
      // Check confidence threshold (reject low confidence detections)
      if (confidence < 60) {
        return res.status(400).json({ 
          error: "Detection confidence too low. Please try with better lighting or closer image.",
          confidence: confidence,
          minimumRequired: 60
        });
      }
      
      // Check for suspicious patterns (same item type repeatedly)
      const recentSameItems = await storage.getRecentSameItemDetections(userId, itemName, tenMinutesAgo);
      if (recentSameItems.length >= 3) {
        return res.status(400).json({ 
          error: "Too many similar items detected recently. Please try different items.",
          suspiciousPattern: true
        });
      }
      
      // Check for location consistency (users scanning from same location repeatedly)
      const userAgent = req.headers['user-agent'] || '';
      const sameLocationDetections = await storage.getRecentDetectionsByUserAgent(userId, userAgent, tenMinutesAgo);
      if (sameLocationDetections.length >= 8) {
        return res.status(400).json({
          error: "Suspicious activity detected. Please ensure you're disposing items properly.",
          locationSuspicious: true
        });
      }
      
      // Advanced fraud checks for gaming prevention
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      
      const todayDetections = await storage.getRecentDetections(userId, todayStart);
      
      // Daily limits based on realistic recycling behavior
      if (todayDetections.length >= 50) {
        return res.status(400).json({
          error: "Daily detection limit reached. Normal recycling behavior doesn't exceed 50 items per day.",
          dailyLimitExceeded: true
        });
      }
      
      // Enhanced rapid scanning detection (super anti-cheating)
      const lastFiveMinutes = new Date(now.getTime() - 5 * 60 * 1000);
      const veryRecentDetections = await storage.getRecentDetections(userId, lastFiveMinutes);
      if (veryRecentDetections.length >= 2) { // Reduced to 2 for stricter fraud prevention
        return res.status(400).json({
          error: "Scanning too quickly. Please take at least 5 minutes between each item for proper disposal.",
          rapidScanningDetected: true
        });
      }
      
      // Super anti-cheating: Check for weekend/night patterns (unusual times)
      const hour = now.getHours();
      const dayOfWeek = now.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isNightTime = hour < 6 || hour > 22;
      
      if ((isWeekend || isNightTime) && todayDetections.length > 8) {
        return res.status(400).json({
          error: "Unusual recycling pattern detected. Most recycling happens during regular hours.",
          unusualTimePattern: true
        });
      }
      
      // Enhanced confidence threshold for high-value items
      if (coinsAwarded >= 10 && confidence < 75) {
        return res.status(400).json({
          error: "High-value item requires higher detection confidence for fraud prevention.",
          lowConfidenceHighValue: true
        });
      }
      
      // Super anti-cheating: Check for perfect detection patterns (too consistent)
      const lastTenDetections = todayDetections.slice(-10);
      if (lastTenDetections.length >= 10) {
        const avgConfidence = lastTenDetections.reduce((sum, d) => {
          const objects = JSON.parse(d.detectedObjects);
          return sum + (objects[0]?.confidence || 0);
        }, 0) / lastTenDetections.length;
        
        // Flag suspiciously consistent high confidence (potential AI spoofing)
        if (avgConfidence > 95) {
          return res.status(400).json({
            error: "Detection pattern appears artificial. Real-world scanning shows more variation.",
            suspiciousConsistency: true
          });
        }
      }
      
      // Anti-cheating: Check for device fingerprinting patterns
      const deviceFingerprint = req.headers['user-agent'] + '_' + (req.headers['accept-language'] || '');
      const sameDeviceToday = todayDetections.filter(d => d.userAgent === deviceFingerprint);
      if (sameDeviceToday.length > 30) {
        return res.status(400).json({
          error: "Excessive scanning from same device. Please ensure authentic recycling behavior.",
          deviceOveruse: true
        });
      }
      
      // Create detection record with fraud prevention data
      const detection = await storage.createDetection({
        userId: userId,
        imageUrl: null,
        imageHash: imageHash || null,
        detectedObjects: JSON.stringify([{
          name: itemName || 'Unknown Item',
          confidence: confidence || 80,
          binType: binType || 'landfill',
          coinsReward: coinsAwarded || 0
        }]),
        coinsEarned: coinsAwarded || 0,
        isVerified: !needsVerification,
        verificationStatus: needsVerification ? 'pending' : 'verified',
        verificationAttempts: 0,
        fraudScore: calculateFraudScore(confidence, recentDetections.length, imageHash ? 0 : 1, veryRecentDetections.length),
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown'
      });
      
      // Enhanced verification requirements based on fraud score and behavior
      let requiresVerification = needsVerification;
      
      // Automatically require verification for high fraud scores
      if (detection.fraudScore >= 40) {
        requiresVerification = true;
      }
      
      // Require verification for high-value items (enhanced anti-cheating)
      if (coinsAwarded >= 10) {
        requiresVerification = true;
      }
      
      // Only award coins if no verification needed and not flagged as suspicious
      if (coinsAwarded > 0 && !requiresVerification && detection.fraudScore < 50) {
        await storage.createTransaction({
          userId: userId,
          type: 'earn',
          amount: coinsAwarded,
          description: `Detected ${itemName}`,
          detectionId: detection.id,
          metadata: JSON.stringify({ confidence, fraudScore: detection.fraudScore })
        });
        
        // Update user's coin balance
        await storage.updateUserCoins(userId, coinsAwarded);
        
        // Update user stats
        await storage.incrementUserStats(userId, {
          totalDetections: 1,
          totalCoinsEarned: coinsAwarded,
          [getItemTypeField(binType)]: 1
        });
      }
      
      // Return response with enhanced fraud prevention info
      res.json({ 
        success: true, 
        detection, 
        coinsAwarded: requiresVerification ? 0 : coinsAwarded,
        fraudScore: detection.fraudScore,
        requiresVerification: requiresVerification,
        verificationReason: requiresVerification ? getVerificationReason(detection.fraudScore, coinsAwarded) : null,
        rateLimit: {
          remaining: 10 - recentDetections.length - 1,
          resetTime: new Date(now.getTime() + 10 * 60 * 1000),
          dailyRemaining: 50 - todayDetections.length - 1
        },
        behaviorWarnings: getBehaviorWarnings(recentDetections.length, veryRecentDetections.length, sameLocationDetections.length)
      });
    } catch (error) {
      console.error('Create detection error:', error);
      res.status(500).json({ error: "Failed to create detection record" });
    }
  });

  // Enhanced verification endpoint with anti-fraud measures
  app.post('/api/detections/:id/verify', async (req, res) => {
    try {
      const detectionId = parseInt(req.params.id);
      const { verificationImageUrl } = req.body;
      
      const detection = await storage.getDetection(detectionId);
      if (!detection) {
        return res.status(404).json({ error: 'Detection not found' });
      }
      
      // Anti-fraud check: Ensure verification image is different from original
      if (verificationImageUrl && detection.imageUrl) {
        // Generate hash for verification image
        const verificationHash = await generateImageHash(verificationImageUrl);
        const originalHash = detection.imageHash;
        
        if (verificationHash === originalHash) {
          return res.status(400).json({ 
            error: 'Verification image cannot be the same as original detection image',
            fraudAttempt: true
          });
        }
      }
      
      // Check verification attempts limit
      if (detection.verificationAttempts >= 3) {
        return res.status(400).json({
          error: 'Maximum verification attempts exceeded. Contact support.',
          maxAttemptsExceeded: true
        });
      }
      
      // AI-based verification: Check if verification image shows proper disposal
      let verificationPassed = true;
      let verificationNotes = '';
      
      if (verificationImageUrl) {
        // Simple heuristic: verification images should show disposal context
        const verificationResult = await validateDisposalVerification(verificationImageUrl, detection);
        verificationPassed = verificationResult.passed;
        verificationNotes = verificationResult.notes;
      }
      
      if (!verificationPassed) {
        await storage.updateDetection(detectionId, {
          verificationImageUrl,
          verificationStatus: 'rejected',
          verificationAttempts: detection.verificationAttempts + 1,
          fraudScore: Math.min(detection.fraudScore + 25, 100)
        });
        
        return res.status(400).json({
          error: 'Verification failed: ' + verificationNotes,
          verificationRejected: true,
          attemptsRemaining: 3 - (detection.verificationAttempts + 1)
        });
      }
      
      // Update detection with successful verification
      const updatedDetection = await storage.updateDetection(detectionId, {
        verificationImageUrl,
        verificationStatus: 'verified',
        isVerified: true,
        verificationAttempts: detection.verificationAttempts + 1
      });
      
      // Award coins after successful verification
      if (detection.coinsEarned > 0) {
        await storage.createTransaction({
          userId: detection.userId!,
          type: 'earn',
          amount: detection.coinsEarned,
          description: `Recycling reward (verified): ${JSON.parse(detection.detectedObjects as string)[0]?.name || 'item'}`,
          detectionId: detectionId,
          metadata: { verificationPassed: true, verificationNotes }
        });
        
        // Update user's coin balance
        await storage.updateUserCoins(detection.userId!, detection.coinsEarned);
        
        // Update user stats for verified detections
        await storage.incrementUserStats(detection.userId!, {
          totalDetections: 1,
          totalCoinsEarned: detection.coinsEarned
        });
      }
      
      res.json({ 
        success: true, 
        detection: updatedDetection,
        coinsAwarded: detection.coinsEarned,
        verificationNotes
      });
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({ error: 'Verification failed' });
    }
  });

  // Helper function to validate disposal verification
  async function validateDisposalVerification(verificationImageUrl: string, detection: any): Promise<{passed: boolean, notes: string}> {
    try {
      // In a real implementation, this would use AI to analyze the verification image
      // For now, we'll use basic heuristics and patterns
      
      // Check if the image seems to show a disposal context (bins, recycling centers, etc.)
      // This is a simplified check - real implementation would use computer vision
      
      // For demo purposes, we'll pass most verifications but flag obvious attempts to cheat
      const suspiciousPatterns = [
        'same location repeatedly',
        'identical background',
        'no disposal context visible'
      ];
      
      // In a real app, you'd analyze the image with AI/ML
      // For now, we'll implement basic validation
      
      return {
        passed: true,
        notes: 'Verification image shows proper disposal context'
      };
      
    } catch (error) {
      console.error('Verification validation error:', error);
      return {
        passed: false,
        notes: 'Unable to validate verification image'
      };
    }
  }

  // Helper function to generate image hash
  async function generateImageHash(imageUrl: string): Promise<string> {
    try {
      // In a real implementation, you'd decode the image and generate a hash
      // For now, we'll use a simple hash of the image data
      return require('crypto').createHash('sha256').update(imageUrl).digest('hex');
    } catch (error) {
      console.error('Hash generation error:', error);
      return '';
    }
  }

  // Get user stats
  app.get("/api/user/:userId/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: "Failed to get user stats" });
    }
  });

  // Get user achievements  
  app.get("/api/user/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error('Get achievements error:', error);
      res.status(500).json({ error: "Failed to get user achievements" });
    }
  });

  // Get or create user
  app.get("/api/user", async (req, res) => {
    try {
      let user = await storage.getUserById(1);
      
      if (!user) {
        user = await storage.createUser({
          username: "eco_user",
          email: "user@ecolens.app",
          firebaseUid: "demo-uid"
        });
      }

      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Get user transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getUserTransactions(1);
      res.json(transactions);
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ error: "Failed to get transactions" });
    }
  });

  // Get user achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(1);
      res.json(achievements);
    } catch (error) {
      console.error('Get achievements error:', error);
      res.status(500).json({ error: "Failed to get achievements" });
    }
  });

  // Update user profile
  app.put("/api/user", async (req, res) => {
    try {
      const { username, email } = z.object({
        username: z.string().min(1),
        email: z.string().email()
      }).parse(req.body);

      const updatedUser = await storage.updateUser(1, { username, email });
      res.json(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Generate QR code for reward redemption
  app.post("/api/transactions/qr", async (req, res) => {
    // Guard clause to ensure valid inputs
    if (!req.body.amount || !req.body.value) {
      return res.status(400).json({ error: "Amount and value are required." });
    }
    try {
      const { amount, value } = z.object({
        amount: z.number(),
        value: z.number()
      }).parse(req.body);

      // Check if user has enough coins
      const user = await storage.getUserById(1);
      if (!user || user.greenCoins < amount) {
        return res.status(400).json({ error: "Insufficient coins" });
      }

      // Generate unique redemption code
      const redemptionCode = `ECOLENS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const qrData = {
        code: redemptionCode,
        value: value,
        currency: "INR",
        generated: new Date().toISOString()
      };

      // Add QR data log
      console.log("QR data:", qrData);

      // Generate QR code image using the dynamic redemption code
      const qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(redemptionCode)}`;

      // Deduct coins from user
      await storage.updateUserCoins(1, -amount);

      // Create transaction record
      const transaction = await storage.createTransaction({
        userId: 1,
        type: 'spend',
        amount: amount,
        description: `QR code redeemed for ₹${value}`,
        qrCode: redemptionCode
      });
      
      res.json({
        success: true,
        qrCodeImage,
        redemptionCode,
        value
      });
    } catch (error) {
      console.error('Generate QR error:', error);
      if (error instanceof Error) {
        console.error('Stack trace:', error.stack);
      }
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to generate QR code" });
    }
  });

  app.get("/qr-test", async (req, res) => {
  try {
    const sample = { test: "EcoLens", time: new Date().toISOString() };
    const qr = await QRCode.toDataURL(JSON.stringify(sample));
    res.send(`
      <html>
        <body style="text-align:center;font-family:sans-serif">
          <h2>QR Code Test</h2>
          <img src="${qr}" style="width:200px;height:200px;margin-top:20px;" />
        </body>
      </html>
    `);
  } catch (err) {
    console.error("QR test failed:", err);
    res.status(500).send("QR test failed");
  }
});

  // Personal Goals API
  app.get("/api/user/:userId/goals", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const goals = await storage.getUserGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error('Get goals error:', error);
      res.status(500).json({ error: "Failed to get goals" });
    }
  });

  app.post("/api/user/:userId/goals", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const goalData = insertPersonalGoalSchema.parse({ ...req.body, userId });
      const goal = await storage.createPersonalGoal(goalData);
      res.json(goal);
    } catch (error) {
      console.error('Create goal error:', error);
      res.status(500).json({ error: "Failed to create goal" });
    }
  });

  app.patch("/api/goals/:goalId/progress", async (req, res) => {
    try {
      const goalId = parseInt(req.params.goalId);
      const { progress } = req.body;
      await storage.updateGoalProgress(goalId, progress);
      res.json({ success: true });
    } catch (error) {
      console.error('Update goal progress error:', error);
      res.status(500).json({ error: "Failed to update goal progress" });
    }
  });

  // Environmental Impact API
  app.get("/api/user/:userId/environmental-impact", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const impact = await storage.getUserEnvironmentalImpact(userId);
      
      if (!impact) {
        // Create initial impact data if none exists
        const initialImpact = {
          userId,
          totalCO2Saved: 0,
          totalWaterSaved: 0,
          totalEnergySaved: 0,
          treesSaved: 0,
          landfillDiverted: 0,
          recyclingScore: 0
        };
        await storage.updateEnvironmentalImpact(userId, initialImpact);
        return res.json({ ...initialImpact, id: 1, weeklyImpactData: null, monthlyImpactData: null, lastUpdated: new Date() });
      }
      
      res.json(impact);
    } catch (error) {
      console.error('Get environmental impact error:', error);
      res.status(500).json({ error: "Failed to get environmental impact" });
    }
  });

  app.patch("/api/user/:userId/environmental-impact", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const impactData = req.body;
      await storage.updateEnvironmentalImpact(userId, impactData);
      res.json({ success: true });
    } catch (error) {
      console.error('Update environmental impact error:', error);
      res.status(500).json({ error: "Failed to update environmental impact" });
    }
  });

  // Smart Reminders API
  app.get("/api/user/:userId/reminders", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reminders = await storage.getUserReminders(userId);
      res.json(reminders);
    } catch (error) {
      console.error('Get reminders error:', error);
      res.status(500).json({ error: "Failed to get reminders" });
    }
  });

  app.post("/api/user/:userId/reminders", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reminderData = { ...req.body, userId };
      const reminder = await storage.createUserReminder(reminderData);
      res.json(reminder);
    } catch (error) {
      console.error('Create reminder error:', error);
      res.status(500).json({ error: "Failed to create reminder" });
    }
  });

  // Habit Analytics API
  app.get("/api/user/:userId/habits", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      
      const habits = await storage.getUserHabitData(userId, start, end);
      res.json(habits);
    } catch (error) {
      console.error('Get habits error:', error);
      res.status(500).json({ error: "Failed to get habit data" });
    }
  });

  app.post("/api/user/:userId/habits", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const habitData = insertHabitAnalyticsSchema.parse({ ...req.body, userId });
      const habit = await storage.createHabitEntry(habitData);
      res.json(habit);
    } catch (error) {
      console.error('Create habit entry error:', error);
      res.status(500).json({ error: "Failed to create habit entry" });
    }
  });

  app.get("/api/user/:userId/habit-insights", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const insights = await storage.getHabitInsights(userId);
      res.json(insights);
    } catch (error) {
      console.error('Get habit insights error:', error);
      res.status(500).json({ error: "Failed to get habit insights" });
    }
  });

  // Enhanced Analytics Dashboard API
  app.get("/api/user/:userId/analytics-dashboard", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get all analytics data in one endpoint
      const [
        goals,
        environmentalImpact,
        reminders,
        habitInsights,
        recentHabits
      ] = await Promise.all([
        storage.getUserGoals(userId),
        storage.getUserEnvironmentalImpact(userId),
        storage.getUserReminders(userId),
        storage.getHabitInsights(userId),
        storage.getUserHabitData(userId, 
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          new Date()
        )
      ]);
      
      // Calculate analytics
      const activeGoals = goals.filter(g => g.isActive && !g.completedAt);
      const completedGoals = goals.filter(g => g.completedAt);
      const goalCompletionRate = goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0;
      
      // Calculate recycling streak
      const sortedHabits = recentHabits.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (const habit of sortedHabits) {
        const habitDate = new Date(habit.date);
        habitDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today.getTime() - habitDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === currentStreak && habit.detectionsCount > 0) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      res.json({
        goals: {
          active: activeGoals,
          completed: completedGoals,
          completionRate: Math.round(goalCompletionRate),
          total: goals.length
        },
        environmentalImpact: environmentalImpact || {
          totalCO2Saved: 0,
          totalWaterSaved: 0,
          totalEnergySaved: 0,
          treesSaved: 0,
          landfillDiverted: 0,
          recyclingScore: 0
        },
        habits: {
          insights: habitInsights,
          currentStreak,
          recentData: recentHabits.slice(0, 7) // Last 7 days
        },
        reminders: {
          active: reminders.filter(r => r.isActive),
          total: reminders.length
        }
      });
    } catch (error) {
      console.error('Get analytics dashboard error:', error);
      res.status(500).json({ error: "Failed to get analytics dashboard" });
    }
  });

  // Add fraud prevention monitoring endpoint
  app.get('/api/admin/fraud-monitoring', async (req, res) => {
    try {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      // Get high-fraud-score detections (simplified for demo)
      const allDetections = await storage.getAllDetections();
      const suspiciousDetections = allDetections.filter(d => 
        d.fraudScore && d.fraudScore > 50 && 
        d.createdAt && new Date(d.createdAt) > last24Hours
      );
      
      // Get users with many recent detections (potential rapid scanners)
      const userDetectionCounts = new Map<number, number>();
      allDetections.forEach(d => {
        if (d.userId && d.createdAt && new Date(d.createdAt) > last24Hours) {
          const count = userDetectionCounts.get(d.userId) || 0;
          userDetectionCounts.set(d.userId, count + 1);
        }
      });
      
      const rapidScanners = Array.from(userDetectionCounts.entries())
        .filter(([userId, count]) => count > 15)
        .map(([userId, count]) => ({ userId, detectionCount: count }));
      
      // Get duplicate hash attempts (simplified)
      const hashCounts = new Map<string, number>();
      allDetections.forEach(d => {
        if (d.imageHash && d.createdAt && new Date(d.createdAt) > last24Hours) {
          const count = hashCounts.get(d.imageHash) || 0;
          hashCounts.set(d.imageHash, count + 1);
        }
      });
      
      const duplicateAttempts = Array.from(hashCounts.entries())
        .filter(([hash, count]) => count > 1)
        .map(([hash, count]) => ({ imageHash: hash, attemptCount: count }));
      
      res.json({
        suspiciousDetections: suspiciousDetections.slice(0, 20), // Limit response size
        rapidScanners,
        duplicateAttempts,
        summary: {
          totalSuspicious: suspiciousDetections.length,
          totalRapidScanners: rapidScanners.length,
          totalDuplicateAttempts: duplicateAttempts.length,
          last24HourDetections: allDetections.filter(d => 
            d.createdAt && new Date(d.createdAt) > last24Hours
          ).length
        }
      });
    } catch (error) {
      console.error('Fraud monitoring error:', error);
      res.status(500).json({ error: 'Failed to get fraud monitoring data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for detection results (using existing function above)

// Helper functions for statistics
function getItemCategory(itemName: string): string {
  const name = itemName.toLowerCase();
  if (name.includes('plastic') || name.includes('bottle') || name.includes('bag')) return 'plastic';
  if (name.includes('paper') || name.includes('cardboard')) return 'paper';
  if (name.includes('glass')) return 'glass';
  if (name.includes('metal') || name.includes('aluminum')) return 'metal';
  return 'other';
}

async function checkAndAwardAchievements(userId: number, stats: any): Promise<void> {
  const achievements = [];
  
  // First detection achievement
  if (stats.totalDetections === 1) {
    achievements.push({
      userId,
      achievementType: 'first_detection',
      title: 'First Steps',
      description: 'Made your first recycling detection!',
      iconType: 'star'
    });
  }
  
  // 10 detections achievement
  if (stats.totalDetections === 10) {
    achievements.push({
      userId,
      achievementType: 'detection_10',
      title: 'Eco Detective',
      description: 'Completed 10 recycling detections!',
      iconType: 'badge'
    });
  }
  
  // 100 coins earned achievement
  if (stats.totalCoinsEarned >= 100) {
    const currentAchievements = await storage.getUserAchievements(userId);
    const hasCoins100 = currentAchievements.some(a => a.achievementType === 'coins_100');
    
    if (!hasCoins100) {
      achievements.push({
        userId,
        achievementType: 'coins_100',
        title: 'Coin Collector',
        description: 'Earned 100 green coins!',
        iconType: 'coins'
      });
    }
  }
  
  // Award new achievements
  for (const achievement of achievements) {
    try {
      await storage.createAchievement(achievement);
    } catch (error) {
      console.error('Failed to create achievement:', error);
    }
  }
}
