/**
 * [LAYER: UI]
 * SessionSummary — Display typing performance metrics and corrective advice.
 */

"use client";

import {
  formatDuration,
  summarizeTypingResult,
} from "@/src/domain/calculations";
import type { WeakKeyAdvice } from "@/src/domain/types";
import Link from "next/link";

interface SessionSummaryProps {
  wpm: number;
  accuracy: number;
  mistakes: number;
  durationSeconds: number;
  lessonTitle: string;
  sourceLabel: string;
  onReset: () => void;
  backUrl?: string;
  backLabel?: string;
  weakKeys?: WeakKeyAdvice[];
}

export default function SessionSummary({
  wpm,
  accuracy,
  mistakes,
  durationSeconds,
  lessonTitle,
  sourceLabel,
  onReset,
  backUrl,
  backLabel,
  weakKeys = [],
}: SessionSummaryProps) {
  const gradeTitle = accuracy >= 90 ? "Practice complete" : "Ready for a careful repeat";
  const feedbackMessage = summarizeTypingResult(accuracy, wpm);
  const retryMessage =
    accuracy >= 95
      ? "Repeat once if you want to make the rhythm feel automatic, or continue to the next practice."
      : "A repeat at a slower pace is the most useful next step for muscle memory.";

  const wpmColor =
    wpm >= 40
      ? "text-green-600"
      : wpm >= 20
        ? "text-amber-600"
        : "text-stone-600";

  const accuracyColor =
    accuracy >= 95
      ? "text-green-600"
      : accuracy >= 90
        ? "text-amber-600"
        : "text-red-500";

  return (
    <div className="rounded-xl bg-white shadow-md p-8 max-w-xl mx-auto text-center border border-amber-100">
      <h2 className="text-2xl font-bold text-amber-800 mb-1">{gradeTitle}</h2>
      <p className="text-stone-500 text-xs mb-4 font-medium">
        {sourceLabel}: {lessonTitle}
      </p>
      <p className="text-stone-700 text-sm mb-6 leading-relaxed px-3 bg-amber-50/55 py-3 rounded-lg border border-amber-200/50">
        {feedbackMessage}
      </p>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-stone-50/80 rounded-lg p-4 border border-stone-100">
          <div className="text-stone-400 text-xs mb-1 font-medium">Speed</div>
          <div className={`text-2xl font-bold font-mono ${wpmColor}`}>{wpm} <span className="text-xs font-normal">WPM</span></div>
        </div>
        <div className="bg-stone-50/80 rounded-lg p-4 border border-stone-100">
          <div className="text-stone-400 text-xs mb-1 font-medium">Accuracy</div>
          <div className={`text-2xl font-bold font-mono ${accuracyColor}`}>
            {accuracy}%
          </div>
        </div>
        <div className="bg-stone-50/80 rounded-lg p-4 border border-stone-100">
          <div className="text-stone-400 text-xs mb-1 font-medium">Mistakes</div>
          <div
            className={`text-2xl font-bold font-mono ${mistakes > 5 ? "text-red-500" : "text-green-600"}`}
          >
            {mistakes}
          </div>
        </div>
        <div className="bg-stone-50/80 rounded-lg p-4 border border-stone-100">
          <div className="text-stone-400 text-xs mb-1 font-medium">Duration</div>
          <div className="text-2xl font-bold text-stone-700 font-mono">
            {formatDuration(durationSeconds)}
          </div>
        </div>
      </div>

      <div className="text-left bg-sky-50/40 border border-sky-200/80 rounded-lg p-4 mb-6 text-xs text-stone-700">
        <p className="font-bold text-stone-800 mb-1">Teacher note</p>
        <p className="leading-relaxed">{retryMessage}</p>
      </div>

      {weakKeys.length > 0 && (
        <div className="text-left bg-yellow-50/35 border border-yellow-200/80 rounded-lg p-4 mb-6 text-xs text-stone-600">
          <p className="font-bold text-stone-700 mb-2">Weak-key coaching from this session</p>
          <div className="space-y-1.5">
            {weakKeys.map((advice) => (
              <div key={advice.key} className="border-b border-stone-200/40 pb-2 last:border-0 last:pb-0">
                <div className="flex justify-between items-center gap-3">
                  <span>
                    Intended{" "}
                    <strong className="font-mono text-amber-800 font-bold bg-white border border-amber-200/60 px-1.5 py-0.5 rounded">
                      &apos;{advice.key}&apos;
                    </strong>
                  </span>
                  <span className="text-stone-500 font-medium">
                    {advice.count} miss{advice.count === 1 ? "" : "es"}
                  </span>
                </div>
                <p className="mt-1 text-stone-600">
                  {advice.finger} · {advice.region}
                </p>
                <p className="mt-1 text-stone-500 leading-relaxed">{advice.advice}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="warm-button w-full mb-4"
      >
        Practice Again
      </button>

      <div className="flex justify-center gap-6 text-sm mt-2">
        <Link
          href={backUrl || "/lessons"}
          className="text-amber-700 hover:text-amber-800 font-semibold underline"
        >
          {backLabel || "Back to Lessons"}
        </Link>
        <Link
          href="/progress"
          className="text-amber-700 hover:text-amber-800 font-semibold underline"
        >
          View Progress Log
        </Link>
      </div>
    </div>
  );
}
