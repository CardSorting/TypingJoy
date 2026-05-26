/**
 * [LAYER: UI]
 * SessionSummary — Supportive classroom review with coaching and next-step guidance.
 */

"use client";

import {
  formatDuration,
  summarizeTypingResult,
} from "@/src/domain/calculations";
import type { WeakKeyAdvice, KeyboardRegionWeakness, ConfusionZoneInfo } from "@/src/domain/types";
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
  lessonFocus?: string;
  regionWeakness?: KeyboardRegionWeakness | null;
  confusionZones?: ConfusionZoneInfo[];
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
  lessonFocus,
  regionWeakness,
  confusionZones = [],
}: SessionSummaryProps) {
  const gradeTitle =
    accuracy >= 95
      ? "Well done — focused and accurate"
      : accuracy >= 90
        ? "Solid practice session"
        : accuracy >= 75
          ? "Good effort — a repeat will help"
          : "Take it gently — accuracy builds with time";

  const feedbackMessage = summarizeTypingResult(accuracy, wpm);

  // Context-sensitive next-step recommendation
  const nextStepRecommendation = () => {
    if (accuracy >= 95) {
      if (wpm < 20) {
        return "Your accuracy is excellent for this stage. A repeat at the same calm pace will help your fingers remember the pattern automatically.";
      }
      return "Strong session. Try a repeat to lock in the rhythm, or move to the next practice when you feel ready.";
    }
    if (accuracy >= 90) {
      if (mistakes <= 3) {
        return "Almost there — just a few small corrections needed. A slow repeat with extra attention on the missed keys will help.";
      }
      return "Good accuracy overall. A careful repeat at a slightly slower pace is the most productive next step.";
    }
    if (accuracy >= 75) {
      return "Each repeat builds accuracy. Next time, pause briefly before keys that feel uncertain. Speed is not important here — clean keystrokes are.";
    }
    if (mistakes > 10) {
      return "This text needs a slower, more deliberate pass. Focus on one key at a time and return to home row between reaches. Short, gentle practice is best.";
    }
    return "A slower repeat with attention on each keystroke will build the muscle memory this text needs. Accuracy grows through patient repetition.";
  };

  return (
    <div className="rounded-xl bg-white shadow-md p-8 max-w-xl mx-auto border border-amber-100">
      <h2 className="text-2xl font-bold text-amber-800 mb-1">{gradeTitle}</h2>
      <p className="text-stone-500 text-xs mb-4 font-medium">
        {sourceLabel}: {lessonTitle}{lessonFocus ? ` · Focus: ${lessonFocus.replace("-", " ")}` : ""}
      </p>
      <p className="text-stone-700 text-sm mb-6 leading-relaxed px-3 bg-amber-50/55 py-3 rounded-lg border border-amber-200/50">
        {feedbackMessage}
      </p>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-stone-50/80 rounded-lg p-4 border border-stone-100">
          <div className="text-stone-400 text-xs mb-1 font-medium">Speed</div>
          <div className="text-2xl font-bold font-mono text-stone-700">{wpm} <span className="text-xs font-normal text-stone-400">WPM</span></div>
        </div>
        <div className="bg-stone-50/80 rounded-lg p-4 border border-stone-100">
          <div className="text-stone-400 text-xs mb-1 font-medium">Accuracy</div>
          <div className="text-2xl font-bold font-mono text-stone-700">
            {accuracy}%
          </div>
        </div>
        <div className="bg-stone-50/80 rounded-lg p-4 border border-stone-100">
          <div className="text-stone-400 text-xs mb-1 font-medium">Mistakes</div>
          <div
            className={`text-2xl font-bold font-mono ${mistakes > 5 ? "text-stone-600" : "text-stone-700"}`}
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

      {/* Next-step recommendation */}
      <div className="text-left bg-amber-50/40 border border-amber-200/80 rounded-lg p-4 mb-6 text-xs text-stone-700">
        <p className="font-bold text-stone-800 mb-1 flex items-center gap-1">
          <span aria-hidden="true">💡</span> Next step
        </p>
        <p className="leading-relaxed">{nextStepRecommendation()}</p>
      </div>

      {weakKeys.length > 0 && (
        <div className="text-left bg-stone-50 border border-stone-200/80 rounded-lg p-4 mb-6 text-xs text-stone-600">
          <p className="font-bold text-stone-700 mb-2 flex items-center gap-1">
            <span aria-hidden="true">⌨️</span> Key-specific coaching
          </p>
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

      {regionWeakness && (
        <div className="text-left bg-stone-50 border border-stone-200/80 rounded-lg p-4 mb-6 text-xs text-stone-600">
          <p className="font-bold text-stone-700 mb-1 flex items-center gap-1">
            <span aria-hidden="true">🗺️</span> Region Weakness
          </p>
          <p className="leading-relaxed">
            Your weakest region this session was the <strong className="text-amber-800">{regionWeakness.region.replace("-", " ")}</strong> (accounting for {regionWeakness.percentage}% of misses).
          </p>
          <p className="mt-1 text-stone-500 leading-relaxed">{regionWeakness.advice}</p>
        </div>
      )}

      {confusionZones.length > 0 && (
        <div className="text-left bg-stone-50 border border-stone-200/80 rounded-lg p-4 mb-6 text-xs text-stone-600">
          <p className="font-bold text-stone-700 mb-2 flex items-center gap-1">
            <span aria-hidden="true">🔄</span> Confusion Zones
          </p>
          <div className="space-y-2">
            {confusionZones.map((cz, index) => (
              <div key={index} className="border-b border-stone-200/40 pb-2 last:border-0 last:pb-0">
                <p className="leading-relaxed text-stone-700">
                  Confused <strong className="font-mono text-amber-800 bg-white border border-amber-200 px-1 rounded">&apos;{cz.expected}&apos;</strong> with <strong className="font-mono text-amber-800 bg-white border border-amber-200 px-1 rounded">&apos;{cz.typed}&apos;</strong>.
                </p>
                <p className="mt-1 text-stone-500 leading-relaxed">{cz.advice}</p>
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