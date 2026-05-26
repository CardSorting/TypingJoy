/**
 * [LAYER: UI]
 * TypingEngine — Core practice environment.
 * Incorporates:
 * 1. Focus Mode: Centered, distraction-free writing.
 * 2. Web Audio keystroke synthesis (wood clacks, mechanical switch clicks, buzzer errors).
 * 3. Finger placement pre-practice diagrams.
 * 4. Completed celebrations (CSS particle confetti).
 * 5. Instant LocalStorage stat updates to synchronize the app shell.
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
import { getLocalSettings, getLocalStats, saveLocalStats } from "@/src/core/utils/settings";

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

interface ConfettiPiece {
  id: number;
  left: string;
  color: string;
  delay: string;
  duration: string;
}

// Low-latency Audio synthesis engine
function playSynthSound(type: string, volume: number, isCorrect: boolean) {
  if (type === "none" || volume === 0) return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const volVal = volume / 100;

    if (!isCorrect) {
      // Soft buzz sound for spelling mistakes
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(volVal * 0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "typewriter") {
      // Gentle wooden key strike
      osc.type = "sine";
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.055);
      gain.gain.setValueAtTime(volVal * 0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.055);
      osc.start();
      osc.stop(ctx.currentTime + 0.055);
    } else if (type === "mechanical") {
      // Mechanical switch click sound
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.02);
      gain.gain.setValueAtTime(volVal * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);
      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    }
  } catch {
    // Ignore autoplay blockages
  }
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
  // Practice states
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

  // Customizer preferences loaded from localStorage
  const [focusMode, setFocusMode] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [fontFamily, setFontFamily] = useState("mono");
  const [soundType, setSoundType] = useState("typewriter");
  const [volume, setVolume] = useState(50);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowDistraction, setLowDistraction] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasSavedRef = useRef(false);

  // Load local settings on mount
  useEffect(() => {
    textareaRef.current?.focus();

    const settings = getLocalSettings();

    const timer = setTimeout(() => {
      setFocusMode(settings.autoFocusMode);
      setFontSize(settings.fontSize);
      setFontFamily(settings.fontFamily);
      setSoundType(settings.soundType);
      setVolume(settings.volume);
      setReducedMotion(settings.reducedMotion);
      setLowDistraction(settings.lowDistraction);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Sync focus mode state change to the layout shell
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("typingjoy_focus_toggle", {
        detail: { focusMode },
      })
    );
  }, [focusMode]);

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

  // Keep focus on hidden input
  useEffect(() => {
    if (!isPaused && !isFinished) {
      textareaRef.current?.focus();
    }
  }, [isPaused, isFinished]);

  // Timer interval hook
  useEffect(() => {
    if (isStarted && !isFinished && !isPaused) {
      const interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isStarted, isFinished, isPaused]);

  // Spawns CSS confetti pieces
  const triggerConfetti = useCallback(() => {
    if (reducedMotion || focusMode) return;
    const colors = ["#d97706", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6"];
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        left: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: `${Math.random() * 1.5}s`,
        duration: `${2 + Math.random() * 2}s`,
      });
    }
    setConfetti(pieces);
  }, [reducedMotion, focusMode]);

  // Instantly updates local statistics to synchronize sidebar layout profile stats
  const syncLocalStats = useCallback((wpmScore: number) => {
    try {
      const stats = getLocalStats();
      const newCount = stats.totalSessions + 1;
      const calculatedWpm = Math.round(((stats.averageWpm * stats.totalSessions + wpmScore) / newCount) * 10) / 10;

      stats.totalSessions = newCount;
      stats.averageWpm = calculatedWpm;
      if (stats.consistencyDaysCount === 0) {
        stats.consistencyDaysCount = 1;
      }

      saveLocalStats(stats);
    } catch {
      // Ignore errors
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isPaused || isFinished) return;

      const value = e.target.value;
      const nextValue = value.slice(0, content.length);

      if (!isStarted && nextValue.length > 0) {
        setIsStarted(true);
      }

      if (nextValue.length <= typedText.length) {
        setTypedText(nextValue);
        setCurrentIndex(nextValue.length);
        return;
      }

      const newIndex = nextValue.length - 1;
      const expectedChar = content[newIndex];
      const typedChar = nextValue[newIndex];
      const isCorrect = typedChar === expectedChar;

      // Play audio synth clack
      playSynthSound(soundType, volume, isCorrect);

      if (!isCorrect) {
        setMistakeCount((prev) => prev + 1);
      }

      setTypedText(nextValue);
      setCurrentIndex(nextValue.length);

      // Complete practices
      if (nextValue.length >= content.length && !hasSavedRef.current) {
        hasSavedRef.current = true;
        setIsFinished(true);

        const finalElapsed = elapsedSeconds || 1;

        const { mistakes, correctKeystrokes: correct } = countMistakes(nextValue, content);
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

        // Trigger confetti
        triggerConfetti();

        // Sync sidebar local stats widget
        syncLocalStats(finalWpm);

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
    [
      isStarted,
      isFinished,
      isPaused,
      typedText,
      content,
      elapsedSeconds,
      lessonId,
      customTextId,
      soundType,
      volume,
      triggerConfetti,
      syncLocalStats,
    ],
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
    setConfetti([]);
    hasSavedRef.current = false;
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 10);
  }, []);

  // Compute live stats
  const totalTyped = typedText.length;
  const liveStats = countMistakes(typedText, content);
  const wpm = calcWpm(liveStats.correctKeystrokes, elapsedSeconds);
  const accuracy = calcAccuracy(liveStats.correctKeystrokes, totalTyped || 1);
  const progress = calcProgress(currentIndex, content.length);

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

  const keysPreview = useMemo(() => {
    if (!lessonFocus || lessonFocus === "mixed") return null;
    const regionDescription: Record<string, { keys: string; description: string }> = {
      "home-row": {
        keys: "A S D F J K L ;",
        description: "Home Row — keep fingers anchored here.",
      },
      "top-row": {
        keys: "Q W E R T Y U I O P",
        description: "Top Row Reach — reach upward, then return.",
      },
      "bottom-row": {
        keys: "Z X C V B N M , . /",
        description: "Bottom Row Reach — drop fingers down, then reset.",
      },
      numbers: {
        keys: "1 2 3 4 5 6 7 8 9 0",
        description: "Number Row reaches.",
      },
      symbols: {
        keys: "- = [ ] \\ ; ' , . /",
        description: "Symbols reaches.",
      },
    };
    return regionDescription[lessonFocus] || null;
  }, [lessonFocus]);

  // Customizer styling overrides mapping
  const sizeClass =
    fontSize === "large"
      ? "typing-size-large"
      : fontSize === "xl"
        ? "typing-size-xl"
        : "typing-size-normal";

  const fontClass =
    fontFamily === "sans"
      ? "font-typing-sans"
      : fontFamily === "serif"
        ? "font-typing-serif"
        : fontFamily === "dyslexic"
          ? "font-typing-dyslexic"
          : "font-typing-mono";

  // Pre-practice Hand posture display helper
  const renderHandOverlay = () => {
    const isHome = lessonFocus === "home-row";
    const isTop = lessonFocus === "top-row";
    const isBottom = lessonFocus === "bottom-row";

    return (
      <div className="mt-4 p-4 border border-amber-200/50 bg-[#fffdfa]/50 rounded-lg space-y-3">
        <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest text-center">
          Finger Placement Guide
        </p>
        <div className="hand-guide-container">
          {/* Left hand */}
          <div className="hand-visual text-center space-y-1.5">
            <span className="text-[10px] font-bold text-stone-700">Left Hand</span>
            <div className="flex justify-center gap-1">
              <span className={`finger-badge ${isHome ? "finger-badge-active" : "finger-badge-inactive"}`} title="Pinky (A)">Pinky</span>
              <span className={`finger-badge ${isHome || isTop ? "finger-badge-active" : "finger-badge-inactive"}`} title="Ring (S/W)">Ring</span>
              <span className={`finger-badge ${isHome || isTop || isBottom ? "finger-badge-active" : "finger-badge-inactive"}`} title="Middle (D/E/C)">Mid</span>
              <span className={`finger-badge ${isHome || isTop || isBottom ? "finger-badge-active" : "finger-badge-inactive"}`} title="Index (F/R/T/G/V/B)">Index</span>
            </div>
            <p className="text-[9px] text-stone-400">Anchor left index on F bump</p>
          </div>

          {/* Right hand */}
          <div className="hand-visual text-center space-y-1.5">
            <span className="text-[10px] font-bold text-stone-700">Right Hand</span>
            <div className="flex justify-center gap-1">
              <span className={`finger-badge ${isHome || isTop || isBottom ? "finger-badge-active" : "finger-badge-inactive"}`} title="Index (J/Y/U/H/N/M)">Index</span>
              <span className={`finger-badge ${isHome || isTop || isBottom ? "finger-badge-active" : "finger-badge-inactive"}`} title="Middle (K/I/,)">Mid</span>
              <span className={`finger-badge ${isHome || isTop ? "finger-badge-active" : "finger-badge-inactive"}`} title="Ring (L/O/.)">Ring</span>
              <span className={`finger-badge ${isHome ? "finger-badge-active" : "finger-badge-inactive"}`} title="Pinky (;/P//)">Pinky</span>
            </div>
            <p className="text-[9px] text-stone-400">Anchor right index on J bump</p>
          </div>
        </div>
      </div>
    );
  };

  // Redirect to completed session review
  if (isFinished && finalSummary) {
    return (
      <div className="relative min-h-screen">
        {/* Render Confetti Pieces */}
        {confetti.map((c) => (
          <div
            key={c.id}
            className="confetti-piece"
            style={{
              left: c.left,
              backgroundColor: c.color,
              animationDelay: c.delay,
              animationDuration: c.duration,
            }}
          />
        ))}

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
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-white shadow-md border border-amber-100 p-6 max-w-3xl mx-auto relative ${focusMode ? "my-8" : ""}`}>
      {/* Immersion Focus Toggle Icon */}
      <button
        onClick={() => setFocusMode(!focusMode)}
        className="absolute top-4 right-4 text-stone-400 hover:text-amber-800 transition p-1.5 rounded-lg hover:bg-stone-50 border border-stone-200/20"
        title={focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
        aria-label={focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
      >
        {focusMode ? "👓 Normal" : "👁️ Focus"}
      </button>

      {/* Focus Mode Title */}
      {focusMode && !isStarted && (
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider text-center mb-4">
          Focus Practice Active
        </p>
      )}

      {/* Stats bar (Hidden in Focus/Low Distraction Mode once typing starts) */}
      {!((focusMode || lowDistraction) && isStarted) && (
        <div className="flex items-center justify-between mb-6 text-sm pr-12">
          <div className="flex gap-6">
            <div>
              <span className="text-stone-400">Speed:</span>{" "}
              <strong
                className="font-bold text-stone-700 font-mono text-base"
                aria-live="polite"
                aria-label={`${wpm} words per minute`}
              >
                {wpm} <span className="text-[10px] font-normal text-stone-400">WPM</span>
              </strong>
            </div>
            <div>
              <span className="text-stone-400">Accuracy:</span>{" "}
              <strong
                className="font-bold text-stone-700 font-mono text-base"
                aria-live="polite"
                aria-label={`${accuracy} percent accuracy`}
              >
                {accuracy}%
              </strong>
            </div>
            <div>
              <span className="text-stone-400">Mistakes:</span>{" "}
              <strong
                className={`font-bold font-mono text-base ${
                  mistakeCount > 5 ? "text-red-600" : "text-stone-700"
                }`}
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
      )}

      {/* Progress bar (Hidden in Focus/Low Distraction Mode once typing starts) */}
      {!((focusMode || lowDistraction) && isStarted) && (
        <div
          className="w-full bg-stone-100 rounded-full h-2 mb-6"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${progress} percent complete`}
        >
          <div
            className="bg-amber-500 h-2 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Target text display wrapper */}
      <div className="relative">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Current expected key: {currentExpected}
          {currentTyped ? `. Last typed key: ${currentTyped} — does not match.` : ""}
        </p>
        <div
          className={`typing-surface ${fontClass} ${sizeClass} mb-6 p-4 bg-stone-50 rounded-lg select-none transition-opacity duration-150 border border-stone-200/60 whitespace-pre-wrap ${
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

            const displayChar = char === " " ? "\u00A0" : char;

            return (
              <span
                key={i}
                className={className}
                aria-current={i === typedText.length ? "true" : undefined}
              >
                {displayChar}
                {i < typedText.length && typedText[i] !== char && (
                  <span className="sr-mistake-marker" aria-hidden="true">
                    !
                  </span>
                )}
              </span>
            );
          })}
        </div>

        {/* Paused Screen Overlay */}
        {isPaused && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100/70 backdrop-blur-xs rounded-lg border border-amber-200"
            role="dialog"
            aria-label="Practice paused"
          >
            <span className="text-stone-800 font-bold text-lg mb-2" aria-hidden="true">
              ⏸️ Practice Paused
            </span>
            <p className="text-xs text-stone-500 mb-4">
              Press{" "}
              <kbd className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-300 font-sans text-[10px]">
                Esc
              </kbd>{" "}
              or click below to resume.
            </p>
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
          <div className="warm-card p-5 border-amber-200 bg-[#fffdfa]/30">
            <div className="flex items-start gap-3">
              <span className="text-amber-600 text-base mt-0.5" aria-hidden="true">
                📖
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Get ready
                </p>
                <h2 className="mt-0.5 font-bold text-stone-900 text-lg">{title}</h2>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                  {lessonFocus ? (
                    <>
                      Focus:{" "}
                      <strong className="text-stone-800">
                        {lessonFocus.replace(/-/g, " ")}
                      </strong>
                      .{" "}
                    </>
                  ) : (
                    ""
                  )}
                  Estimated time is {estimatedDuration} minute
                  {estimatedDuration === 1 ? "" : "s"} at a comfortable pace.
                </p>

                {/* Hand Guidance Overlays */}
                {lessonFocus && lessonFocus !== "mixed" && renderHandOverlay()}

                {keysPreview ? (
                  <div className="mt-3 rounded-lg border border-amber-200 bg-white/75 p-3 text-xs text-stone-600">
                    <p className="font-mono text-amber-800 font-semibold tracking-wider">
                      {keysPreview.keys}
                    </p>
                    <p className="mt-1 text-stone-500 leading-relaxed">{keysPreview.description}</p>
                  </div>
                ) : (
                  uniqueChars && (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-white/75 p-3 text-xs text-stone-600">
                      <p>
                        <span className="font-semibold text-stone-700">Keys:</span>{" "}
                        <span className="font-mono text-amber-800">{uniqueChars}</span>
                      </p>
                    </div>
                  )
                )}
                <div className="mt-3 text-xs font-semibold text-amber-700">
                  Accuracy matters most. Start typing whenever you are ready.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center text-xs text-stone-400">
            <div id="typing-input-help">
              <span>Press </span>
              <kbd className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-300 font-sans text-[10px]">
                Esc
              </kbd>
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