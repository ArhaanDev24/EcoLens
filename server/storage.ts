import { 
  users, 
  detections, 
  transactions, 
  stats, 
  achievements,
  personalGoals,
  environmentalImpact,
  userReminders,
  habitAnalytics,
  type User, 
  type InsertUser, 
  type Detection, 
  type InsertDetection, 
  type Transaction, 
  type InsertTransaction, 
  type Stats, 
  type InsertStats, 
  type Achievement, 
  type InsertAchievement,
  type PersonalGoal,
  type EnvironmentalImpact,
  type UserReminder,
  type HabitAnalytics,
  type InsertPersonalGoal,
  type InsertEnvironmentalImpact,
  type InsertHabitAnalytics
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCoins(userId: number, coinsChange: number): Promise<void>;
  createDetection(detection: InsertDetection): Promise<Detection>;
  updateDetection(id: number, updates: Partial<Detection>): Promise<Detection | null>;
  getUserDetections(userId: number): Promise<Detection[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: number): Promise<Transaction[]>;
  getUserStats(userId: number): Promise<Stats | undefined>;
  updateUserStats(userId: number, statsUpdate: Partial<InsertStats>): Promise<void>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: number): Promise<Achievement[]>;
  
  // Personal Goals
  createPersonalGoal(goal: InsertPersonalGoal): Promise<PersonalGoal>;
  getUserGoals(userId: number): Promise<PersonalGoal[]>;
  updateGoalProgress(goalId: number, progress: number): Promise<void>;
  completeGoal(goalId: number): Promise<void>;
  
  // Environmental Impact
  getUserEnvironmentalImpact(userId: number): Promise<EnvironmentalImpact | undefined>;
  updateEnvironmentalImpact(userId: number, impact: Partial<InsertEnvironmentalImpact>): Promise<void>;
  
  // Smart Reminders
  createUserReminder(reminder: Omit<UserReminder, 'id' | 'createdAt'>): Promise<UserReminder>;
  getUserReminders(userId: number): Promise<UserReminder[]>;
  updateReminderSchedule(reminderId: number, nextScheduled: Date): Promise<void>;
  
  // Habit Analytics
  createHabitEntry(habit: InsertHabitAnalytics): Promise<HabitAnalytics>;
  getUserHabitData(userId: number, startDate?: Date, endDate?: Date): Promise<HabitAnalytics[]>;
  getHabitInsights(userId: number): Promise<{
    averageDaily: number;
    bestStreak: number;
    favoriteTime: string;
    weeklyPattern: Record<string, number>;
  }>;
  
  // Anti-fraud methods
  getRecentDetections(userId: number, since: Date): Promise<Detection[]>;
  getDetectionByImageHash(imageHash: string): Promise<Detection | undefined>;
  getRecentSameItemDetections(userId: number, itemName: string, since: Date): Promise<Detection[]>;
  incrementUserStats(userId: number, increments: {
    totalDetections?: number;
    totalCoinsEarned?: number;
    plasticItemsDetected?: number;
    paperItemsDetected?: number;
    glassItemsDetected?: number;
    metalItemsDetected?: number;
  }): Promise<void>;
  updateUser(userId: number, updates: Partial<User>): Promise<User>;
}

export class MemStorage implements IStorage {
  // Add dummy implementations for stats methods to satisfy interface
  async getUserStats(userId: number): Promise<Stats | undefined> { return undefined; }
  async updateUserStats(userId: number, statsUpdate: Partial<InsertStats>): Promise<void> {}
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> { 
    return { id: 1, ...achievement, unlockedAt: new Date(), userId: achievement.userId || null };
  }
  async getUserAchievements(userId: number): Promise<Achievement[]> { return []; }
  
