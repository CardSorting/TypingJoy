/** [LAYER: UI] */
'use client';

import { useRouter } from 'next/navigation';
import { deleteLesson } from '@/src/core/actions/lessons';

export default function DeleteLessonWrapper({ lessonId }: { lessonId: string }) {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this lesson? This action is permanent and cannot be undone.')) {
      await deleteLesson(lessonId);
      router.push('/lessons');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg px-4 py-2 text-sm font-medium transition shadow-sm"
      >
        Delete Lesson
      </button>
    </form>
  );
}