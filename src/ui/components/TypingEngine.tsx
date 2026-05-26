/**
 * [LAYER: UI]
 * TypingEngine — The core typing practice component.
 * Handles keystroke capture, real-time stats, pausing, and session persistence.
 */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  calcAccuracy,
  calcProgress,
  calcWpm,
  countMistakes,
  displayKeyLabel,
  formatDuration,
  computeTactileDiagnostics,
} from "@/src/domain/calculations";
import { createSession } from "@/src/core/actions/sessions";
import type { WeakKeyAdvice, KeyboardRegionWeakness, ConfusionZoneInfo } from "@/src/domain/types";
import SessionSummary from "./SessionSummary";

interface TypingEngineProps {
  content: string;
  lessonId?: string;
  customTextId?: string;
  title: string;
  lessonFocus?: string;
  estimatedMinutes?: number;
  sourceLabel?: string;
}

interface FinalSummary {
  wpm: number;
  accuracy: number;
  mistakes: number;
  durationSeconds: number;
}

export default function TypingEngine({
  content,
  lessonId,
  customTextId,
  title,
  lessonFocus,
  estimatedMinutes,
  sourceLabel,
}: TypingEngineProps) {
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionWeakKeys, setSessionWeakKeys] = useState<WeakKeyAdvice[]>([]);
  const [sessionRegionWeakness, setSessionRegionWeakness] = useState<KeyboardRegionWeakness | null>(null);
  const [sessionConfusionZones, setSessionConfusionZones] = useState<ConfusionZoneInfo[]>([]);
  const [finalSummary, setFinalSummary] = useState<FinalSummary | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasSavedRef = useRef(false);

  // Auto-focus the hidden textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Keyboard shortcut: Escape to toggle pause/resume
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isStarted && !isFinished) {
          setIsPaused((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isStarted, isFinished]);

  // Keep focus on the textarea unless paused or finished
  useEffect(() => {
    if (!isPaused && !isFinished) {
      textareaRef.current?.focus();
    }
  }, [isPaused, isFinished]);

  // Timer: increment elapsed time every second while typing actively
  useEffect(() => {
    if (isStarted && !isFinished && !isPaused) {
      const interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isStarted, isFinished, isPaused]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isPaused || isFinished) return;

      const value = e.target.value;
      const nextValue = value.slice(0, content.length);

      if (!isStarted && nextValue.length > 0) {
        setIsStarted(true);
      }

      // Only advance if typing forward
      if (nextValue.length <= typedText.length) {
        setTypedText(nextValue);
        setCurrentIndex(nextValue.length);
        return;
      }

      setTypedText(nextValue);

      // Compare character at the newly advanced index
      const newIndex = nextValue.length - 1;
      const expectedChar = content[newIndex];
      const typedChar = nextValue[newIndex];

      if (typedChar !== expectedChar) {
        setMistakeCount((prev) => prev + 1);
      }

      setCurrentIndex(nextValue.length);

      // Check if practice is complete
      if (nextValue.length >= content.length && !hasSavedRef.current) {
        hasSavedRef.current = true;
        setIsFinished(true);

        const finalElapsed = elapsedSeconds || 1;

        const { mistakes, correctKeystrokes: correct } = countMistakes(
          nextValue,
          content,
        );
        const finalAccuracy = calcAccuracy(correct, nextValue.length);
        const finalWpm = calcWpm(correct, finalElapsed);
        const diagnostics = computeTactileDiagnostics(
          [{ typedText: nextValue, targetText: content, accuracy: finalAccuracy }],
          3,
        );
        setSessionWeakKeys(diagnostics.weakKeys);
        setSessionRegionWeakness(diagnostics.regionWeakness);
        setSessionConfusionZones(diagnostics.confusionZones);
        setFinalSummary({
          wpm: finalWpm,
          accuracy: finalAccuracy,
          mistakes,
          durationSeconds: finalElapsed,
        });

        createSession({
          lessonId: lessonId || undefined,
          customTextId: customTextId || undefined,
          typedText: nextValue,
          targetText: content,
          wpm: finalWpm,
          accuracy: finalAccuracy,
          mistakes,
          durationSeconds: finalElapsed,
        }).catch(() => {
          hasSavedRef.current = false;
        });
      }
    },
    [isStarted, isFinished, isPaused, typedText, content, elapsedSeconds, lessonId, customTextId],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const expectedCharacter = content[typedText.length];
      if (e.key === "Enter" && expectedCharacter !== "\n") {
        e.preventDefault();
      }
    },
    [content, typedText.length],
  );

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  }, []);

  const handleReset = useCallback(() => {
    setTypedText("");
    setCurrentIndex(0);
    setMistakeCount(0);
    setIsFinished(false);
    setIsStarted(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setSessionWeakKeys([]);
    setSessionRegionWeakness(null);
    setSessionConfusionZones([]);
    setFinalSummary(null);
    hasSavedRef.current = false;
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 10);
  }, []);

  // Compute live real-time stats
  const totalTyped = typedText.length;
  const liveStats = countMistakes(typedText, content);
  const wpm = calcWpm(liveStats.correctKeystrokes, elapsedSeconds);
  const accuracy = calcAccuracy(liveStats.correctKeystrokes, totalTyped || 1);
  const progress = calcProgress(currentIndex, content.length);

  // Generate helper preview of unique letters trained in this practice
  const uniqueChars = useMemo(
    () =>
      Array.from(
        new Set(
          content
            .toLowerCase()
            .replace(/\s+/g, " ")
            .split("")
            .map(displayKeyLabel)
            .filter((char) => char.trim().length > 0),
        ),
      )
        .sort()
        .slice(0, 14)
        .join(" \u00B7 "),
    [content],
  );
  const estimatedDuration = estimatedMinutes || Math.max(1, Math.ceil(content.length / 180));
  const currentExpected =
    currentIndex < content.length ? displayKeyLabel(content[currentIndex]) : "complete";
  const currentTyped =
    typedText.length > 0 && typedText[typedText.length - 1] !== content[typedText.length - 1]
      ? displayKeyLabel(typedText[typedText.length - 1])
      : "";

  // Derive a contextual keys-practiced description based on lesson focus
  const keysPreview = useMemo(() => {
    if (!lessonFocus || lessonFocus === "mixed") return null;
    const regionDescription: Record<string, { keys: string; description: string }> = {
      "home-row": { keys: "A S D F J K L ;", description: "Home row — rest your fingers here between each keystroke." },
      "top-row": { keys: "Q W E R T Y U I O P", description: "Top row — reach up from the home row, then return." },
      "bottom-row": { keys: "Z X C V B N M , . /", description: "Bottom row — drop down from the home row, then reset." },
      numbers: { keys: "1 2 3 4 5 6 7 8 9 0", description: "Number row — stretch up with controlled finger reaches." },
      symbols: { keys: "- = [ ] \\ ; ' , . /", description: "Symbols — slow down for reach and modifier combinations." },
    };
    return regionDescription[lessonFocus] || null;
  }, [lessonFocus]);

  // Completed session card redirection
  if (isFinished && finalSummary) {
    return (
      <SessionSummary
        wpm={finalSummary.wpm}
        accuracy={finalSummary.accuracy}
        mistakes={finalSummary.mistakes}
        durationSeconds={finalSummary.durationSeconds}
        lessonTitle={title}
        sourceLabel={sourceLabel || (customTextId ? "Custom practice" : "Lesson")}
        onReset={handleReset}
        backUrl={customTextId ? "/custom-texts" : "/lessons"}
        backLabel={customTextId ? "Back to Custom Texts" : "Back to Lessons"}
        weakKeys={sessionWeakKeys}
        lessonFocus={lessonFocus}
        regionWeakness={sessionRegionWeakness}
        confusionZones={sessionConfusionZones}
      />
    );
  }

  return (
    <div className="rounded-xl bg-white shadow-md p-6 max-w-3xl mx-auto border border-amber-100">
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-6 text-sm">
        <div className="flex gap-6">
          <div>
            <span className="text-stone-400">Speed:</span>{" "}
            <strong className="font-bold text-stone-700 font-mono text-base" aria-live="polite" aria-label={`${wpm} words per minute`}>{wpm} <span className="text-[10px] font-normal text-stone-400">WPM</span></strong>
          </div>
          <div>
            <span className="text-stone-400">Accuracy:</span>{" "}
            <strong className="font-bold text-stone-700 font-mono text-base" aria-live="polite" aria-label={`${accuracy} percent accuracy`}>{accuracy}%</strong>
          </div>
          <div>
            <span className="text-stone-400">Mistakes:</span>{" "}
            <strong
              className={`font-bold font-mono text-base ${mistakeCount > 5 ? "text-red-600" : "text-stone-700"}`}
              aria-live="polite"
              aria-label={`${mistakeCount} mistakes`}
            >
              {mistakeCount}
            </strong>
          </div>
        </div>
        <div className="font-mono text-stone-600 bg-stone-100 px-3 py-1 rounded text-sm font-semibold border border-stone-200/50">
          {formatDuration(elapsedSeconds)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-stone-100 rounded-full h-2 mb-6" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${progress} percent complete`}>
        <div
          className="bg-amber-500 h-2 rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Target text display wrapper */}
      <div className="relative">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Current expected key: {currentExpected}
          {currentTyped ? `. Last typed key: ${currentTyped} — does not match.` : ""}
        </p>
        <div
          className={`typing-surface font-mono text-lg leading-8 mb-6 p-4 bg-stone-50 rounded-lg select-none transition-opacity duration-150 border border-stone-200/60 whitespace-pre-wrap ${
            isPaused ? "blur-md opacity-30 select-none pointer-events-none" : ""
          }`}
          onClick={() => textareaRef.current?.focus()}
          aria-hidden="true"
        >
          {content.split("").map((char, i) => {
            let className = "char-token";

            if (i < typedText.length) {
              if (typedText[i] === char) {
                className += " char-correct";
              } else {
                className += " char-incorrect";
              }
            } else if (i === typedText.length) {
              className += " char-current";
            } else {
              className += " char-upcoming";
            }

            // Render non-breaking space to prevent visual layout collapse
            const displayChar = char === " " ? "\u00A0" : char;

            return (
              <span
                key={i}
                className={className}
                aria-current={i === typedText.length ? "true" : undefined}
              >
                {displayChar}
                {i < typedText.length && typedText[i] !== char && (
                  <span className="sr-mistake-marker" aria-hidden="true">!</span>
                )}
              </span>
            );
          })}
        </div>

        {/* Paused Screen Overlay */}
        {isPaused && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100/70 backdrop-blur-xs rounded-lg border border-amber-200" role="dialog" aria-label="Practice paused">
            <span className="text-stone-800 font-bold text-lg mb-2" aria-hidden="true">⏸️ Practice Paused</span>
            <p className="text-xs text-stone-500 mb-4">Press <kbd className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-300 font-sans text-[10px]">Esc</kbd> or click below to resume.</p>
            <button
              onClick={() => setIsPaused(false)}
              className="warm-button text-xs py-2 px-5"
              aria-label="Resume typing practice"
            >
              Resume Practice
            </button>
          </div>
        )}
      </div>

      {/* Hidden textarea for keyboard input */}
      <textarea
        ref={textareaRef}
        value={typedText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="sr-only"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        aria-label="Typing input — type the displayed text character by character"
        aria-describedby="typing-input-help"
        disabled={isPaused}
      />

      {/* Dynamic bottom area: Get Ready or Control bar */}
      <div className="border-t border-stone-100 pt-4 mt-4">
        {!isStarted ? (
          <div className="warm-card p-5 border-amber-200">
            <div className="flex items-start gap-3">
              <span className="text-amber-600 text-base mt-0.5" aria-hidden="true">📖</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Get ready
                </p>
                <h2 className="mt-0.5 font-bold text-stone-900 text-lg">{title}</h2>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                  {lessonFocus ? (
                    <>Focus: <strong className="text-stone-800">{lessonFocus.replace(/-/g, " ")}</strong>. </>
                  ) : ""}
                  About {estimatedDuration} minute{estimatedDuration === 1 ? "" : "s"} at a relaxed pace.
                </p>
                {keysPreview ? (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-white/75 p-3 text-xs text-stone-600">
                    <p className="font-mono text-amber-800 font-semibold tracking-wider">{keysPreview.keys}</p>
                    <p className="mt-1 text-stone-500 leading-relaxed">{keysPreview.description}</p>
                  </div>
                ) : (
                  uniqueChars && (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-white/75 p-3 text-xs text-stone-600">
                      <p><span className="font-semibold text-stone-700">Practiced keys:</span> <span className="font-mono text-amber-800">{uniqueChars}</span></p>
                    </div>
                  )
                )}
                <div className="mt-3 text-xs font-medium text-amber-700">
                  Accuracy comes first — speed grows naturally. Start typing when you are ready.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center text-xs text-stone-400">
            <div id="typing-input-help">
              <span>Press </span>
              <kbd className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-300 font-sans text-[10px]">Esc</kbd>
              <span> to pause or resume.</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="text-amber-700 hover:text-amber-800 underline font-medium transition-colors"
                aria-expanded={isPaused}
                aria-label={isPaused ? "Resume practice" : "Pause practice"}
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={handleReset}
                className="text-stone-500 hover:text-stone-700 underline font-medium transition-colors"
                aria-label="Reset practice and start from the beginning"
              >
                Reset Practice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}