  // Personal Goals dummy implementations
  async createPersonalGoal(goal: InsertPersonalGoal): Promise<PersonalGoal> {
    return { 
      id: 1, 
      userId: goal.userId || 1, 
      goalType: goal.goalType,
      targetType: goal.targetType,
      targetValue: goal.targetValue,
      title: goal.title,
      description: goal.description || null,
      currentProgress: 0, 
      isActive: true, 
      startDate: new Date(), 
      endDate: goal.endDate || null, 
      completedAt: null, 
      createdAt: new Date() 
    };
  }
  async getUserGoals(userId: number): Promise<PersonalGoal[]> { return []; }
  async updateGoalProgress(goalId: number, progress: number): Promise<void> {}
  async completeGoal(goalId: number): Promise<void> {}
  
  // Environmental Impact dummy implementations
  async getUserEnvironmentalImpact(userId: number): Promise<EnvironmentalImpact | undefined> { return undefined; }
  async updateEnvironmentalImpact(userId: number, impact: Partial<InsertEnvironmentalImpact>): Promise<void> {}
  
  // Smart Reminders dummy implementations
  async createUserReminder(reminder: Omit<UserReminder, 'id' | 'createdAt'>): Promise<UserReminder> {
    return { id: 1, ...reminder, createdAt: new Date() };
  }
  async getUserReminders(userId: number): Promise<UserReminder[]> { return []; }
  async updateReminderSchedule(reminderId: number, nextScheduled: Date): Promise<void> {}
  
