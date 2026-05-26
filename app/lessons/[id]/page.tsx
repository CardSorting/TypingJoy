/**
 * [LAYER: UI]
 * LessonDetailPage — Displays structured lesson data, progression context, and editing/deletion interfaces.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/src/infrastructure/db';
import { getLesson } from '@/src/core/actions/lessons';
import EditLessonWrapper from '@/src/ui/components/EditLessonWrapper';
import DeleteLessonWrapper from '@/src/ui/components/DeleteLessonWrapper';

interface LessonDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
  const { id } = await params;
  const lesson = await getLesson(id);

  if (!lesson) {
    notFound();
  }

  // 1. Determine progression position and lock/unlock status
  const allLessons = await db.lesson.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, title: true },
  });

  const lessonIndex = allLessons.findIndex((l) => l.id === id);

  // Fetch sessions for this lesson
  const currentSessions = await db.typingSession.findMany({
    where: { lessonId: id },
    select: { accuracy: true, wpm: true },
  });

  const completed = currentSessions.some((s) => s.accuracy >= 90.0);
  const bestWpm = currentSessions.length > 0 ? Math.max(...currentSessions.map((s) => s.wpm)) : 0;
  const bestAccuracy = currentSessions.length > 0 ? Math.max(...currentSessions.map((s) => s.accuracy)) : 0;

  // Check previous lesson status
  let unlocked = true;
  let prevLesson = null;
  if (lessonIndex > 0) {
    prevLesson = allLessons[lessonIndex - 1];
    const prevSessions = await db.typingSession.findMany({
      where: { lessonId: prevLesson.id },
      select: { accuracy: true },
    });
    unlocked = prevSessions.some((s) => s.accuracy >= 90.0);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back to Lessons */}
      <div className="mb-6">
        <Link
          href="/lessons"
          className="text-amber-700 hover:text-amber-800 text-sm font-semibold underline"
        >
          ← Back to Classroom
        </Link>
      </div>

      {/* Lesson Details Card */}
      <div className="warm-card p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl font-bold text-stone-800">{lesson.title}</h1>
          <span
            className={`inline px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              lesson.difficulty === 'beginner'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : lesson.difficulty === 'intermediate'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {lesson.difficulty}
          </span>
        </div>

        <p className="text-stone-600 mb-4">{lesson.description}</p>

        <div className="flex flex-wrap gap-4 text-xs text-stone-500 mb-6 bg-stone-50 p-3 rounded-lg border border-stone-200/50">
          <div>
            🎯 Focus Area: <strong className="text-stone-700">{lesson.focus}</strong>
          </div>
          <div>
            ⏱️ Estimated: <strong className="text-stone-700">{lesson.estimatedMinutes} min</strong>
          </div>
          <div>
            📝 Total Attempts: <strong className="text-stone-700">{currentSessions.length}</strong>
          </div>
        </div>

        {/* Progression Status Notification */}
        {completed ? (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-bold text-sm">✅ Lesson Passed!</p>
              <p className="text-xs text-green-700">
                You met the 90%+ accuracy passing target for this lesson.
              </p>
            </div>
            <div className="text-xs bg-white border border-green-200 rounded px-2.5 py-1 text-center">
              Best Speed: <strong>{bestWpm} WPM</strong> <br />
              Best Accuracy: <strong>{bestAccuracy}%</strong>
            </div>
          </div>
        ) : !unlocked && prevLesson ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-6">
            <p className="font-bold text-sm">🔒 Sequentially Locked</p>
            <p className="text-xs text-amber-700 mt-0.5">
              We recommend passing the previous lesson (<strong>{prevLesson.title}</strong>) with at least 90% accuracy before practicing this lesson. However, you can still override this guideline and practice below.
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 mb-6">
            <p className="font-bold text-sm">🔑 Open Practice</p>
            <p className="text-xs text-blue-700 mt-0.5">
              This lesson is unlocked! Reach 90% accuracy or higher to pass it.
            </p>
          </div>
        )}

        <div className="bg-stone-800 text-stone-100 rounded-xl p-6 font-mono text-base leading-relaxed whitespace-pre-wrap border border-stone-700 shadow-inner select-none mb-6">
          {lesson.content}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`/practice/${lesson.id}`}
            className="warm-button text-center inline-block"
          >
            Start Practicing Now
          </Link>
        </div>
      </div>

      {/* Edit Form */}
      <div className="border-t border-amber-200/50 pt-8 mt-8">
        <EditLessonWrapper lessonId={lesson.id} initialData={lesson} />
      </div>

      {/* Danger Zone */}
      <div className="border-t border-amber-200/50 pt-8 mt-12 bg-red-50/20 p-6 rounded-xl border border-red-200/30">
        <h2 className="text-lg font-bold text-red-700 mb-1">⚠️ Danger Zone</h2>
        <p className="text-xs text-stone-500 mb-4">
          Deleting a lesson is permanent. All completed typing sessions for this lesson will be removed.
        </p>
        <DeleteLessonWrapper lessonId={lesson.id} />
      </div>
    </div>
  );
}
