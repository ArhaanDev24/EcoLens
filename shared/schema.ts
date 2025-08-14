import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firebaseUid: text("firebase_uid").unique(),
  greenCoins: integer("green_coins").notNull().default(0),
  totalEarned: integer("total_earned").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const detections = pgTable("detections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  imageUrl: text("image_url"),
  imageHash: text("image_hash"), // SHA-256 hash for duplicate prevention
  detectedObjects: jsonb("detected_objects"),
  confidenceScore: integer("confidence_score"),
  coinsEarned: integer("coins_earned").notNull().default(0),
  isVerified: boolean("is_verified").notNull().default(false),
  verificationImageUrl: text("verification_image_url"),
  verificationStatus: text("verification_status").default("pending"), // 'pending', 'verified', 'rejected'
  verificationAttempts: integer("verification_attempts").notNull().default(0),
  fraudScore: integer("fraud_score").notNull().default(0), // 0-100 fraud risk score
  ipAddress: text("ip_address"), // User's IP for tracking
  userAgent: text("user_agent"), // Browser fingerprint
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // 'earn' or 'spend'
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  detectionId: integer("detection_id").references(() => detections.id),
  qrCode: text("qr_code"),
  metadata: jsonb("metadata"), // Additional transaction metadata
  createdAt: timestamp("created_at").defaultNow(),
});

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  totalDetections: integer("total_detections").notNull().default(0),
  totalCoinsEarned: integer("total_coins_earned").notNull().default(0),
  totalCoinsSpent: integer("total_coins_spent").notNull().default(0),
  favoriteItemType: text("favorite_item_type"),
  streakDays: integer("streak_days").notNull().default(0),
  lastDetectionDate: timestamp("last_detection_date"),
  plasticItemsDetected: integer("plastic_items_detected").notNull().default(0),
  paperItemsDetected: integer("paper_items_detected").notNull().default(0),
  glassItemsDetected: integer("glass_items_detected").notNull().default(0),
  metalItemsDetected: integer("metal_items_detected").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  achievementType: text("achievement_type").notNull(), // 'first_detection', 'streak_7', 'coins_100', etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconType: text("icon_type").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Personal Goals System
export const personalGoals = pgTable("personal_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  goalType: text("goal_type").notNull(), // 'daily', 'weekly', 'monthly', 'custom'
  targetType: text("target_type").notNull(), // 'detections', 'coins', 'items', 'streak'
  targetValue: integer("target_value").notNull(),
  currentProgress: integer("current_progress").notNull().default(0),
  title: text("title").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Environmental Impact Tracking
export const environmentalImpact = pgTable("environmental_impact", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  totalCO2Saved: integer("total_co2_saved").notNull().default(0), // in grams
  totalWaterSaved: integer("total_water_saved").notNull().default(0), // in ml
  totalEnergySaved: integer("total_energy_saved").notNull().default(0), // in wh
  treesSaved: integer("trees_saved").notNull().default(0), // equivalent trees
  landfillDiverted: integer("landfill_diverted").notNull().default(0), // in grams
  recyclingScore: integer("recycling_score").notNull().default(0), // 0-1000 scale
  weeklyImpactData: jsonb("weekly_impact_data"), // {week: "2025-01", co2: 100, water: 500, ...}
  monthlyImpactData: jsonb("monthly_impact_data"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Smart Reminders & Notifications
export const userReminders = pgTable("user_reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  reminderType: text("reminder_type").notNull(), // 'recycling', 'goal', 'streak', 'achievement'
  frequency: text("frequency").notNull(), // 'daily', 'weekly', 'custom'
  message: text("message").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  lastSent: timestamp("last_sent"),
  nextScheduled: timestamp("next_scheduled"),
  customSchedule: jsonb("custom_schedule"), // for complex scheduling
  createdAt: timestamp("created_at").defaultNow(),
});

// Habit Tracking & Analytics
export const habitAnalytics = pgTable("habit_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  date: timestamp("date").notNull(),
  detectionsCount: integer("detections_count").notNull().default(0),
  coinsEarned: integer("coins_earned").notNull().default(0),
  timeSpentMinutes: integer("time_spent_minutes").notNull().default(0),
  favoriteTime: text("favorite_time"), // 'morning', 'afternoon', 'evening', 'night'
  locationData: jsonb("location_data"), // anonymized location patterns
  itemTypes: jsonb("item_types"), // {plastic: 3, paper: 2, glass: 1}
  moodRating: integer("mood_rating"), // 1-5 scale for recycling satisfaction
  notes: text("notes"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  firebaseUid: true,
});

export const insertDetectionSchema = createInsertSchema(detections).pick({
  userId: true,
  imageUrl: true,
  imageHash: true,
  detectedObjects: true,
  confidenceScore: true,
  coinsEarned: true,
  isVerified: true,
  verificationImageUrl: true,
  verificationStatus: true,
  verificationAttempts: true,
  fraudScore: true,
  ipAddress: true,
  userAgent: true,
});

export const insertPersonalGoalSchema = createInsertSchema(personalGoals).pick({
  userId: true,
  goalType: true,
  targetType: true,
  targetValue: true,
  title: true,
  description: true,
  endDate: true,
}).extend({
  endDate: z.string().nullable().transform(val => val ? new Date(val) : null)
});

export const insertEnvironmentalImpactSchema = createInsertSchema(environmentalImpact).pick({
  userId: true,
  totalCO2Saved: true,
  totalWaterSaved: true,
  totalEnergySaved: true,
  treesSaved: true,
  landfillDiverted: true,
  recyclingScore: true,
});

export const insertHabitAnalyticsSchema = createInsertSchema(habitAnalytics).pick({
  userId: true,
  date: true,
  detectionsCount: true,
  coinsEarned: true,
  timeSpentMinutes: true,
  favoriteTime: true,
  itemTypes: true,
  moodRating: true,
  notes: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type Detection = typeof detections.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Stats = typeof stats.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type PersonalGoal = typeof personalGoals.$inferSelect;
export type EnvironmentalImpact = typeof environmentalImpact.$inferSelect;
export type UserReminder = typeof userReminders.$inferSelect;
export type HabitAnalytics = typeof habitAnalytics.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertDetection = z.infer<typeof insertDetectionSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertStats = z.infer<typeof insertStatsSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertPersonalGoal = z.infer<typeof insertPersonalGoalSchema>;
export type InsertEnvironmentalImpact = z.infer<typeof insertEnvironmentalImpactSchema>;
export type InsertHabitAnalytics = z.infer<typeof insertHabitAnalyticsSchema>;

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  amount: true,
  description: true,
  detectionId: true,
  qrCode: true,
  metadata: true,
});

export const insertStatsSchema = createInsertSchema(stats).pick({
  userId: true,
  totalDetections: true,
  totalCoinsEarned: true,
  totalCoinsSpent: true,
  favoriteItemType: true,
  streakDays: true,
  lastDetectionDate: true,
  plasticItemsDetected: true,
  paperItemsDetected: true,
  glassItemsDetected: true,
  metalItemsDetected: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  achievementType: true,
  title: true,
  description: true,
  iconType: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertStats = z.infer<typeof insertStatsSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;