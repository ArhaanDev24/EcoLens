import { users, detections, transactions, stats, achievements, type User, type InsertUser, type Detection, type InsertDetection, type Transaction, type InsertTransaction, type Stats, type InsertStats, type Achievement, type InsertAchievement } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCoins(userId: number, coinsChange: number): Promise<void>;
  createDetection(detection: InsertDetection): Promise<Detection>;
  getUserDetections(userId: number): Promise<Detection[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  getUserStats(userId: number): Promise<Stats | undefined>;
  updateUserStats(userId: number, statsUpdate: Partial<InsertStats>): Promise<void>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: number): Promise<Achievement[]>;
}

export class MemStorage implements IStorage {
  // Add dummy implementations for stats methods to satisfy interface
  async getUserStats(userId: number): Promise<Stats | undefined> { return undefined; }
  async updateUserStats(userId: number, statsUpdate: Partial<InsertStats>): Promise<void> {}
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> { 
    return { id: 1, ...achievement, unlockedAt: new Date(), userId: achievement.userId || null };
  }
  async getUserAchievements(userId: number): Promise<Achievement[]> { return []; }
  private users: Map<number, User>;
  private detections: Map<number, Detection>;
  private transactions: Map<number, Transaction>;
  private currentUserId: number;
  private currentDetectionId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.detections = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentDetectionId = 1;
    this.currentTransactionId = 1;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      id,
      username: insertUser.username,
      email: insertUser.email,
      firebaseUid: insertUser.firebaseUid || null,
      greenCoins: 0,
      totalEarned: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserCoins(userId: number, coinsChange: number): Promise<void> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...user,
      greenCoins: user.greenCoins + coinsChange,
      totalEarned: coinsChange > 0 ? user.totalEarned + coinsChange : user.totalEarned
    };

    this.users.set(userId, updatedUser);
  }

  async createDetection(insertDetection: InsertDetection): Promise<Detection> {
    const id = this.currentDetectionId++;
    
    // Ensure detectedObjects is valid JSON
    let detectedObjects = insertDetection.detectedObjects;
    if (typeof detectedObjects === 'string') {
      try {
        JSON.parse(detectedObjects);
      } catch {
        detectedObjects = '[]';
      }
    } else if (!detectedObjects) {
      detectedObjects = '[]';
    }
    
    const detection: Detection = {
      id,
      userId: insertDetection.userId || null,
      imageUrl: insertDetection.imageUrl || null,
      detectedObjects: detectedObjects,
      confidenceScore: insertDetection.confidenceScore || null,
      coinsEarned: insertDetection.coinsEarned || 0,
      createdAt: new Date()
    };
    this.detections.set(id, detection);
    return detection;
  }

  async getUserDetections(userId: number): Promise<Detection[]> {
    return Array.from(this.detections.values()).filter(
      (detection) => detection.userId === userId
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      id,
      type: insertTransaction.type,
      userId: insertTransaction.userId || null,
      amount: insertTransaction.amount,
      description: insertTransaction.description,
      detectionId: insertTransaction.detectionId || null,
      qrCode: insertTransaction.qrCode || null,
      createdAt: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    
    // Create initial stats for new user
    await db.insert(stats).values({
      userId: user.id,
      totalDetections: 0,
      totalCoinsEarned: 0,
      totalCoinsSpent: 0,
      streakDays: 0,
      plasticItemsDetected: 0,
      paperItemsDetected: 0,
      glassItemsDetected: 0,
      metalItemsDetected: 0
    });
    
    return user;
  }

  async updateUserCoins(userId: number, coinsChange: number): Promise<void> {
    await db
      .update(users)
      .set({
        greenCoins: sql`${users.greenCoins} + ${coinsChange}`,
        totalEarned: coinsChange > 0 ? sql`${users.totalEarned} + ${coinsChange}` : users.totalEarned
      })
      .where(eq(users.id, userId));
  }

  async createDetection(insertDetection: InsertDetection): Promise<Detection> {
    // Ensure detectedObjects is valid JSON
    let detectedObjects = insertDetection.detectedObjects;
    if (typeof detectedObjects === 'string') {
      try {
        JSON.parse(detectedObjects);
      } catch {
        detectedObjects = '[]';
      }
    } else if (!detectedObjects) {
      detectedObjects = '[]';
    }

    const [detection] = await db
      .insert(detections)
      .values({
        ...insertDetection,
        detectedObjects
      })
      .returning();
    return detection;
  }

  async getUserDetections(userId: number): Promise<Detection[]> {
    return await db
      .select()
      .from(detections)
      .where(eq(detections.userId, userId))
      .orderBy(desc(detections.createdAt));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  async getUserStats(userId: number): Promise<Stats | undefined> {
    const [userStats] = await db
      .select()
      .from(stats)
      .where(eq(stats.userId, userId));
    return userStats || undefined;
  }

  async updateUserStats(userId: number, statsUpdate: Partial<InsertStats>): Promise<void> {
    // First check if stats exist
    const existingStats = await this.getUserStats(userId);
    
    if (!existingStats) {
      // Create initial stats
      await db.insert(stats).values({
        userId: userId,
        totalDetections: 0,
        totalCoinsEarned: 0,
        totalCoinsSpent: 0,
        streakDays: 0,
        plasticItemsDetected: 0,
        paperItemsDetected: 0,
        glassItemsDetected: 0,
        metalItemsDetected: 0,
        ...statsUpdate
      });
    } else {
      // Update existing stats
      await db
        .update(stats)
        .set(statsUpdate)
        .where(eq(stats.userId, userId));
    }
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db
      .insert(achievements)
      .values(insertAchievement)
      .returning();
    return achievement;
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
}

// Use PostgreSQL database storage
export const storage = new DatabaseStorage();

// Initialize PostgreSQL demo user
async function initializePostgreSQLUser() {
  try {
    const existingUser = await storage.getUserById(1);
    if (!existingUser) {
      await storage.createUser({
        username: "eco_user",
        email: "user@ecolens.app",
        firebaseUid: "demo-uid"
      });
      console.log("Demo user created in PostgreSQL");
    }
  } catch (error) {
    console.log("PostgreSQL user initialization:", error);
  }
}

// Initialize on startup
initializePostgreSQLUser();
