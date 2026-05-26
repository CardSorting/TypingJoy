/**
 * [LAYER: CORE]
 * settings.ts — Centralized settings manager for TypingJoy touch-typing academy.
 * Provides hydration-safe localStorage helpers, typed structures, and comfort mode defaults.
 */

export type ComfortMode = "calm-beginner" | "accuracy-first" | "speed-builder";
export type ThemeType = "cream" | "chalkboard" | "white";
export type FontSize = "normal" | "large" | "xl";
export type FontStyle = "mono" | "sans" | "serif" | "dyslexic";
export type SoundType = "typewriter" | "mechanical" | "none";

export interface StudentSettings {
  profileName: string;
  theme: ThemeType;
  fontSize: FontSize;
  fontFamily: FontStyle;
  soundType: SoundType;
  volume: number;
  autoFocusMode: boolean;
  targetWpm: number;
  reducedMotion: boolean;
  comfortMode: ComfortMode;
  onboardingCompleted: boolean;
  onboardingDate: string;
  focusContrast: "normal" | "high";
  lowDistraction: boolean;
  compactUi: boolean;
}

export const DEFAULT_SETTINGS: StudentSettings = {
  profileName: "Learner Scribe",
  theme: "cream",
  fontSize: "normal",
  fontFamily: "mono",
  soundType: "typewriter",
  volume: 50,
  autoFocusMode: false,
  targetWpm: 25,
  reducedMotion: false,
  comfortMode: "calm-beginner",
  onboardingCompleted: false,
  onboardingDate: "",
  focusContrast: "normal",
  lowDistraction: false,
  compactUi: false,
};

export const COMFORT_MODE_CONFIGS: Record<ComfortMode, Partial<StudentSettings>> = {
  "calm-beginner": {
    targetWpm: 15,
    autoFocusMode: false,
    fontSize: "large",
    fontFamily: "mono",
    soundType: "typewriter",
    volume: 50,
    reducedMotion: false,
  },
  "accuracy-first": {
    targetWpm: 25,
    autoFocusMode: false,
    fontSize: "normal",
    fontFamily: "mono",
    soundType: "typewriter",
    volume: 60,
    reducedMotion: false,
  },
  "speed-builder": {
    targetWpm: 40,
    autoFocusMode: true,
    fontSize: "normal",
    fontFamily: "mono",
    soundType: "mechanical",
    volume: 45,
    reducedMotion: false,
  },
};

/**
 * Hydration-safe settings retriever.
 */
