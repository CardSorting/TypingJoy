/**
 * [LAYER: UI]
 */
'use client';

import { useRouter } from 'next/navigation';
import LessonForm from '@/src/ui/components/LessonForm';

export default function NewLessonPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Create New Lesson</h1>
      <LessonForm
        onSuccess={(id) => router.push('/lessons/' + id)}
      />
    </div>
  );
}