/**
 * [LAYER: INFRASTRUCTURE]
 */
import Link from 'next/link';
import { getLessons, LessonWithCount } from '@/src/core/actions/lessons';

export default async function LessonsPage() {
  const lessons = await getLessons();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-amber-800">Typing Lessons</h1>
        <Link
          href="/lessons/new"
          className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2"
        >
          New Lesson
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-16 text-stone-500">
          <div className="text-5xl mb-4">⌨️</div>
          <p className="text-lg mb-4">No lessons yet. Create your first lesson!</p>
          <Link
            href="/lessons/new"
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2 inline-block"
          >
            Create Lesson
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson: LessonWithCount) => (
            <div
              key={lesson.id}
              className="bg-white rounded-xl shadow-sm p-5 border border-stone-100"
            >
              <Link href={`/practice/${lesson.id}`} className="block mb-3">
                <h2 className="font-semibold text-stone-800 mb-1">{lesson.title}</h2>
                <p className="text-sm text-stone-500 line-clamp-2 mb-3">
                  {lesson.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline px-2 py-0.5 rounded-full text-xs font-medium ${
                      lesson.difficulty === 'beginner'
                        ? 'bg-green-100 text-green-700'
                        : lesson.difficulty === 'intermediate'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {lesson.difficulty}
                  </span>
                  {lesson.focus && (
                    <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {lesson.focus}
                    </span>
                  )}
                  {lesson.estimatedMinutes && (
                    <span className="text-xs text-stone-400">
                      {lesson.estimatedMinutes} min
                    </span>
                  )}
                </div>
              </Link>
              <Link
                href={`/lessons/${lesson.id}`}
                className="text-xs text-amber-600 hover:text-amber-700"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}