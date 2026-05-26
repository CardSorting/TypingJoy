/**
 * [LAYER: UI]
 * OnboardingWizard — Warm, step-by-step onboarding experience.
 * Guides new typists to set up their name and comfortable pace, introduces core concepts,
 * and routes them to their first touch-typing lesson.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveLocalSettings, saveLocalStats, ComfortMode, COMFORT_MODE_CONFIGS } from "@/src/core/utils/settings";

interface OnboardingWizardProps {
  firstLessonId: string;
}

export default function OnboardingWizard({ firstLessonId }: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [comfortMode, setComfortMode] = useState<ComfortMode>("calm-beginner");

  const handleNext = () => {
    if (step === 1 && !name.trim()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = () => {
    // 1. Get configuration based on selected Comfort Mode
    const configs = COMFORT_MODE_CONFIGS[comfortMode];

    const onboardingDate = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

    // 2. Combine and save settings
    saveLocalSettings({
      profileName: name.trim() || "Learner Scribe",
      comfortMode,
      onboardingCompleted: true,
      onboardingDate,
      ...configs,
    });

    // 3. Initialize cache stats locally to prevent layout profile empty state mismatches
    saveLocalStats({ totalSessions: 0, averageWpm: 0, consistencyDaysCount: 0 });

    // 4. Redirect to the first recommended lesson practice screen
    router.push(`/practice/${firstLessonId}`);
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-stone-850 flex items-center justify-center p-4 selection:bg-amber-100">
      <div className="max-w-xl w-full warm-card bg-white shadow-xl p-8 border border-amber-200/50 space-y-6 transition-all duration-300">
        {/* Progress header dots */}
        <div className="flex justify-between items-center text-xs text-stone-400 font-bold border-b border-stone-100 pb-4">
          <span className="text-amber-800 font-serif-academy text-base italic">🏫 TypingJoy Onboarding</span>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`h-2.5 w-2.5 rounded-full border transition ${
                  step === s
                    ? "bg-amber-600 border-amber-700 shadow-sm"
                    : step > s
                      ? "bg-amber-200 border-amber-300"
                      : "bg-stone-100 border-stone-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Nickname */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded">
              Welcome
            </span>
            <h1 className="text-2xl font-extrabold text-stone-900 leading-tight">
              Let&apos;s prepare your writing desk.
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed">
              Welcome to TypingJoy touch-typing academy. First, what should your instructors and dashboard call you?
            </p>
            <div className="flex flex-col gap-1.5 pt-2">
              <label htmlFor="nickname" className="text-xs font-bold text-stone-600">
                Scribe Nickname
              </label>
              <input
                id="nickname"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="warm-input text-sm w-full"
                placeholder="e.g. Writer Scribe"
                required
                autoFocus
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleNext}
                disabled={!name.trim()}
                className="warm-button text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Choose Practice Pace →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Comfort Mode select */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded">
              Pacing
            </span>
            <h1 className="text-2xl font-extrabold text-stone-900 leading-tight">
              Choose your practice speed.
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed">
              We design touch typing to feel relaxed and safe. Select a pace that fits your level:
            </p>

            <div className="space-y-3 pt-2">
              {/* Calm Beginner */}
              <button
                type="button"
                onClick={() => setComfortMode("calm-beginner")}
                className={`w-full text-left p-4 rounded-xl border flex gap-3 transition ${
                  comfortMode === "calm-beginner"
                    ? "border-amber-600 bg-amber-50/20 shadow-xs"
                    : "border-stone-200 hover:bg-stone-50"
                }`}
              >
                <span className="text-2xl self-start">🧘</span>
                <div>
                  <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    Calm Beginner <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-mono font-bold">15 WPM Target</span>
                  </h3>
                  <p className="text-[10px] text-stone-500 mt-1 leading-relaxed">
                    Legible large fonts, gentle wood typewriter key clacks, and visible key overlays. Best for learning anchors.
                  </p>
                </div>
              </button>

              {/* Accuracy First */}
              <button
                type="button"
                onClick={() => setComfortMode("accuracy-first")}
                className={`w-full text-left p-4 rounded-xl border flex gap-3 transition ${
                  comfortMode === "accuracy-first"
                    ? "border-amber-600 bg-amber-50/20 shadow-xs"
                    : "border-stone-200 hover:bg-stone-50"
                }`}
              >
                <span className="text-2xl self-start">🎯</span>
                <div>
                  <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    Accuracy First <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-mono font-bold">25 WPM Target</span>
                  </h3>
                  <p className="text-[10px] text-stone-500 mt-1 leading-relaxed">
                    Standard fonts, quiet typewriter click feedback, and region coaching details. Best for building correct reaches.
                  </p>
                </div>
              </button>

              {/* Speed Builder */}
              <button
                type="button"
                onClick={() => setComfortMode("speed-builder")}
                className={`w-full text-left p-4 rounded-xl border flex gap-3 transition ${
                  comfortMode === "speed-builder"
                    ? "border-amber-600 bg-amber-50/20 shadow-xs"
                    : "border-stone-200 hover:bg-stone-50"
                }`}
              >
                <span className="text-2xl self-start">⚡</span>
                <div>
                  <h3 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    Speed Builder <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-mono font-bold">40 WPM Target</span>
                  </h3>
                  <p className="text-[10px] text-stone-500 mt-1 leading-relaxed">
                    Clean monospace lettering, crisp clicks, and auto-focus mode toggled on for distraction-free typing.
                  </p>
                </div>
              </button>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="warm-button-secondary text-xs"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="warm-button text-xs"
              >
                How Academy Works →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Academy tour */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded">
              Curriculum
            </span>
            <h1 className="text-2xl font-extrabold text-stone-900 leading-tight">
              Your Digital Learning Space
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed">
              Here is how your study journey in the academy will progress:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-stone-50/50 border border-stone-200/40 p-3 rounded-lg text-xs leading-relaxed">
                <h4 className="font-bold text-stone-800 mb-1">📚 Visual Path</h4>
                <p className="text-stone-500 text-[10px]">
                  Lessons are grouped into progressive Units. Pass them sequentially to unlock reaches.
                </p>
              </div>

              <div className="bg-stone-50/50 border border-stone-200/40 p-3 rounded-lg text-xs leading-relaxed">
                <h4 className="font-bold text-stone-800 mb-1">🧠 Tactile Diagnostic</h4>
                <p className="text-stone-500 text-[10px]">
                  Your desk lists your weak keys, region errors, and confusion logs after each practice.
                </p>
              </div>

              <div className="bg-stone-50/50 border border-stone-200/40 p-3 rounded-lg text-xs leading-relaxed">
                <h4 className="font-bold text-stone-800 mb-1">👁️ Focus Mode</h4>
                <p className="text-stone-500 text-[10px]">
                  Toggle Focus to collapse all stats and sidebars during typing practice.
                </p>
              </div>

              <div className="bg-stone-50/50 border border-stone-200/40 p-3 rounded-lg text-xs leading-relaxed">
                <h4 className="font-bold text-stone-800 mb-1">🎖️ Academy Seals</h4>
                <p className="text-stone-500 text-[10px]">
                  Collect Gold Seals for 98%+ precision, Silver for 95%+, and Bronze for 90%+.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                className="warm-button-secondary text-xs"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="warm-button text-xs"
              >
                Unlock First Lesson & Start! 🔑
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
