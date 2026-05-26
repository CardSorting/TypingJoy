/** [LAYER: UI] */
'use client';

import LessonForm from '@/src/ui/components/LessonForm';

export default function EditLessonWrapper({
  lessonId,
  initialData,
}: {
  lessonId: string;
  initialData: {
    title: string;
    description: string;
    difficulty: string;
    focus: string;
    content: string;
    estimatedMinutes: number;
  };
}) {
  return (
    <LessonForm
      lessonId={lessonId}
      initialData={initialData}
      onSuccess={() => {
        window.location.reload();
      }}
    />
  );
}