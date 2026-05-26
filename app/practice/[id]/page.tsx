/**
 * [LAYER: UI]
 */
import { notFound } from 'next/navigation';
import { getLesson } from '@/src/core/actions/lessons';
import { getCustomText } from '@/src/core/actions/custom-texts';
import TypingEngine from '@/src/ui/components/TypingEngine';
import AppLayout from '@/src/ui/components/AppLayout';

export default async function PracticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Try fetching structured lesson first
  const lesson = await getLesson(id);
  if (lesson) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-stone-850 mb-6">
            Practice: {lesson.title}
          </h1>
          <TypingEngine
            content={lesson.content}
            lessonId={lesson.id}
            title={lesson.title}
            lessonFocus={lesson.focus}
            estimatedMinutes={lesson.estimatedMinutes}
            sourceLabel="Lesson"
          />
        </div>
      </AppLayout>
    );
  }

  // Try fetching custom practice text next
  const customText = await getCustomText(id);
  if (customText) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-stone-850 mb-6">
            Practice: {customText.title}
          </h1>
          <TypingEngine
            content={customText.body}
            customTextId={customText.id}
            title={customText.title}
            sourceLabel="Custom practice"
          />
        </div>
      </AppLayout>
    );
  }

  notFound();
}
