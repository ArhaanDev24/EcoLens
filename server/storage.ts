import { users, detections, transactions, type User, type InsertUser, type Detection, type InsertDetection, type Transaction, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCoins(userId: number, coinsChange: number): Promise<void>;
  createDetection(detection: InsertDetection): Promise<Detection>;
  getUserDetections(userId: number): Promise<Detection[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
}

export class MemStorage implements IStorage {
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
    const detection: Detection = {
      id,
      userId: insertDetection.userId || null,
      imageUrl: insertDetection.imageUrl || null,
      detectedObjects: insertDetection.detectedObjects,
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

export const storage = new MemStorage();
