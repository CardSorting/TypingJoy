/**
 * [LAYER: UI]
 * TypingEngine — The core typing practice component.
 * Handles keystroke capture, real-time stats, and session persistence.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  calcAccuracy,
  calcProgress,
  calcWpm,
  countMistakes,
  formatDuration,
} from "@/src/domain/calculations";
import { createSession } from "@/src/core/actions/sessions";
import SessionSummary from "./SessionSummary";

interface TypingEngineProps {
  content: string;
  lessonId?: string;
  customTextId?: string;
  title: string;
}

export default function TypingEngine({
  content,
  lessonId,
  customTextId,
  title,
}: TypingEngineProps) {
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-focus the hidden textarea
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Timer: update elapsed time every 100ms while typing
  useEffect(() => {
    if (isStarted && !isFinished && startTime !== null) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isStarted, isFinished, startTime]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;

      let currentStartTime = startTime;
      if (!isStarted) {
        setIsStarted(true);
        currentStartTime = Date.now();
        setStartTime(currentStartTime);
      }

      if (isFinished) return;

      // Only advance if the new value is longer (typing forward)
      if (value.length <= typedText.length) {
        setTypedText(value);
        return;
      }

      setTypedText(value);

      // Compare the newly typed character
      const newIndex = value.length - 1;
      const expectedChar = content[newIndex];
      const typedChar = value[newIndex];

      let nextCorrect = correctKeystrokes;
      if (typedChar === expectedChar) {
        nextCorrect = correctKeystrokes + 1;
        setCorrectKeystrokes(nextCorrect);
      } else {
        setMistakeCount((prev) => prev + 1);
      }

      setCurrentIndex(value.length);

      // Check if finished
      if (value.length >= content.length) {
        setIsFinished(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        // Final elapsed time
        let finalElapsed = elapsedSeconds;
        if (currentStartTime) {
          finalElapsed = Math.floor((Date.now() - currentStartTime) / 1000);
          setElapsedSeconds(finalElapsed);
        }

        // Calculate final stats
        const { mistakes, correctKeystrokes: correct } = countMistakes(
          value,
          content,
        );
        const finalAccuracy = calcAccuracy(correct, value.length);
        const finalWpm = calcWpm(correct, finalElapsed);

        createSession({
          lessonId: lessonId || undefined,
          customTextId: customTextId || undefined,
          typedText: value,
          targetText: content,
          wpm: finalWpm,
          accuracy: finalAccuracy,
          mistakes,
          durationSeconds: finalElapsed,
        }).catch((err) => {
          console.error("Failed to save session:", err);
        });
      }
    },
    [isStarted, isFinished, typedText, content, startTime, correctKeystrokes, elapsedSeconds, lessonId, customTextId],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Prevent newlines from being inserted
      if (e.key === "Enter") {
        e.preventDefault();
      }
    },
    [],
  );

  const handleReset = useCallback(() => {
    setTypedText("");
    setCurrentIndex(0);
    setMistakeCount(0);
    setStartTime(null);
    setIsFinished(false);
    setIsStarted(false);
    setElapsedSeconds(0);
    setCorrectKeystrokes(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    textareaRef.current?.focus();
  }, []);

  // Compute real-time stats
  const totalTyped = typedText.length;
  const wpm = calcWpm(correctKeystrokes, elapsedSeconds);
  const accuracy = calcAccuracy(correctKeystrokes, totalTyped || 1);
  const progress = calcProgress(currentIndex, content.length);

  // If finished, show summary
  if (isFinished) {
    const { mistakes } = countMistakes(typedText, content);
    return (
      <SessionSummary
        wpm={wpm}
        accuracy={accuracy}
        mistakes={mistakes}
        durationSeconds={elapsedSeconds}
        lessonTitle={title}
        onReset={handleReset}
        backUrl={customTextId ? "/custom-texts" : "/lessons"}
        backLabel={customTextId ? "Back to Custom Texts" : "Back to Lessons"}
      />
    );
  }

  return (
    <div className="rounded-xl bg-white shadow-lg p-6 max-w-3xl mx-auto">
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-6 text-sm">
        <div className="flex gap-6">
          <div>
            <span className="text-stone-400">WPM </span>
            <span className="font-semibold text-stone-700">{wpm}</span>
          </div>
          <div>
            <span className="text-stone-400">Accuracy </span>
            <span className="font-semibold text-stone-700">{accuracy}%</span>
          </div>
          <div>
            <span className="text-stone-400">Mistakes </span>
            <span className="font-semibold text-stone-700">{mistakeCount}</span>
          </div>
        </div>
        <div className="font-mono text-stone-500">
          {formatDuration(elapsedSeconds)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-stone-100 rounded-full h-2 mb-6">
        <div
          className="bg-amber-500 h-2 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Character display */}
      <div className="font-mono text-lg leading-relaxed mb-6 p-4 bg-stone-50 rounded-lg select-none">
        {content.split("").map((char, i) => {
          let className = "";
          if (i < typedText.length) {
            if (typedText[i] === char) {
              className =
                "text-green-600 bg-green-50";
            } else {
              className =
                "text-red-600 bg-red-50 underline decoration-red-500";
            }
          } else if (i === typedText.length) {
            className =
              "text-amber-600 bg-amber-50 border-b-2 border-amber-500";
          }
          return (
            <span key={i} className={className}>
              {char}
            </span>
          );
        })}
      </div>

      {/* Hidden textarea for keyboard input */}
      <textarea
        ref={textareaRef}
        value={typedText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="opacity-0 absolute h-0 w-0"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        aria-label="Typing input"
      />

      {/* Reset button */}
      <div className="flex justify-center">
        <button
          onClick={handleReset}
          className="text-stone-400 hover:text-stone-600 text-sm underline transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
