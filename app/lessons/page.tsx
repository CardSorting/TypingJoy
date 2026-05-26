/**
 * [LAYER: INFRASTRUCTURE]
 * LessonsPage — Structured lesson progression, filtering, and educational guidance.
 */

import Link from 'next/link';
import { db } from '@/src/infrastructure/db';

export const dynamic = 'force-dynamic';

interface LessonsPageProps {
  searchParams: Promise<{
    difficulty?: string;
    focus?: string;
  }>;
}

export default async function LessonsPage({ searchParams }: LessonsPageProps) {
  const { difficulty, focus } = await searchParams;

  // 1. Fetch lessons in sequential order (createdAt ascending)
  const allLessons = await db.lesson.findMany({
    orderBy: { createdAt: 'asc' },
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
  const lessonsWithProgress = allLessons.map((lesson) => {
    const lessonSessions = sessionsMap[lesson.id] || [];
    const completed = lessonSessions.some((s) => s.accuracy >= 90.0);
    const bestWpm = lessonSessions.length > 0 ? Math.max(...lessonSessions.map((s) => s.wpm)) : 0;
    const bestAccuracy = lessonSessions.length > 0 ? Math.max(...lessonSessions.map((s) => s.accuracy)) : 0;

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
  let recommendedLesson = null;
  let recommendationReason = '';

  // Get most recent session to check if they need to repeat a lesson
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
  const lastSession = sortedSessions[0];

  if (lastSession && lastSession.lessonId && lastSession.accuracy < 90) {
    // Recommendation: Repeat the failed lesson
    recommendedLesson = lessonsWithProgress.find((l) => l.id === lastSession.lessonId) || null;
    recommendationReason = 'Repeat practice recommended to build accuracy (aim for 90%+)';
  } else {
    // Recommendation: Find the first uncompleted lesson
    const firstUncompleted = lessonsWithProgress.find((l) => !l.completed);
    if (firstUncompleted) {
      recommendedLesson = firstUncompleted;
      recommendationReason = firstUncompleted.unlocked
        ? 'Recommended next step in your progression'
        : 'Complete previous lessons to unlock';
    } else if (lessonsWithProgress.length > 0) {
      // Recommendation: Repeat the slowest completed lesson to build speed
      const sortedBySpeed = [...lessonsWithProgress].sort((a, b) => a.bestWpm - b.bestWpm);
      recommendedLesson = sortedBySpeed[0];
      recommendationReason = 'All lessons completed. Practice your slowest one to build relaxed speed.';
    }
  }

  // 5. Apply filters to the list
  const filteredLessons = lessonsWithProgress.filter((lesson) => {
    if (difficulty && lesson.difficulty !== difficulty) return false;
    if (focus && lesson.focus !== focus) return false;
    return true;
  });

  // 6. Define filter options
  const DIFFICULTY_FILTERS = ['all', 'beginner', 'intermediate', 'advanced'];
  const FOCUS_FILTERS = ['all', 'home-row', 'top-row', 'bottom-row', 'numbers', 'symbols', 'mixed'];

  // Helper to build filter URLs
  const getFilterUrl = (type: 'difficulty' | 'focus', value: string) => {
    const params = new URLSearchParams();
    if (type === 'difficulty') {
      if (value !== 'all') params.set('difficulty', value);
      if (focus) params.set('focus', focus);
    } else {
      if (difficulty) params.set('difficulty', difficulty);
      if (value !== 'all') params.set('focus', value);
    }
    return `/lessons?${params.toString()}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-2">
            ⌨️ Typing Classroom
          </h1>
          <p className="text-stone-500 mt-1">
            Build your muscle memory step-by-step. Go slow to go fast!
          </p>
        </div>
        <Link
          href="/lessons/new"
          className="warm-button text-center inline-block self-start sm:self-center"
        >
          + New Lesson
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Beginner Guidance Card */}
        <div className="lg:col-span-2 warm-card p-6 border-amber-200">
          <h2 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
            💡 Typing Guide & Posture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-600">
            <div>
              <p className="font-semibold text-stone-700 mb-1">🏠 Home Row Placement</p>
              <p className="mb-3">
                Rest left fingers on <strong className="text-amber-800">A S D F</strong> and right fingers on <strong className="text-amber-800">J K L ;</strong>. thumbs on spacebar. Return keys here after every stroke.
              </p>
              <p className="font-semibold text-stone-700 mb-1">🎯 Accuracy is Key</p>
              <p>
                Prioritize correctness over speed. Speed naturally follows once you stop looking at the keys and rely on pure muscle memory.
              </p>
            </div>
            <div>
              <p className="font-semibold text-stone-700 mb-1">🪑 Posture Check</p>
              <p className="mb-3">
                Keep your back straight, feet flat on the floor, and elbows bent at 90 degrees. Take frequent rests to prevent hand strain.
              </p>
              <p className="font-semibold text-stone-700 mb-1">📈 Passing Criteria</p>
              <p>
                Achieve at least <strong className="text-amber-800">90% accuracy</strong> to unlock the next lesson in sequence. Take your time!
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Lesson Box */}
        <div className="warm-card p-6 bg-amber-50/50 border-amber-300 border-2 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl">
            Next Goal
          </div>
          {recommendedLesson ? (
            <>
              <div>
                <p className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wide">
                  Recommended Practice
                </p>
                <h3 className="text-lg font-bold text-stone-800 mb-1">
                  {recommendedLesson.title}
                </h3>
                <p className="text-xs text-stone-500 mb-3 line-clamp-2">
                  {recommendedLesson.description}
                </p>
                <span className="inline-block text-xs bg-amber-100 text-amber-800 rounded px-2 py-0.5 font-medium mb-4">
                  {recommendationReason}
                </span>
              </div>
              <Link
                href={`/practice/${recommendedLesson.id}`}
                className="warm-button text-center w-full block text-sm"
              >
                Start Practice →
              </Link>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-stone-500 text-sm py-8">
              No lessons available. Add a lesson to get started!
            </div>
          )}
        </div>
      </div>

      {/* Filter Options */}
      <div className="warm-card p-4 mb-8 bg-stone-50/50 border-stone-200/80">
        <div className="flex flex-col gap-3">
          {/* Difficulty Filters */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-stone-500 min-w-[80px]">Difficulty:</span>
            <div className="flex flex-wrap gap-1.5">
              {DIFFICULTY_FILTERS.map((d) => {
                const isActive = (d === 'all' && !difficulty) || difficulty === d;
                return (
                  <Link
                    key={d}
                    href={getFilterUrl('difficulty', d)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Focus Filters */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-stone-500 min-w-[80px]">Focus Area:</span>
            <div className="flex flex-wrap gap-1.5">
              {FOCUS_FILTERS.map((f) => {
                const isActive = (f === 'all' && !focus) || focus === f;
                return (
                  <Link
                    key={f}
                    href={getFilterUrl('focus', f)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    {f
                      .split('-')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List Grid */}
      {filteredLessons.length === 0 ? (
        <div className="text-center py-12 warm-card bg-white border-stone-200">
          <p className="text-stone-500">No lessons match your active filters.</p>
          {(difficulty || focus) && (
            <Link
              href="/lessons"
              className="text-amber-700 hover:text-amber-800 text-sm font-semibold underline mt-2 inline-block"
            >
              Clear filters
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => {
            const isSelectable = lesson.unlocked;

            return (
              <div
                key={lesson.id}
                className={`relative flex flex-col justify-between warm-card-hover p-6 border ${
                  !isSelectable ? 'opacity-65 border-stone-200 bg-stone-50/40 select-none' : 'border-amber-200/40 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`inline px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        lesson.difficulty === 'beginner'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : lesson.difficulty === 'intermediate'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {lesson.difficulty}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {lesson.completed ? (
                        <span className="text-green-600 text-sm font-bold flex items-center gap-0.5" title="Lesson Completed (Accuracy >= 90%)">
                          ✅ Passed
                        </span>
                      ) : !isSelectable ? (
                        <span className="text-stone-400 text-xs flex items-center gap-0.5" title="Locked (Complete previous lessons first)">
                          🔒 Locked
                        </span>
                      ) : (
                        <span className="text-amber-600 text-xs font-semibold flex items-center gap-0.5" title="Unlocked & Ready">
                          🔑 Ready
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-stone-800 text-base mb-1">{lesson.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mb-4">{lesson.description}</p>
                </div>

                <div className="border-t border-stone-100 pt-3 mt-3">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 mb-3">
                    <span>🎯 {lesson.focus}</span>
                    <span>⏱️ {lesson.estimatedMinutes} min</span>
                  </div>

                  {lesson.bestWpm > 0 && (
                    <div className="bg-stone-50 rounded p-1.5 mb-3 text-[10px] text-stone-500 flex justify-between">
                      <span>Best Speed: <strong>{lesson.bestWpm} WPM</strong></span>
                      <span>Best Acc: <strong>{lesson.bestAccuracy}%</strong></span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    {isSelectable ? (
                      <Link
                        href={`/practice/${lesson.id}`}
                        className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded px-3 py-1.5 text-xs font-medium transition shadow-sm"
                      >
                        Start Practice
                      </Link>
                    ) : (
                      <span className="text-[11px] text-stone-400 font-medium">
                        Complete previous lesson first
                      </span>
                    )}

                    <Link
                      href={`/lessons/${lesson.id}`}
                      className="text-xs text-amber-700 hover:text-amber-800 hover:underline"
                    >
                      Configure
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
