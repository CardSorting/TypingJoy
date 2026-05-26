/** [LAYER: DOMAIN] */
// Pure calculation functions — no I/O, no side effects.

/**
 * Calculate Words Per Minute (WPM).
 * Standard: 1 word = 5 keystrokes (including correct keystrokes).
 */
export function calcWpm(
  correctKeystrokes: number,
  elapsedSeconds: number,
): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const words = correctKeystrokes / 5;
  return Math.round((words / minutes) * 10) / 10;
}

/**
 * Calculate accuracy as percentage of correct keystrokes over total.
 */
export function calcAccuracy(
  correctKeystrokes: number,
  totalKeystrokes: number,
): number {
  if (totalKeystrokes <= 0) return 100;
  return Math.round((correctKeystrokes / totalKeystrokes) * 1000) / 10;
}

/**
 * Calculate typing progress as a percentage.
 */
export function calcProgress(
  currentPosition: number,
  totalLength: number,
): number {
  if (totalLength <= 0) return 0;
  return Math.round((currentPosition / totalLength) * 100);
}

/**
 * Format seconds into a human-readable duration string like "2m 30s".
 */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  if (seconds === 0) return `${minutes}m`;
  return `${minutes}m ${seconds}s`;
}

/**
 * Calculate mistake count by comparing typed text against target text
 * character by character up to the typed length.
 */
export function countMistakes(
  typedText: string,
  targetText: string,
): { mistakes: number; correctKeystrokes: number } {
  let mistakes = 0;
  let correctKeystrokes = 0;
  const minLen = Math.min(typedText.length, targetText.length);

  for (let i = 0; i < minLen; i++) {
    if (typedText[i] === targetText[i]) {
      correctKeystrokes++;
    } else {
      mistakes++;
    }
  }

  return { mistakes, correctKeystrokes };
}