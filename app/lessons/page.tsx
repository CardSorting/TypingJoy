/**
 * [LAYER: UI]
 * LessonsPage — Structured curriculum path.
 * Groups lessons into distinct academic Units, rendering them along a visual
 * learning path with progress seals (Gold, Silver, Bronze) based on performance.
 */

import Link from "next/link";
import { db } from "@/src/infrastructure/db";
import AppLayout from "@/src/ui/components/AppLayout";

export const dynamic = "force-dynamic";



interface LessonWithProgress {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  focus: string;
  estimatedMinutes: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  bestWpm: number;
  bestAccuracy: number;
  unlocked: boolean;
}

export default async function LessonsPage() {
  // 1. Fetch lessons in sequential order (createdAt ascending)
  const allLessons = await db.lesson.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { sessions: true } } },
  });

  // 2. Fetch all typing sessions to determine progress
  const sessions = await db.typingSession.findMany({
    select: {
      lessonId: true,
      accuracy: true,
      wpm: true,
      completedAt: true,
    },
  });

  // Map lessonId to its typing sessions
  const sessionsMap: Record<string, typeof sessions> = {};
  sessions.forEach((s) => {
    if (s.lessonId) {
      if (!sessionsMap[s.lessonId]) {
        sessionsMap[s.lessonId] = [];
      }
      sessionsMap[s.lessonId].push(s);
    }
  });

  // 3. Compute completion status, best scores, and locked/unlocked state
  const lessonsWithProgress: LessonWithProgress[] = allLessons.map((lesson) => {
    const lessonSessions = sessionsMap[lesson.id] || [];
    const completed = lessonSessions.some((s) => s.accuracy >= 90.0);
    const bestWpm = lessonSessions.length > 0 ? Math.max(...lessonSessions.map((s) => s.wpm)) : 0;
    const bestAccuracy =
      lessonSessions.length > 0 ? Math.max(...lessonSessions.map((s) => s.accuracy)) : 0;

    return {
      ...lesson,
      completed,
      bestWpm,
      bestAccuracy,
      unlocked: false,
    };
  });

  // Set unlocked status sequentially (a lesson is unlocked if the previous one is completed)
  lessonsWithProgress.forEach((lesson, index) => {
    if (index === 0) {
      lesson.unlocked = true;
    } else {
      lesson.unlocked = lessonsWithProgress[index - 1].completed;
    }
  });

  // 4. Calculate recommended next lesson
  let recommendedLesson: LessonWithProgress | null = null;
  let recommendationReason = "";

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  );
  const lastSession = sortedSessions[0];

  if (lastSession && lastSession.lessonId && lastSession.accuracy < 90) {
    recommendedLesson = lessonsWithProgress.find((l) => l.id === lastSession.lessonId) || null;
    recommendationReason = "Repeat practice recommended to build accuracy (aim for 90%+)";
  } else {
    const firstUncompleted = lessonsWithProgress.find((l) => !l.completed);
    if (firstUncompleted) {
      recommendedLesson = firstUncompleted;
      recommendationReason = firstUncompleted.unlocked
        ? "Recommended next step in your progression"
        : "Complete previous lessons to unlock";
    } else if (lessonsWithProgress.length > 0) {
      const sortedBySpeed = [...lessonsWithProgress].sort((a, b) => a.bestWpm - b.bestWpm);
      recommendedLesson = sortedBySpeed[0];
      recommendationReason = "All lessons passed! Practice your slowest one to build speed.";
    }
  }

  // 5. Define curriculum units
  const units = [
    {
      id: "foundations",
      title: "Unit 1: Foundations",
      description: "Establish your anchor point. Learn to rest and return to the home keys.",
      lessons: lessonsWithProgress.filter((l) => l.focus === "home-row"),
    },
    {
      id: "reach-rhythm",
      title: "Unit 2: Reach & Rhythm",
      description: "Extend fingers upward to the top row keys and return home with control.",
      lessons: lessonsWithProgress.filter((l) => l.focus === "top-row"),
    },
    {
      id: "precision-practice",
      title: "Unit 3: Precision Practice",
      description: "Extend fingers downward to the bottom row keys without wrist rotation.",
      lessons: lessonsWithProgress.filter((l) => l.focus === "bottom-row"),
    },
    {
      id: "numbers-symbols",
      title: "Unit 4: Numbers & Symbols",
      description: "Tackling digit shifts, symbols, and double-handed key combinations.",
      lessons: lessonsWithProgress.filter((l) => l.focus === "numbers" || l.focus === "symbols"),
    },
    {
      id: "speed-flow",
      title: "Unit 5: Speed & Flow",
      description: "Practice typing full sentences and building real typing consistency.",
      lessons: lessonsWithProgress.filter((l) => l.focus === "mixed").slice(0, 2),
    },
    {
      id: "longform-confidence",
      title: "Unit 6: Longform Confidence",
      description: "Develop steady flow over longer paragraphs and real-world texts.",
      lessons: lessonsWithProgress.filter((l) => l.focus === "mixed").slice(2),
    },
  ];

  // Helper to determine accuracy seal badges
  const renderSealBadge = (bestAccuracy: number) => {
    if (bestAccuracy >= 98.0) {
      return (
        <span
          className="inline-flex items-center gap-1 bg-amber-100 border border-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs"
          title="Passed with High Precision (98%+)"
        >
          🌟 Gold Seal
        </span>
      );
    }
    if (bestAccuracy >= 95.0) {
      return (
        <span
          className="inline-flex items-center gap-1 bg-stone-100 border border-stone-300 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs"
          title="Passed with Steady Accuracy (95%+)"
        >
          ✨ Silver Seal
        </span>
      );
    }
    if (bestAccuracy >= 90.0) {
      return (
        <span
          className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs"
          title="Passed (90%+)"
        >
          📜 Bronze Seal
        </span>
      );
    }
    return null;
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-800">⌨️ Curriculum Path</h1>
            <p className="text-xs text-stone-500 mt-1">
              Step-by-step touch-typing milestones. Complete with 90% accuracy to progress!
            </p>
          </div>
          <Link href="/lessons/new" className="warm-button text-xs py-2 px-4 self-start sm:self-auto">
            + Create Lesson
          </Link>
        </div>

        {/* Recommended Lesson Box & Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 warm-card p-5 border-amber-200 bg-amber-50/10 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-amber-800 mb-2">🎓 Touch-Typing Rules</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600 leading-relaxed">
                <div>
                  <p className="font-semibold text-stone-700">1. Fingers on Anchor bumps</p>
                  <p>Feel the tactile ridges on the F and J keys with your index fingers.</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-700">2. Keep wrists floating</p>
                  <p>Resting your wrists cuts off your finger reach. Let your hands drift gently.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-amber-200/30 text-xs">
              <span className="text-stone-500">Need posture checks or finger-mapping visualizers?</span>
              <Link href="/classroom-guide" className="text-amber-700 hover:text-amber-800 font-bold underline">
                Open Student Manual →
              </Link>
            </div>
          </div>

          {/* Next Recommended Practicing box */}
          {recommendedLesson ? (
            <div className="warm-card p-5 border-amber-400 bg-amber-50/30 flex flex-col justify-between relative overflow-hidden">
              <span className="absolute top-0 right-0 bg-amber-600 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-bl">
                Next Target
              </span>
              <div>
                <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">
                  Recommended Goal
                </span>
                <h3 className="font-bold text-stone-800 text-sm mt-1 mb-1">
                  {recommendedLesson.title}
                </h3>
                <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                  {recommendationReason}
                </p>
              </div>
              <Link
                href={`/practice/${recommendedLesson.id}`}
                className="warm-button text-center w-full block text-xs mt-3 py-2"
              >
                Start Practice →
              </Link>
            </div>
          ) : (
            <div className="warm-card p-5 flex items-center justify-center text-stone-400 text-xs italic">
              No lessons loaded. Seed the database to get started.
            </div>
          )}
        </div>

        {/* Curriculum Units visual pathways */}
        <div className="space-y-10 relative">
          {/* Visual connecting timeline line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-amber-200/50 hidden md:block" />

          {units.map((unit, uIdx) => {
            // Find lessons corresponding to this unit
            const unitLessons = unit.lessons;

            // Skip rendering empty units (unless it is the first unit, keeping it for visual consistency)
            if (unitLessons.length === 0 && uIdx > 0) return null;

            // Calculate unit-specific metrics
            const passedCount = unitLessons.filter((l) => l.completed).length;
            const bestUnitAccuracy = unitLessons.length > 0 
              ? Math.max(...unitLessons.map((l) => l.bestAccuracy)) 
              : 0;
            const nextLessonInUnit = unitLessons.find((l) => !l.completed);

            return (
              <div key={unit.id} className="relative flex flex-col md:flex-row gap-6 md:pl-12">
                {/* Unit timeline node dot */}
                <div className="absolute left-4 top-1.5 w-4 h-4 rounded-full border-4 border-[#faf8f5] bg-amber-600 hidden md:block" />

                {/* Unit Info Left Sidebar Card */}
                <div className="md:w-64 flex-shrink-0">
                  <div className="warm-card p-4 bg-amber-50/5 border-amber-200/50 shadow-xs space-y-3">
                    <h3 className="font-serif-academy text-base font-bold text-stone-900 leading-tight">
                      {unit.title}
                    </h3>
                    <p className="text-[10px] text-stone-500 leading-relaxed">{unit.description}</p>
                    
                    <div className="border-t border-stone-100/80 pt-2.5 space-y-1.5 text-[10px] text-stone-600">
                      <div className="flex justify-between">
                        <span>Total Lessons:</span>
                        <strong className="font-mono">{unitLessons.length}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Passed Units:</span>
                        <strong className="font-mono text-emerald-800">{passedCount}/{unitLessons.length}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Best Accuracy:</span>
                        <strong className="font-mono text-stone-800">
                          {bestUnitAccuracy > 0 ? `${bestUnitAccuracy}%` : "-"}
                        </strong>
                      </div>
                      
                      {nextLessonInUnit && (
                        <div className="border-t border-stone-100/80 pt-2 mt-1">
                          <span className="text-stone-400 font-bold block uppercase tracking-wider text-[8px]">
                            Recommended Reach:
                          </span>
                          <Link
                            href={nextLessonInUnit.unlocked ? `/practice/${nextLessonInUnit.id}` : "#"}
                            className={`block truncate font-bold mt-0.5 text-[11px] ${
                              nextLessonInUnit.unlocked 
                                ? "text-amber-700 hover:text-amber-800 hover:underline" 
                                : "text-stone-400 cursor-not-allowed"
                            }`}
                          >
                            {nextLessonInUnit.unlocked ? "🔑" : "🔒"} {nextLessonInUnit.title}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Unit lessons pathway list */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {unitLessons.length === 0 ? (
                    <div className="col-span-2 text-stone-400 text-xs italic py-4 border border-dashed border-stone-200 rounded-lg text-center bg-white/40">
                      No lessons added to this unit.
                    </div>
                  ) : (
                    unitLessons.map((lesson) => {
                      const isSelectable = lesson.unlocked;

                      return (
                        <div
                          key={lesson.id}
                          className={`relative warm-card p-5 flex flex-col justify-between border transition-all duration-200 ${
                            !isSelectable
                              ? "opacity-60 border-stone-200 bg-stone-50/50 select-none"
                              : "border-amber-200/40 bg-white hover:border-amber-300 hover:shadow-md"
                          }`}
                        >
                          <div>
                            {/* Card badge indicators */}
                            <div className="flex justify-between items-center mb-2 gap-2">
                              <span
                                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                  lesson.difficulty === "beginner"
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : lesson.difficulty === "intermediate"
                                      ? "bg-amber-50 border-amber-200 text-amber-700"
                                      : "bg-red-50 border-red-200 text-red-700"
                                }`}
                              >
                                {lesson.difficulty}
                              </span>

                              <div className="flex items-center gap-1.5">
                                {lesson.completed ? (
                                  renderSealBadge(lesson.bestAccuracy)
                                ) : !isSelectable ? (
                                  <span className="text-stone-400 text-[10px] font-bold flex items-center gap-0.5">
                                    🔒 Locked
                                  </span>
                                ) : (
                                  <span className="text-amber-600 text-[10px] font-bold flex items-center gap-0.5">
                                    🔑 Ready
                                  </span>
                                )}
                              </div>
                            </div>

                            <h4 className="font-bold text-stone-800 text-sm mb-1">
                              {lesson.title}
                            </h4>
                            <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed mb-4">
                              {lesson.description}
                            </p>
                          </div>

                          <div className="border-t border-stone-100 pt-3 mt-3">
                            <div className="flex items-center justify-between text-[10px] text-stone-400 mb-3">
                              <span className="capitalize">🎯 {lesson.focus.replace("-", " ")}</span>
                              <span>⏱️ {lesson.estimatedMinutes} min</span>
                            </div>

                            {lesson.bestWpm > 0 && (
                              <div className="bg-stone-50 rounded p-1.5 mb-3 text-[10px] text-stone-500 flex justify-between font-mono">
                                <span>Speed: <strong>{lesson.bestWpm} WPM</strong></span>
                                <span>Acc: <strong>{lesson.bestAccuracy}%</strong></span>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-2 gap-3">
                              {isSelectable ? (
                                <Link
                                  href={`/practice/${lesson.id}`}
                                  className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow-xs transition"
                                >
                                  Start Practice
                                </Link>
                              ) : (
                                <span className="text-[10px] text-stone-400 font-medium">
                                  Complete prior lessons first
                                </span>
                              )}

                              <Link
                                href={`/lessons/${lesson.id}`}
                                className="text-[10px] text-amber-700 hover:underline font-semibold"
                              >
                                Edit Reach
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
