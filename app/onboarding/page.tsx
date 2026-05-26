/**
 * [LAYER: UI]
 * OnboardingPage — Server page served at /onboarding.
 * Fetches the first structured touch-typing lesson in the database and renders
 * the OnboardingWizard client component.
 */

import { db } from "@/src/infrastructure/db";
import OnboardingWizard from "@/src/ui/components/OnboardingWizard";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  // Query first sequential lesson
  const firstLesson = await db.lesson.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  return <OnboardingWizard firstLessonId={firstLesson?.id || "first"} />;
}
