import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { type User, type InsertUser, type Detection, type InsertDetection, type Transaction, type InsertTransaction, type Stats, type InsertStats, type Achievement, type InsertAchievement } from "@shared/schema";
import { IStorage } from "./storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export class FirebaseStorage implements IStorage {
  private generateId(): number {
    return Math.floor(Math.random() * 1000000) + Date.now();
  }

  private async addDoc(collectionName: string, data: any) {
    const id = this.generateId();
    const docRef = doc(db, collectionName, id.toString());
    const docData = { ...data, id, createdAt: serverTimestamp() };
    await setDoc(docRef, docData);
    return { ...docData, createdAt: new Date() };
  }

  private async updateDocById(collectionName: string, docId: string, data: any) {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  }

  private async getDocById(collectionName: string, docId: string) {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }

  private async queryDocs(collectionName: string, field?: string, value?: any) {
    const collectionRef = collection(db, collectionName);
    let q = query(collectionRef);
    
    if (field && value !== undefined) {
      q = query(collectionRef, where(field, '==', value));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getUserById(id: number): Promise<User | undefined> {
    const users = await this.queryDocs('users', 'id', id);
    return users[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.queryDocs('users', 'username', username);
    return users[0] as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = await this.addDoc('users', {
      ...insertUser,
      id: 1, // For demo, always use user ID 1
      greenCoins: 0,
      totalEarned: 0,
    });

    // Create initial stats
    await this.addDoc('stats', {
      userId: user.id,
      totalDetections: 0,
      totalCoinsEarned: 0,
      totalCoinsSpent: 0,
      streakDays: 0,
      plasticItemsDetected: 0,
      paperItemsDetected: 0,
      glassItemsDetected: 0,
      metalItemsDetected: 0,
    });

    return user as User;
  }

  async updateUserCoins(userId: number, coinsChange: number): Promise<void> {
    const users = await this.queryDocs('users', 'id', userId);
    if (users.length > 0) {
      const user = users[0];
      await this.updateDocById('users', user.id.toString(), {
        greenCoins: (user.greenCoins || 0) + coinsChange,
        totalEarned: coinsChange > 0 ? (user.totalEarned || 0) + coinsChange : user.totalEarned,
      });
    }
  }

  async createDetection(insertDetection: InsertDetection): Promise<Detection> {
    return await this.addDoc('detections', insertDetection) as Detection;
  }

  async getUserDetections(userId: number): Promise<Detection[]> {
    const detections = await this.queryDocs('detections', 'userId', userId);
    return detections.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as Detection[];
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    return await this.addDoc('transactions', insertTransaction) as Transaction;
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    const transactions = await this.queryDocs('transactions', 'userId', userId);
    return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as Transaction[];
  }

  async getUserStats(userId: number): Promise<Stats | undefined> {
    const stats = await this.queryDocs('stats', 'userId', userId);
    return stats[0] as Stats | undefined;
  }

  async updateUserStats(userId: number, statsUpdate: Partial<InsertStats>): Promise<void> {
    const stats = await this.queryDocs('stats', 'userId', userId);
    if (stats.length > 0) {
      await this.updateDocById('stats', stats[0].id.toString(), statsUpdate);
    } else {
      // Create new stats if they don't exist
      await this.addDoc('stats', { userId, ...statsUpdate });
    }
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    return await this.addDoc('achievements', achievement) as Achievement;
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    const achievements = await this.queryDocs('achievements', 'userId', userId);
    return achievements.sort((a, b) => new Date(b.unlockedAt || b.createdAt).getTime() - new Date(a.unlockedAt || a.createdAt).getTime()) as Achievement[];
  }
}