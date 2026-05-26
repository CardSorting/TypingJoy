/** [LAYER: UI] */
'use client';

import { useRouter } from 'next/navigation';
import { deleteLesson } from '@/src/core/actions/lessons';

export default function DeleteLessonWrapper({ lessonId }: { lessonId: string }) {
  const router = useRouter();

  async function handleDelete() {
    await deleteLesson(lessonId);
    router.push('/lessons');
  }

  return (
    <form action={handleDelete}>
      <button
        type="submit"
        className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 py-2"
      >
        Delete Lesson
      </button>
    </form>
  );
}