export function getLocalSettings(): StudentSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const profileName = localStorage.getItem("typingjoy_profile_name") || DEFAULT_SETTINGS.profileName;
    const theme = (localStorage.getItem("typingjoy_theme") as ThemeType) || DEFAULT_SETTINGS.theme;
    const fontSize = (localStorage.getItem("typingjoy_font_size") as FontSize) || DEFAULT_SETTINGS.fontSize;
    const fontFamily = (localStorage.getItem("typingjoy_font_family") as FontStyle) || DEFAULT_SETTINGS.fontFamily;
    const soundType = (localStorage.getItem("typingjoy_sound_type") as SoundType) || DEFAULT_SETTINGS.soundType;
    const volume = parseInt(localStorage.getItem("typingjoy_volume") || String(DEFAULT_SETTINGS.volume), 10);
    const autoFocusMode = localStorage.getItem("typingjoy_auto_focus") === "true";
    const targetWpm = parseInt(localStorage.getItem("typingjoy_target_wpm") || String(DEFAULT_SETTINGS.targetWpm), 10);
    const reducedMotion = localStorage.getItem("typingjoy_reduced_motion") === "true";
    const comfortMode = (localStorage.getItem("typingjoy_comfort_mode") as ComfortMode) || DEFAULT_SETTINGS.comfortMode;
    const onboardingCompleted = localStorage.getItem("typingjoy_onboarding_completed") === "true";
    const onboardingDate = localStorage.getItem("typingjoy_onboarding_date") || DEFAULT_SETTINGS.onboardingDate;
    const focusContrast = (localStorage.getItem("typingjoy_focus_contrast") as "normal" | "high") || DEFAULT_SETTINGS.focusContrast;
    const lowDistraction = localStorage.getItem("typingjoy_low_distraction") === "true";
    const compactUi = localStorage.getItem("typingjoy_compact_ui") === "true";

    return {
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
      onboardingCompleted,
      onboardingDate,
      focusContrast,
      lowDistraction,
      compactUi,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Saves settings to localStorage and applies immediate visual changes.
 */
export function saveLocalSettings(settings: Partial<StudentSettings>): void {
  if (typeof window === "undefined") return;

  try {
    if (settings.profileName !== undefined) localStorage.setItem("typingjoy_profile_name", settings.profileName);
    if (settings.theme !== undefined) {
      localStorage.setItem("typingjoy_theme", settings.theme);
      document.documentElement.setAttribute("data-theme", settings.theme);
    }
    if (settings.fontSize !== undefined) localStorage.setItem("typingjoy_font_size", settings.fontSize);
    if (settings.fontFamily !== undefined) localStorage.setItem("typingjoy_font_family", settings.fontFamily);
    if (settings.soundType !== undefined) localStorage.setItem("typingjoy_sound_type", settings.soundType);
    if (settings.volume !== undefined) localStorage.setItem("typingjoy_volume", String(settings.volume));
    if (settings.autoFocusMode !== undefined) localStorage.setItem("typingjoy_auto_focus", String(settings.autoFocusMode));
    if (settings.targetWpm !== undefined) localStorage.setItem("typingjoy_target_wpm", String(settings.targetWpm));
    if (settings.reducedMotion !== undefined) localStorage.setItem("typingjoy_reduced_motion", String(settings.reducedMotion));
    if (settings.comfortMode !== undefined) localStorage.setItem("typingjoy_comfort_mode", settings.comfortMode);
    if (settings.onboardingCompleted !== undefined) localStorage.setItem("typingjoy_onboarding_completed", String(settings.onboardingCompleted));
    if (settings.onboardingDate !== undefined) localStorage.setItem("typingjoy_onboarding_date", settings.onboardingDate);
    if (settings.focusContrast !== undefined) {
      localStorage.setItem("typingjoy_focus_contrast", settings.focusContrast);
      document.documentElement.setAttribute("data-focus-contrast", settings.focusContrast);
    }
    if (settings.lowDistraction !== undefined) localStorage.setItem("typingjoy_low_distraction", String(settings.lowDistraction));
    if (settings.compactUi !== undefined) {
      localStorage.setItem("typingjoy_compact_ui", String(settings.compactUi));
      document.documentElement.setAttribute("data-compact", String(settings.compactUi));
    }
  } catch (e) {
    console.error("Failed to save student settings:", e);
  }
}

export interface CachedStats {
  totalSessions: number;
  averageWpm: number;
  consistencyDaysCount: number;
}

export const DEFAULT_STATS: CachedStats = {
  totalSessions: 0,
  averageWpm: 0,
  consistencyDaysCount: 0,
};

/**
 * Hydration-safe stats retriever.
 */
export function getLocalStats(): CachedStats {
  if (typeof window === "undefined") {
    return DEFAULT_STATS;
  }
  try {
    const storedStats = localStorage.getItem("typingjoy_cached_stats");
    if (storedStats) {
      const parsed = JSON.parse(storedStats);
      return {
        totalSessions: typeof parsed.totalSessions === "number" ? parsed.totalSessions : 0,
        averageWpm: typeof parsed.averageWpm === "number" ? parsed.averageWpm : 0,
        consistencyDaysCount: typeof parsed.consistencyDaysCount === "number" ? parsed.consistencyDaysCount : 0,
      };
    }
  } catch (e) {
    console.error("Failed to get local stats:", e);
  }
  return DEFAULT_STATS;
}

/**
 * Saves cached stats to localStorage.
 */
export function saveLocalStats(stats: CachedStats): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("typingjoy_cached_stats", JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to save local stats:", e);
  }
}
