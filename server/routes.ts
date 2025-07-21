import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDetectionSchema, insertTransactionSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import QRCode from 'qrcode';

export async function registerRoutes(app: Express): Promise<Server> {
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
      const validatedData = insertDetectionSchema.parse({
        ...req.body,
        userId: 1 // Default user for demo
      });

      const detection = await storage.createDetection(validatedData);
      
      // Award coins to user
      await storage.updateUserCoins(1, validatedData.coinsEarned || 0);
      
      // Create transaction record
      await storage.createTransaction({
        userId: 1,
        type: 'earn',
        amount: validatedData.coinsEarned || 0,
        description: `Detected ${JSON.parse(validatedData.detectedObjects as string)[0]?.name || 'recyclable items'}`,
        detectionId: detection.id
      });

      res.json(detection);
    } catch (error) {
      console.error('Create detection error:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid data" });
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
