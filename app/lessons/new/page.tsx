"use client";

import { useRouter } from 'next/navigation';
import LessonForm from '@/src/ui/components/LessonForm';
import AppLayout from '@/src/ui/components/AppLayout';

export default function NewLessonPage() {
  const router = useRouter();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-stone-850 mb-6">Create New Lesson Reach</h1>
        <LessonForm
          onSuccess={(id) => router.push('/lessons/' + id)}
        />
      </div>
    </AppLayout>
  );
}