/**
 * [LAYER: UI]
 */
import { notFound } from 'next/navigation';
import { getLesson } from '@/src/core/actions/lessons';
import { getCustomText } from '@/src/core/actions/custom-texts';
import TypingEngine from '@/src/ui/components/TypingEngine';

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">
          Practicing: {lesson.title}
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
    );
  }

  // Try fetching custom practice text next
  const customText = await getCustomText(id);
  if (customText) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">
          Practicing Custom Text: {customText.title}
        </h1>
        <TypingEngine
          content={customText.body}
          customTextId={customText.id}
          title={customText.title}
          sourceLabel="Custom practice"
        />
      </div>
    );
  }

  notFound();
}