  // Habit Analytics dummy implementations
  async createHabitEntry(habit: InsertHabitAnalytics): Promise<HabitAnalytics> {
    return { 
      id: 1, 
      userId: habit.userId || 1,
      date: habit.date,
      detectionsCount: habit.detectionsCount || 0,
      coinsEarned: habit.coinsEarned || 0,
      timeSpentMinutes: habit.timeSpentMinutes || 0,
      favoriteTime: habit.favoriteTime || null,
      locationData: null,
      itemTypes: habit.itemTypes || null,
      moodRating: habit.moodRating || null,
      notes: habit.notes || null
    };
  }
  async getUserHabitData(userId: number, startDate?: Date, endDate?: Date): Promise<HabitAnalytics[]> { return []; }
  async getHabitInsights(userId: number): Promise<{
    averageDaily: number;
    bestStreak: number;
    favoriteTime: string;
    weeklyPattern: Record<string, number>;
  }> {
    return { averageDaily: 0, bestStreak: 0, favoriteTime: 'morning', weeklyPattern: {} };
  }
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
      isVerified: insertDetection.isVerified || false,
      verificationImageUrl: insertDetection.verificationImageUrl || null,
      verificationStatus: insertDetection.verificationStatus || 'pending',
      verificationAttempts: insertDetection.verificationAttempts || 0,
      createdAt: new Date()
    };
    this.detections.set(id, detection);
    return detection;
  }

  async updateDetection(id: number, updates: Partial<Detection>): Promise<Detection | null> {
    const detection = this.detections.get(id);
    if (!detection) {
      return null;
    }
    
    const updatedDetection = { ...detection, ...updates };
    this.detections.set(id, updatedDetection);
    return updatedDetection;
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
  incrementUserStats(arg0: number, arg1: { [x: string]: any; totalDetections: number; totalCoinsEarned: any; }) {
    throw new Error("Method not implemented.");
  }
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
    
    // Create initial environmental impact for new user
    await db.insert(environmentalImpact).values({
      userId: user.id,
      totalCO2Saved: 0,
      totalWaterSaved: 0,
      totalEnergySaved: 0,
      treesSaved: 0,
      landfillDiverted: 0,
      recyclingScore: 0
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

  async updateDetection(id: number, updates: Partial<Detection>): Promise<Detection | null> {
    try {
      const [detection] = await db
        .update(detections)
        .set(updates)
        .where(eq(detections.id, id))
        .returning();
      return detection || null;
    } catch (error) {
      console.error('Update detection error:', error);
      return null;
    }
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
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Personal Goals Implementation
  async createPersonalGoal(goal: InsertPersonalGoal): Promise<PersonalGoal> {
    const [newGoal] = await db
      .insert(personalGoals)
      .values(goal)
      .returning();
    return newGoal;
  }

  async getUserGoals(userId: number): Promise<PersonalGoal[]> {
    return await db
      .select()
      .from(personalGoals)
      .where(eq(personalGoals.userId, userId))
      .orderBy(desc(personalGoals.createdAt));
  }

  async updateGoalProgress(goalId: number, progress: number): Promise<void> {
    await db
      .update(personalGoals)
      .set({ 
        currentProgress: progress
      })
      .where(eq(personalGoals.id, goalId));
  }

  async completeGoal(goalId: number): Promise<void> {
    await db
      .update(personalGoals)
      .set({ 
        completedAt: new Date(),
        isActive: false
      })
      .where(eq(personalGoals.id, goalId));
  }

  // Environmental Impact Implementation
  async getUserEnvironmentalImpact(userId: number): Promise<EnvironmentalImpact | undefined> {
    const [impact] = await db
      .select()
      .from(environmentalImpact)
      .where(eq(environmentalImpact.userId, userId));
    return impact || undefined;
  }

  async updateEnvironmentalImpact(userId: number, impact: Partial<InsertEnvironmentalImpact>): Promise<void> {
    await db
      .update(environmentalImpact)
      .set({
        ...impact,
        lastUpdated: new Date()
      })
      .where(eq(environmentalImpact.userId, userId));
  }

  // Smart Reminders Implementation
  async createUserReminder(reminder: Omit<UserReminder, 'id' | 'createdAt'>): Promise<UserReminder> {
    const [newReminder] = await db
      .insert(userReminders)
      .values(reminder)
      .returning();
    return newReminder;
  }

  async getUserReminders(userId: number): Promise<UserReminder[]> {
    return await db
      .select()
      .from(userReminders)
      .where(and(
        eq(userReminders.userId, userId),
        eq(userReminders.isActive, true)
      ));
  }

  async updateReminderSchedule(reminderId: number, nextScheduled: Date): Promise<void> {
    await db
      .update(userReminders)
      .set({ 
        nextScheduled,
        lastSent: new Date()
      })
      .where(eq(userReminders.id, reminderId));
  }

  // Habit Analytics Implementation
  async createHabitEntry(habit: InsertHabitAnalytics): Promise<HabitAnalytics> {
    const [newHabit] = await db
      .insert(habitAnalytics)
      .values(habit)
      .returning();
    return newHabit;
  }

  async getUserHabitData(userId: number, startDate?: Date, endDate?: Date): Promise<HabitAnalytics[]> {
    let query = db
      .select()
      .from(habitAnalytics)
      .where(eq(habitAnalytics.userId, userId));
    
    if (startDate && endDate) {
      return await db
        .select()
        .from(habitAnalytics)
        .where(
          and(
            eq(habitAnalytics.userId, userId),
            gte(habitAnalytics.date, startDate),
            lte(habitAnalytics.date, endDate)
          )
        )
        .orderBy(desc(habitAnalytics.date));
    }
    
    return await query.orderBy(desc(habitAnalytics.date));
  }

  async getHabitInsights(userId: number): Promise<{
    averageDaily: number;
    bestStreak: number;
    favoriteTime: string;
    weeklyPattern: Record<string, number>;
  }> {
    const habits = await this.getUserHabitData(userId);
    
    if (habits.length === 0) {
      return {
        averageDaily: 0,
        bestStreak: 0,
        favoriteTime: 'morning',
        weeklyPattern: {}
      };
    }

    // Calculate average daily detections
    const totalDetections = habits.reduce((sum, h) => sum + h.detectionsCount, 0);
    const averageDaily = Math.round(totalDetections / habits.length);

    // Calculate best streak (simplified)
    let currentStreak = 0;
    let bestStreak = 0;
    habits.reverse().forEach(habit => {
      if (habit.detectionsCount > 0) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    // Find favorite time
    const timeCount: Record<string, number> = {};
    habits.forEach(habit => {
      if (habit.favoriteTime) {
        timeCount[habit.favoriteTime] = (timeCount[habit.favoriteTime] || 0) + 1;
      }
    });
    const favoriteTime = Object.keys(timeCount).reduce((a, b) => 
      timeCount[a] > timeCount[b] ? a : b, 'morning'
    );

    // Weekly pattern (day of week)
    const weeklyPattern: Record<string, number> = {};
    habits.forEach(habit => {
      const dayOfWeek = new Date(habit.date).toLocaleDateString('en', { weekday: 'long' });
      weeklyPattern[dayOfWeek] = (weeklyPattern[dayOfWeek] || 0) + habit.detectionsCount;
    });

    return {
      averageDaily,
      bestStreak,
      favoriteTime,
      weeklyPattern
    };
  }

  // Anti-fraud methods implementation
  async getRecentDetections(userId: number, since: Date): Promise<Detection[]> {
    const result = await db
      .select()
      .from(detections)
      .where(and(eq(detections.userId, userId), gte(detections.createdAt, since)))
      .orderBy(desc(detections.createdAt));
    return result;
  }

  async getDetectionByImageHash(imageHash: string): Promise<Detection | undefined> {
    const result = await db
      .select()
      .from(detections)
      .where(eq(detections.imageHash, imageHash))
      .limit(1);
    return result[0];
  }

  async getRecentSameItemDetections(userId: number, itemName: string, since: Date): Promise<Detection[]> {
    const result = await db
      .select()
      .from(detections)
      .where(and(
        eq(detections.userId, userId),
        gte(detections.createdAt, since),
        sql`${detections.detectedObjects}::text LIKE ${'%' + itemName + '%'}`
      ))
      .orderBy(desc(detections.createdAt));
    return result;
  }

  async incrementUserStats(userId: number, increments: {
    totalDetections?: number;
    totalCoinsEarned?: number;
    plasticItemsDetected?: number;
    paperItemsDetected?: number;
    glassItemsDetected?: number;
    metalItemsDetected?: number;
  }): Promise<void> {
    // First, try to get existing stats
    let existingStats = await this.getUserStats(userId);
    
    if (!existingStats) {
      // Create new stats record if none exists
      await db.insert(stats).values({
        userId: userId,
        totalDetections: increments.totalDetections || 0,
        totalCoinsEarned: increments.totalCoinsEarned || 0,
        totalCoinsSpent: 0,
        streakDays: 1,
        plasticItemsDetected: increments.plasticItemsDetected || 0,
        paperItemsDetected: increments.paperItemsDetected || 0,
        glassItemsDetected: increments.glassItemsDetected || 0,
        metalItemsDetected: increments.metalItemsDetected || 0
      });
    } else {
      // Update existing stats
      const updates: any = {};
      if (increments.totalDetections) {
        updates.totalDetections = sql`${stats.totalDetections} + ${increments.totalDetections}`;
      }
      if (increments.totalCoinsEarned) {
        updates.totalCoinsEarned = sql`${stats.totalCoinsEarned} + ${increments.totalCoinsEarned}`;
      }
      if (increments.plasticItemsDetected) {
        updates.plasticItemsDetected = sql`${stats.plasticItemsDetected} + ${increments.plasticItemsDetected}`;
      }
      if (increments.paperItemsDetected) {
        updates.paperItemsDetected = sql`${stats.paperItemsDetected} + ${increments.paperItemsDetected}`;
      }
      if (increments.glassItemsDetected) {
        updates.glassItemsDetected = sql`${stats.glassItemsDetected} + ${increments.glassItemsDetected}`;
      }
      if (increments.metalItemsDetected) {
        updates.metalItemsDetected = sql`${stats.metalItemsDetected} + ${increments.metalItemsDetected}`;
      }

      if (Object.keys(updates).length > 0) {
        await db.update(stats)
          .set(updates)
          .where(eq(stats.userId, userId));
      }
    }
  }

  async updateUser(userId: number, updates: Partial<User>): Promise<User> {
    const result = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();
    
    if (!result[0]) {
      throw new Error('User not found');
    }
    
    return result[0];
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
