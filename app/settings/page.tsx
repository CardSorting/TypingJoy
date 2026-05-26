/**
 * [LAYER: UI]
 * SettingsPage — Student desk personalization console.
 * Binds visual themes, sizing options, keyboard sounds, volume sliders,
 * and practice aids to localStorage, providing instant styling updates.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "@/src/ui/components/AppLayout";
import {
  getLocalSettings,
  saveLocalSettings,
  getLocalStats,
  saveLocalStats,
  ComfortMode,
  ThemeType,
  FontSize,
  FontStyle,
  SoundType,
  COMFORT_MODE_CONFIGS,
} from "@/src/core/utils/settings";

export default function SettingsPage() {
  const [profileName, setProfileName] = useState("Learner Scribe");
  const [theme, setTheme] = useState<ThemeType>("cream");
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [fontFamily, setFontFamily] = useState<FontStyle>("mono");
  const [soundType, setSoundType] = useState<SoundType>("typewriter");
  const [volume, setVolume] = useState(50);
  const [autoFocusMode, setAutoFocusMode] = useState(false);
  const [targetWpm, setTargetWpm] = useState(30);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [comfortMode, setComfortMode] = useState<ComfortMode>("calm-beginner");
  const [focusContrast, setFocusContrast] = useState<"normal" | "high">("normal");
  const [lowDistraction, setLowDistraction] = useState(false);
  const [compactUi, setCompactUi] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load configuration from localStorage on mount
  useEffect(() => {
    const settings = getLocalSettings();

    const timer = setTimeout(() => {
      setProfileName(settings.profileName);
      setTheme(settings.theme);
      setFontSize(settings.fontSize);
      setFontFamily(settings.fontFamily);
      setSoundType(settings.soundType);
      setVolume(settings.volume);
      setAutoFocusMode(settings.autoFocusMode);
      setTargetWpm(settings.targetWpm);
      setReducedMotion(settings.reducedMotion);
      setComfortMode(settings.comfortMode);
      setFocusContrast(settings.focusContrast);
      setLowDistraction(settings.lowDistraction);
      setCompactUi(settings.compactUi);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Set comfort preset values
  const applyComfortPreset = (mode: ComfortMode) => {
    setComfortMode(mode);
    const config = COMFORT_MODE_CONFIGS[mode];
    if (config.targetWpm !== undefined) setTargetWpm(config.targetWpm);
    if (config.autoFocusMode !== undefined) setAutoFocusMode(config.autoFocusMode);
    if (config.fontSize !== undefined) setFontSize(config.fontSize);
    if (config.fontFamily !== undefined) setFontFamily(config.fontFamily);
    if (config.soundType !== undefined) setSoundType(config.soundType);
    if (config.volume !== undefined) setVolume(config.volume);
    if (config.reducedMotion !== undefined) setReducedMotion(config.reducedMotion);
    if (config.focusContrast !== undefined) setFocusContrast(config.focusContrast);
    if (config.lowDistraction !== undefined) setLowDistraction(config.lowDistraction);
    if (config.compactUi !== undefined) setCompactUi(config.compactUi);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    saveLocalSettings({
      profileName,
      theme,
      fontSize,
      fontFamily,
      soundType,
      volume,
      autoFocusMode,
      targetWpm,
      reducedMotion,
      comfortMode,
      focusContrast,
      lowDistraction,
      compactUi,
    });

    // Apply cached stats mock updates if needed
    const currentStats = getLocalStats();
    saveLocalStats(currentStats);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="border-b border-stone-100 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-amber-800">⚙️ Academy Settings</h1>
            <p className="text-xs text-stone-500 mt-1">
              Personalize your typewriter layout, study desk theme, and typing targets.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-4 text-xs font-semibold animate-fade-in flex items-center gap-2">
            ✅ Settings saved successfully! Changes are applied instantly across the academy.
          </div>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity Section */}
          <div className="warm-card p-5 bg-white space-y-4">
            <h2 className="text-sm font-bold text-stone-800 border-b border-stone-100 pb-2">
              Student Identity
            </h2>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profileName" className="text-xs font-bold text-stone-600">
                Scribe Profile Name
              </label>
              <input
                id="profileName"
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="warm-input text-sm w-full max-w-md"
                placeholder="Enter your name"
                required
              />
              <p className="text-[10px] text-stone-400">
                This name greets you on your desk dashboard and identifies your progress ledger.
              </p>
            </div>
          </div>

          {/* Comfort Mode Presets Section */}
          <div className="warm-card p-5 bg-white space-y-4">
            <h2 className="text-sm font-bold text-stone-800 border-b border-stone-100 pb-2">
              Academy Comfort Mode Preset
            </h2>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Applying a comfort mode preset configures your visual scale, metronome target, and feedback sounds. You can still customize individual metrics below.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "calm-beginner", label: "🧘 Calm Beginner", desc: "15 WPM Target · Large text" },
                { id: "accuracy-first", label: "🎯 Accuracy First", desc: "25 WPM Target · Normal text" },
                { id: "speed-builder", label: "⚡ Speed Builder", desc: "40 WPM Target · Focus Mode" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => applyComfortPreset(opt.id as ComfortMode)}
                  className={`flex flex-col items-center p-3 rounded-lg border text-center transition ${
                    comfortMode === opt.id
                      ? "border-amber-600 bg-amber-50/20 ring-2 ring-amber-500/20"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <span className="text-xs font-bold text-stone-800">{opt.label}</span>
                  <span className="text-[9px] text-stone-400 mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Display Theme Options */}
          <div className="warm-card p-5 bg-white space-y-4">
            <h2 className="text-sm font-bold text-stone-800 border-b border-stone-100 pb-2">
              Visual Preferences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Theme choices */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-stone-600">Classroom Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "cream", label: "Cream Paper", desc: "Warm amber layout" },
                    { id: "chalkboard", label: "Chalkboard", desc: "Soft dark green" },
                    { id: "white", label: "Pristine", desc: "Clean high contrast" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTheme(opt.id as ThemeType)}
                      className={`flex flex-col items-center p-3 rounded-lg border text-center transition ${
                        theme === opt.id
                          ? "border-amber-600 bg-amber-50/20 ring-2 ring-amber-500/20"
                          : "border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <span className="text-xs font-bold text-stone-800">{opt.label}</span>
                      <span className="text-[9px] text-stone-400 mt-1">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizing choices */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fontSize" className="text-xs font-bold text-stone-600">Typing Font Size</label>
                <select
                  id="fontSize"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value as FontSize)}
                  className="warm-input text-xs w-full"
                >
                  <option value="normal">Normal (18px text / 32px line-height)</option>
                  <option value="large">Large (22px text / 36px line-height)</option>
                  <option value="xl">Extra Large (26px text / 40px line-height)</option>
                </select>
              </div>

               {/* Font Family choices */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fontFamily" className="text-xs font-bold text-stone-600">Typing Font Style</label>
                <select
                  id="fontFamily"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value as FontStyle)}
                  className="warm-input text-xs w-full"
                >
                  <option value="mono">JetBrains Monospace (Recommended for beginners)</option>
                  <option value="sans">Outfit Sans-Serif (Friendly clean curve)</option>
                  <option value="serif">Playfair Serif (Cozy library book style)</option>
                  <option value="dyslexic">Lexend Friendly (Optimized for reading speed & dyslexia)</option>
                </select>
              </div>

              {/* Reduced motion check */}
              <div className="flex items-center gap-3 mt-4">
                <input
                  id="reducedMotion"
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="reducedMotion" className="text-xs font-semibold text-stone-600 cursor-pointer select-none">
                  Enable Reduced Motion (Simpler celebrations)
                </label>
              </div>
            </div>
          </div>

          {/* Environmental Controls Section */}
          <div className="warm-card p-5 bg-white space-y-4">
            <h2 className="text-sm font-bold text-stone-800 border-b border-stone-100 pb-2">
              Environmental & Focus Controls
            </h2>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Fine-tune your writing chamber visual intensity, spacing density, and dashboard feedback overlays.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Focus Contrast Toggles */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-stone-600">Focus Contrast Density</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "normal", label: "Steady Contrast", desc: "Warm ambient glow" },
                    { id: "high", label: "High Contrast", desc: "Deeper character focus" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFocusContrast(opt.id as "normal" | "high")}
                      className={`flex flex-col items-center p-3 rounded-lg border text-center transition ${
                        focusContrast === opt.id
                          ? "border-amber-600 bg-amber-50/20 ring-2 ring-amber-500/20"
                          : "border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <span className="text-xs font-bold text-stone-800">{opt.label}</span>
                      <span className="text-[9px] text-stone-400 mt-1">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3">
                {/* Low Distraction checkbox */}
                <div className="flex items-center gap-3">
                  <input
                    id="lowDistraction"
                    type="checkbox"
                    checked={lowDistraction}
                    onChange={(e) => setLowDistraction(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="lowDistraction" className="text-xs font-semibold text-stone-600 cursor-pointer select-none">
                    Enable Low Distraction Practice Mode
                  </label>
                </div>
                <p className="text-[10px] text-stone-400 pl-7 leading-normal">
                  Hides live statistics (speed, errors, and progress bars) while typing to focus solely on character shape and touch feel.
                </p>

                {/* Compact UI checkbox */}
                <div className="flex items-center gap-3 mt-1">
                  <input
                    id="compactUi"
                    type="checkbox"
                    checked={compactUi}
                    onChange={(e) => setCompactUi(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="compactUi" className="text-xs font-semibold text-stone-600 cursor-pointer select-none">
                    Compact Campus Layouts
                  </label>
                </div>
                <p className="text-[10px] text-stone-400 pl-7 leading-normal">
                  Reduces card margins and layout padding. Recommended for smaller screens or compact keyboards.
                </p>
              </div>
            </div>
          </div>

          {/* Typing sounds & feedback */}
          <div className="warm-card p-5 bg-white space-y-4">
            <h2 className="text-sm font-bold text-stone-800 border-b border-stone-100 pb-2">
              Audio Feedback & Targets
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Typewriter sound toggles */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="soundType" className="text-xs font-bold text-stone-600">Typing Sound effects</label>
                <select
                  id="soundType"
                  value={soundType}
                  onChange={(e) => setSoundType(e.target.value as SoundType)}
                  className="warm-input text-xs w-full"
                >
                  <option value="typewriter">Gentle Wooden Typewriter (clack)</option>
                  <option value="mechanical">Mechanical Keyboard Switch (click)</option>
                  <option value="none">Muted / Silence</option>
                </select>
              </div>

              {/* Volume Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="volume" className="text-xs font-bold text-stone-600">Sound Volume</label>
                  <span className="text-[10px] text-stone-400 font-mono font-bold">{volume}%</span>
                </div>
                <input
                  id="volume"
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value, 10))}
                  disabled={soundType === "none"}
                  className="w-full accent-amber-600 cursor-pointer h-2 bg-stone-100 rounded-lg appearance-none"
                />
              </div>

              {/* WPM target setting */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="targetWpm" className="text-xs font-bold text-stone-600">Target Typing Speed (WPM)</label>
                <input
                  id="targetWpm"
                  type="number"
                  min="10"
                  max="120"
                  value={targetWpm}
                  onChange={(e) => setTargetWpm(parseInt(e.target.value, 10) || 30)}
                  className="warm-input text-xs w-full"
                />
              </div>

              {/* Auto Focus Mode */}
              <div className="space-y-2 mt-4 col-span-1 md:col-span-2">
                <div className="flex items-center gap-3">
                  <input
                    id="autoFocus"
                    type="checkbox"
                    checked={autoFocusMode}
                    onChange={(e) => setAutoFocusMode(e.target.checked)}
                    className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="autoFocus" className="text-xs font-semibold text-stone-600 cursor-pointer select-none">
                    Automatically start practices in Focus Mode
                  </label>
                </div>
                <p className="text-[10px] text-stone-500 leading-relaxed pl-7">
                  Focus Mode is a premium distraction-free environment that collapses the navigation sidebar and header, leaving only the writing board visible. You can toggle this live at any time by clicking the eye icon on the practice desk. Learn more about writing rhythm or practice customized texts on the <Link href="/custom-texts" className="text-amber-700 hover:text-amber-800 underline font-semibold">Custom Practice page</Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Link
              href="/dashboard"
              className="warm-button-secondary text-xs"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="warm-button text-xs"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
