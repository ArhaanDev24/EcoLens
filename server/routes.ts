import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDetectionSchema, insertTransactionSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import QRCode from 'qrcode';
import { detectRecyclableItems } from './gemini';

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

      // Use Gemini AI to detect recyclable items
      const detections = await detectRecyclableItems(base64Data);
      
      // Transform to frontend format
      const results = detections.map(item => ({
        name: item.name,
        confidence: item.confidence,
        binType: item.binType,
        binColor: getBinColor(item.binType),
        coinsReward: getCoinsReward(item.material, item.name)
      }));

      res.json(results);
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

  // Create detection record and award coins
  app.post("/api/detections", async (req, res) => {
    try {
      const { itemName, confidence, binType, coinsAwarded } = req.body;
      
      // Create detection record
      const detection = await storage.createDetection({
        userId: 1,
        imageUrl: null,
        detectedObjects: JSON.stringify([{
          name: itemName || 'Unknown Item',
          confidence: confidence || 80,
          binType: binType || 'landfill',
          coinsReward: coinsAwarded || 0
        }]),
        coinsEarned: coinsAwarded || 0
      });
      
      // Award coins to user
      if (coinsAwarded > 0) {
        await storage.createTransaction({
          userId: 1,
          type: 'earn',
          amount: coinsAwarded,
          description: `Detected ${itemName}`,
          detectionId: detection.id
        });
        
        // Update user's coin balance
        await storage.updateUserCoins(1, coinsAwarded);
      }
      
      res.json({ success: true, detection, coinsAwarded });
    } catch (error) {
      console.error('Create detection error:', error);
      res.status(500).json({ error: "Failed to create detection record" });
    }
  });

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

  // Generate QR code for reward redemption
  app.post("/api/transactions/qr", async (req, res) => {
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

      // Generate QR code
      const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData));

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
        qrCode: qrCodeImage,
        redemptionCode,
        transaction
      });
    } catch (error) {
      console.error('Generate QR error:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to generate QR code" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for detection results
function getBinColor(binType: string): string {
  switch (binType) {
    case 'recyclable': return '#00C48C';
    case 'compost': return '#8BC34A';
    case 'landfill': return '#6B7280';
    default: return '#6B7280';
  }
}

function getCoinsReward(material: string, itemName: string): number {
  const name = itemName.toLowerCase();
  
  // Higher rewards for valuable recyclables
  if (material === 'metal' || name.includes('aluminum')) return 18;
  if (material === 'plastic' || name.includes('bottle') || name.includes('bag')) return 15;
  if (material === 'glass') return 12;
  if (material === 'paper' || name.includes('cardboard')) return 8;
  
  return 10; // Default reward
}

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
