/** [LAYER: DOMAIN] */
// Pure Zod schemas and types — zero I/O, zero side effects.

import { z } from "zod";

// ─── Difficulty & Focus enums ─────────────────────────────

export const Difficulty = z.enum(["beginner", "intermediate", "advanced"]);
export type Difficulty = z.infer<typeof Difficulty>;

export const Focus = z.enum([
  "home-row",
  "top-row",
  "bottom-row",
  "numbers",
  "symbols",
  "mixed",
]);
export type Focus = z.infer<typeof Focus>;

// ─── Lesson ───────────────────────────────────────────────

export const LessonSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  difficulty: Difficulty,
  focus: Focus,
  content: z.string().min(1, "Content is required"),
  estimatedMinutes: z.number().int().positive("Must be at least 1 minute"),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Lesson = z.infer<typeof LessonSchema>;

export const CreateLessonInput = LessonSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateLessonInput = z.infer<typeof CreateLessonInput>;

export const UpdateLessonInput = CreateLessonInput.partial();
export type UpdateLessonInput = z.infer<typeof UpdateLessonInput>;

// ─── TypingSession ────────────────────────────────────────

export const TypingSessionSchema = z.object({
  id: z.string(),
  lessonId: z.string().optional(),
  customTextId: z.string().optional(),
  typedText: z.string(),
  targetText: z.string(),
  wpm: z.number().nonnegative(),
  accuracy: z.number().min(0).max(100),
  mistakes: z.number().int().nonnegative(),
  durationSeconds: z.number().int().positive(),
  completedAt: z.date(),
});
export type TypingSession = z.infer<typeof TypingSessionSchema>;

export const CreateSessionInput = TypingSessionSchema.omit({
  id: true,
  completedAt: true,
});
export type CreateSessionInput = z.infer<typeof CreateSessionInput>;

// ─── CustomPracticeText ───────────────────────────────────

export const CustomPracticeTextSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body text is required"),
  tags: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type CustomPracticeText = z.infer<typeof CustomPracticeTextSchema>;

export const CreateCustomTextInput = CustomPracticeTextSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateCustomTextInput = z.infer<typeof CreateCustomTextInput>;

export const UpdateCustomTextInput = CreateCustomTextInput.partial();
export type UpdateCustomTextInput = z.infer<typeof UpdateCustomTextInput>;

// ─── Dashboard Stats (derived) ────────────────────────────

export interface FocusMastery {
  category: string;
  passedCount: number;
  totalCount: number;
}

export interface BestSessionInfo {
  wpm: number;
  accuracy: number;
  completedAt: Date;
  title: string;
}

export interface WeakKeyAdvice {
  key: string;
  count: number;
  finger: string;
  region: string;
  advice: string;
}

export interface AccuracyDriftInfo {
  oldestAvg: number;
  recentAvg: number;
  drift: number;
  message: string;
}

export interface ConfusionZoneInfo {
  expected: string;
  typed: string;
  count: number;
  advice: string;
}

export interface KeyboardRegionWeakness {
  region: string;
  count: number;
  percentage: number;
  advice: string;
}

export interface ConsistencyTrendInfo {
  message: string;
  variance: number;
}

export interface LearningRecommendation {
  title: string;
  reason: string;
  href: string;
  actionLabel: string;
}

export interface RecentTrend {
  label: string;
  detail: string;
  tone: "steady" | "improving" | "accuracy" | "speed";
}

export interface ConsistencyDay {
  dateLabel: string;
  dayLabel: string;
  practiced: boolean;
}

export interface DashboardStats {
  totalSessions: number;
  averageWpm: number;
  averageAccuracy: number;
  bestWpm: number;
  recentTrendWpm: number;
  recentAccuracyTrend: number;
  recentTrend: RecentTrend;
  bestSession: BestSessionInfo | null;
  focusMastery: FocusMastery[];
  consistencyDaysCount: number;
  consistencyDays: ConsistencyDay[];
  weakKeyAdvice: WeakKeyAdvice[];
  learningRecommendation: LearningRecommendation | null;
  accuracyDrift: AccuracyDriftInfo | null;
  confusionZones: ConfusionZoneInfo[];
  regionWeakness: KeyboardRegionWeakness | null;
  consistencyTrend: ConsistencyTrendInfo | null;
}
