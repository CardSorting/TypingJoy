/** [LAYER: CORE] */
// Dashboard stats server action — gathers and computes aggregate statistics.

"use server";

import { db } from "@/src/infrastructure/db";
import type { DashboardStats } from "@/src/domain/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const sessions = await db.typingSession.findMany({
    select: { wpm: true, accuracy: true },
  });

  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      bestWpm: 0,
    };
  }

  const totalWpm = sessions.reduce((sum: number, s: { wpm: number; accuracy: number }) => sum + s.wpm, 0);
  const totalAccuracy = sessions.reduce((sum: number, s: { wpm: number; accuracy: number }) => sum + s.accuracy, 0);
  const bestWpm = Math.max(...sessions.map((s: { wpm: number }) => s.wpm));

  return {
    totalSessions: sessions.length,
    averageWpm: Math.round((totalWpm / sessions.length) * 10) / 10,
    averageAccuracy: Math.round((totalAccuracy / sessions.length) * 10) / 10,
    bestWpm: Math.round(bestWpm * 10) / 10,
  };
}