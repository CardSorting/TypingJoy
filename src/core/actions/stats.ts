/** [LAYER: CORE] */
// Dashboard stats server action — gathers and computes aggregate statistics.

"use server";

import { db } from "@/src/infrastructure/db";
import {
  getWeakKeyAdviceFromTexts,
} from "@/src/domain/calculations";
import type {
  DashboardStats,
  LearningRecommendation,
  RecentTrend,
} from "@/src/domain/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  // Fetch typing sessions
  const sessions = await db.typingSession.findMany({
    orderBy: { completedAt: "desc" },
    include: {
      lesson: { select: { id: true, title: true, focus: true } },
      customText: { select: { id: true, title: true } },
    },
  });

  // Fetch all lessons to compute focus area totals
  const allLessons = await db.lesson.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      focus: true,
    },
  });

  // 1. Initialize empty focus mastery groups
  const masteryGroups: Record<string, { passed: Set<string>; total: Set<string> }> = {};
  allLessons.forEach((l) => {
    if (!masteryGroups[l.focus]) {
      masteryGroups[l.focus] = { passed: new Set(), total: new Set() };
    }
    masteryGroups[l.focus].total.add(l.id);
  });

  if (sessions.length === 0) {
    const focusMastery = Object.entries(masteryGroups).map(([category, info]) => ({
      category,
      passedCount: 0,
      totalCount: info.total.size,
    }));
    const consistencyDays = getLastSevenConsistencyDays([]);
    const firstLesson = allLessons[0];

    return {
      totalSessions: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      bestWpm: 0,
      recentTrendWpm: 0,
      recentAccuracyTrend: 0,
      recentTrend: {
        label: "Ready to begin",
        detail: "Complete one short practice session and TypingJoy will start showing real guidance from your results.",
        tone: "steady",
      },
      bestSession: null,
      focusMastery,
      consistencyDaysCount: 0,
      consistencyDays,
      weakKeyAdvice: [],
      learningRecommendation:
        firstLesson
          ? {
              title: firstLesson.title,
              reason: "Start with the first structured lesson so your fingers can learn the home-row rhythm.",
              href: `/practice/${firstLesson.id}`,
              actionLabel: "Start first lesson",
            }
          : null,
    };
  }

  // Calculate basic aggregate metrics
  const totalWpm = sessions.reduce((sum, s) => sum + s.wpm, 0);
  const totalAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0);
  const bestWpm = Math.max(...sessions.map((s) => s.wpm));

  // 2. Calculate WPM Trend (last 5 sessions vs all older sessions)
  let recentTrendWpm = 0;
  let recentAccuracyTrend = 0;
  if (sessions.length >= 2) {
    const half = Math.min(5, Math.floor(sessions.length / 2) || 1);
    const recent = sessions.slice(0, half);
    const older = sessions.slice(half);

    const recentAvg = recent.reduce((sum, s) => sum + s.wpm, 0) / recent.length;
    const olderAvg = older.reduce((sum, s) => sum + s.wpm, 0) / older.length;
    const recentAccuracyAvg =
      recent.reduce((sum, s) => sum + s.accuracy, 0) / recent.length;
    const olderAccuracyAvg =
      older.reduce((sum, s) => sum + s.accuracy, 0) / older.length;
    recentTrendWpm = Math.round((recentAvg - olderAvg) * 10) / 10;
    recentAccuracyTrend = Math.round((recentAccuracyAvg - olderAccuracyAvg) * 10) / 10;
  }

  let recentTrend: RecentTrend = {
    label: "Steady practice",
    detail: "Your recent sessions are giving your hands useful repetition. Keep accuracy first.",
    tone: "steady",
  };

  if (recentAccuracyTrend < -3) {
    recentTrend = {
      label: "Accuracy needs a gentler pace",
      detail: "Your recent accuracy has dipped. Repeat a familiar lesson slowly before adding speed.",
      tone: "accuracy",
    };
  } else if (recentTrendWpm > 1.5 && recentAccuracyTrend >= -1) {
    recentTrend = {
      label: "Rhythm is improving",
      detail: `Your recent speed is up ${recentTrendWpm} WPM while accuracy is holding steady.`,
      tone: "improving",
    };
  } else if (recentTrendWpm < -1.5) {
    recentTrend = {
      label: "Slow practice is useful",
      detail: "A slower week can still be productive when your fingers are learning cleaner reaches.",
      tone: "speed",
    };
  }

  // 3. Identify the Best Session (accuracy >= 90% and highest WPM)
  const passedSessions = sessions.filter((s) => s.accuracy >= 90.0);
  let bestSession = null;
  if (passedSessions.length > 0) {
    const top = [...passedSessions].sort((a, b) => b.wpm - a.wpm)[0];
    bestSession = {
      wpm: Math.round(top.wpm * 10) / 10,
      accuracy: Math.round(top.accuracy * 10) / 10,
      completedAt: top.completedAt,
      title: top.lesson?.title || top.customText?.title || "Custom Text",
    };
  }

  // 4. Compute Category/Focus Mastery Progress
  sessions.forEach((s) => {
    if (s.lessonId && s.accuracy >= 90.0 && s.lesson) {
      const focus = s.lesson.focus;
      if (!masteryGroups[focus]) {
        masteryGroups[focus] = { passed: new Set(), total: new Set() };
      }
      masteryGroups[focus].passed.add(s.lessonId);
      masteryGroups[focus].total.add(s.lessonId);
    }
  });

  const focusMastery = Object.entries(masteryGroups).map(([category, info]) => ({
    category,
    passedCount: info.passed.size,
    totalCount: info.total.size,
  }));

  // 5. Calculate consistency rating (active practice days in last 7 days)
  const consistencyDays = getLastSevenConsistencyDays(
    sessions.map((session) => session.completedAt),
  );
  const consistencyDaysCount = consistencyDays.filter((day) => day.practiced).length;

  // 6. Calculate tactile character-level mistake advice from the last 10 sessions
  const lastTen = sessions.slice(0, 10);
  const weakKeyAdvice = getWeakKeyAdviceFromTexts(lastTen, 3);

  const completedLessonIds = new Set(
    sessions
      .filter((session) => session.lessonId && session.accuracy >= 90)
      .map((session) => session.lessonId),
  );
  const latestSession = sessions[0];
  const recentThree = sessions.slice(0, 3);
  const recentAverageAccuracy =
    recentThree.reduce((sum, session) => sum + session.accuracy, 0) /
    recentThree.length;
  const recentAverageWpm =
    recentThree.reduce((sum, session) => sum + session.wpm, 0) /
    recentThree.length;

  const firstUncompleted = allLessons.find(
    (lesson) => !completedLessonIds.has(lesson.id),
  );
  const repeatedWeakRegion = weakKeyAdvice[0]?.region.toLowerCase() || "";
  const regionLesson = allLessons.find(
    (lesson) =>
      lesson.focus !== "mixed" &&
      repeatedWeakRegion.includes(lesson.focus.replace("-", " ")) &&
      !completedLessonIds.has(lesson.id),
  );

  let learningRecommendation: LearningRecommendation | null = null;

  if (latestSession.lessonId && latestSession.accuracy < 90 && latestSession.lesson) {
    learningRecommendation = {
      title: latestSession.lesson.title,
      reason: "Repeat this lesson slowly to strengthen accuracy before adding speed.",
      href: `/practice/${latestSession.lessonId}`,
      actionLabel: "Repeat lesson",
    };
  } else if (recentAverageAccuracy < 85 && latestSession.lessonId && latestSession.lesson) {
    learningRecommendation = {
      title: latestSession.lesson.title,
      reason: "Your recent accuracy suggests a familiar text will be most useful today.",
      href: `/practice/${latestSession.lessonId}`,
      actionLabel: "Practice accuracy",
    };
  } else if (regionLesson) {
    learningRecommendation = {
      title: regionLesson.title,
      reason: `Your recent misses point toward ${regionLesson.focus.replace("-", " ")} practice.`,
      href: `/practice/${regionLesson.id}`,
      actionLabel: "Practice this focus",
    };
  } else if (recentAverageAccuracy >= 95 && recentAverageWpm < 20 && firstUncompleted) {
    learningRecommendation = {
      title: firstUncompleted.title,
      reason: "Your accuracy is strong. A fresh lesson can gently build rhythm and speed.",
      href: `/practice/${firstUncompleted.id}`,
      actionLabel: "Continue sequence",
    };
  } else if (firstUncompleted) {
    learningRecommendation = {
      title: firstUncompleted.title,
      reason: "This is the next structured lesson that has not yet been passed.",
      href: `/practice/${firstUncompleted.id}`,
      actionLabel: "Start next lesson",
    };
  } else {
    learningRecommendation = {
      title: "Custom practice",
      reason: "You have passed the current lesson set. Use custom text to practice real words at a comfortable pace.",
      href: "/custom-texts",
      actionLabel: "Choose custom text",
    };
  }

  return {
    totalSessions: sessions.length,
    averageWpm: Math.round((totalWpm / sessions.length) * 10) / 10,
    averageAccuracy: Math.round((totalAccuracy / sessions.length) * 10) / 10,
    bestWpm: Math.round(bestWpm * 10) / 10,
    recentTrendWpm,
    recentAccuracyTrend,
    recentTrend,
    bestSession,
    focusMastery,
    consistencyDaysCount,
    consistencyDays,
    weakKeyAdvice,
    learningRecommendation,
  };
}

function getLastSevenConsistencyDays(completedDates: Date[]) {
  const sessionDates = new Set(
    completedDates.map((completedAt) => new Date(completedAt).toDateString()),
  );

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dateLabel = date.toDateString();

    return {
      dateLabel,
      dayLabel: date.toLocaleDateString("en-US", { weekday: "narrow" }),
      practiced: sessionDates.has(dateLabel),
    };
  });
}
