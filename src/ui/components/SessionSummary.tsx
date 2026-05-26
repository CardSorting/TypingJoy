/** [LAYER: UI] */

"use client";

import { formatDuration } from "@/src/domain/calculations";
import Link from "next/link";

interface SessionSummaryProps {
  wpm: number;
  accuracy: number;
  mistakes: number;
  durationSeconds: number;
  lessonTitle: string;
  onReset: () => void;
  backUrl?: string;
  backLabel?: string;
}

export default function SessionSummary({
  wpm,
  accuracy,
  mistakes,
  durationSeconds,
  lessonTitle,
  onReset,
  backUrl,
  backLabel,
}: SessionSummaryProps) {
  const wpmColor =
    wpm > 40
      ? "text-green-600"
      : wpm > 20
        ? "text-amber-600"
        : "text-red-600";

  const accuracyColor =
    accuracy > 90
      ? "text-green-600"
      : accuracy > 75
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="rounded-xl bg-white shadow-lg p-8 max-w-md mx-auto text-center">
      <div className="text-6xl mb-4">🏆</div>
      <h2 className="text-2xl font-bold text-amber-700 mb-2">Great Job!</h2>
      <p className="text-stone-500 mb-6">{lessonTitle}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-stone-50 rounded-lg p-4">
          <div className="text-stone-500 text-sm mb-1">WPM</div>
          <div className={`text-3xl font-bold ${wpmColor}`}>{wpm}</div>
        </div>
        <div className="bg-stone-50 rounded-lg p-4">
          <div className="text-stone-500 text-sm mb-1">Accuracy</div>
          <div className={`text-3xl font-bold ${accuracyColor}`}>
            {accuracy}%
          </div>
        </div>
        <div className="bg-stone-50 rounded-lg p-4">
          <div className="text-stone-500 text-sm mb-1">Mistakes</div>
          <div
            className={`text-2xl font-bold ${mistakes > 5 ? "text-red-600" : "text-green-600"}`}
          >
            {mistakes}
          </div>
        </div>
        <div className="bg-stone-50 rounded-lg p-4">
          <div className="text-stone-500 text-sm mb-1">Duration</div>
          <div className="text-2xl font-bold text-stone-700">
            {formatDuration(durationSeconds)}
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-medium transition-colors mb-4"
      >
        Practice Again
      </button>

      <div className="flex justify-center gap-4 text-sm">
        <Link
          href={backUrl || "/lessons"}
          className="text-amber-600 hover:text-amber-700 underline"
        >
          {backLabel || "Back to Lessons"}
        </Link>
        <Link
          href="/progress"
          className="text-amber-600 hover:text-amber-700 underline"
        >
          View Progress
        </Link>
      </div>
    </div>
  );
}
