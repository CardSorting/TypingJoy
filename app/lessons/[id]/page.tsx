/**
 * [LAYER: UI]
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLesson } from '@/src/core/actions/lessons';
import EditLessonWrapper from '@/src/ui/components/EditLessonWrapper';
import DeleteLessonWrapper from '@/src/ui/components/DeleteLessonWrapper';

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = await getLesson(id);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800 mb-3">{lesson.title}</h1>
        <div className="flex flex-wrap items-center gap-2 mb-4">
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
            <span className="text-xs text-stone-400">Estimated: {lesson.estimatedMinutes} min</span>
          )}
        </div>
      </div>

      <div className="bg-stone-50 rounded-xl p-6 font-mono text-lg leading-relaxed whitespace-pre-wrap border border-stone-200 mb-6">
        {lesson.content}
      </div>

      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/practice/${lesson.id}`}
          className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-6 py-3"
        >
          Start Practicing
        </Link>
        <span className="text-sm text-stone-500">
          Session count: {lesson._count?.sessions ?? 0}
        </span>
      </div>

      <div className="border-t border-stone-200 pt-8 mt-8">
        <h2 className="text-xl font-semibold text-stone-800 mb-4">Edit Lesson</h2>
        <EditLessonWrapper lessonId={lesson.id} initialData={lesson} />
      </div>

      <div className="border-t border-stone-200 pt-8 mt-8">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Delete Lesson</h2>
        <DeleteLessonWrapper lessonId={lesson.id} />
      </div>
    </div>
  );
}