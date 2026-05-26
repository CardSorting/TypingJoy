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

export interface CharacterMistake {
  expected: string;
  typed: string;
  index: number;
}

interface KeyMetadata {
  finger: string;
  region: string;
  advice: string;
}

const KEY_METADATA: Record<string, KeyMetadata> = {
  "1": {
    finger: "Left pinky finger",
    region: "Number row",
    advice: "Reach straight up from A, then return to the home row.",
  },
  "2": {
    finger: "Left ring finger",
    region: "Number row",
    advice: "Reach up from S with a small, controlled motion.",
  },
  "3": {
    finger: "Left middle finger",
    region: "Number row",
    advice: "Lift from D to the number row, then settle back to home position.",
  },
  "4": {
    finger: "Left index finger",
    region: "Number row",
    advice: "Use your left index finger and return it to F after the reach.",
  },
  "5": {
    finger: "Left index finger",
    region: "Number row",
    advice: "Let your left index finger stretch up and right without moving the whole hand.",
  },
  "6": {
    finger: "Right index finger",
    region: "Number row",
    advice: "Reach up and left with your right index finger, then return to J.",
  },
  "7": {
    finger: "Right index finger",
    region: "Number row",
    advice: "Reach straight up from J with a brief accuracy pause.",
  },
  "8": {
    finger: "Right middle finger",
    region: "Number row",
    advice: "Lift from K to the number row and keep the rest of the hand relaxed.",
  },
  "9": {
    finger: "Right ring finger",
    region: "Number row",
    advice: "Reach upward from L, then return to the home row.",
  },
  "0": {
    finger: "Right pinky finger",
    region: "Number row",
    advice: "Use a gentle pinky reach and slow down before pressing.",
  },
  a: {
    finger: "Left pinky finger",
    region: "Home row",
    advice: "Keep your left pinky resting lightly on A.",
  },
  q: {
    finger: "Left pinky finger",
    region: "Top row reach",
    advice: "Reach directly upward from A to Q, then come back home.",
  },
  z: {
    finger: "Left pinky finger",
    region: "Bottom row reach",
    advice: "Drop your left pinky from A to Z without turning your wrist.",
  },
  s: {
    finger: "Left ring finger",
    region: "Home row",
    advice: "Let your left ring finger settle naturally on S.",
  },
  w: {
    finger: "Left ring finger",
    region: "Top row reach",
    advice: "Reach up from S to W with a small lift.",
  },
  x: {
    finger: "Left ring finger",
    region: "Bottom row reach",
    advice: "Drop from S to X, then return to the home row.",
  },
  d: {
    finger: "Left middle finger",
    region: "Home row",
    advice: "Center your left middle finger over D before pressing.",
  },
  e: {
    finger: "Left middle finger",
    region: "Top row reach",
    advice: "Reach up from D to E and keep the motion small.",
  },
  c: {
    finger: "Left middle finger",
    region: "Bottom row reach",
    advice: "Drop from D to C, then reset your hand position.",
  },
  f: {
    finger: "Left index finger",
    region: "Home row",
    advice: "Use the F key bump as your home-row anchor.",
  },
  r: {
    finger: "Left index finger",
    region: "Top row reach",
    advice: "Reach from F to R, then return your index finger to F.",
  },
  t: {
    finger: "Left index finger",
    region: "Top row reach",
    advice: "Reach up and slightly right from F with your left index finger.",
  },
  g: {
    finger: "Left index finger",
    region: "Home row reach",
    advice: "Slide right from F to G, then return to the F key bump.",
  },
  v: {
    finger: "Left index finger",
    region: "Bottom row reach",
    advice: "Drop from F to V with a relaxed wrist.",
  },
  b: {
    finger: "Left index finger",
    region: "Bottom row reach",
    advice: "Stretch down and right from F, then reset to home row.",
  },
  j: {
    finger: "Right index finger",
    region: "Home row",
    advice: "Use the J key bump as your right-hand anchor.",
  },
  u: {
    finger: "Right index finger",
    region: "Top row reach",
    advice: "Reach up and slightly left from J to U.",
  },
  y: {
    finger: "Right index finger",
    region: "Top row reach",
    advice: "Reach up and left from J with a quiet hand position.",
  },
  h: {
    finger: "Right index finger",
    region: "Home row reach",
    advice: "Slide left from J to H, then return to the J key bump.",
  },
  n: {
    finger: "Right index finger",
    region: "Bottom row reach",
    advice: "Drop down and left from J, then reset to home row.",
  },
  m: {
    finger: "Right index finger",
    region: "Bottom row reach",
    advice: "Reach down and slightly right from J with a relaxed hand.",
  },
  k: {
    finger: "Right middle finger",
    region: "Home row",
    advice: "Keep your right middle finger centered over K.",
  },
  i: {
    finger: "Right middle finger",
    region: "Top row reach",
    advice: "Reach up from K to I, then return to home row.",
  },
  ",": {
    finger: "Right middle finger",
    region: "Bottom row reach",
    advice: "Drop from K to comma without shifting your whole hand.",
  },
  l: {
    finger: "Right ring finger",
    region: "Home row",
    advice: "Let your right ring finger rest naturally on L.",
  },
  o: {
    finger: "Right ring finger",
    region: "Top row reach",
    advice: "Reach up from L to O with a small lift.",
  },
  ".": {
    finger: "Right ring finger",
    region: "Bottom row reach",
    advice: "Drop from L to period and return to home row.",
  },
  ";": {
    finger: "Right pinky finger",
    region: "Home row",
    advice: "Rest your right pinky on semicolon and press gently.",
  },
  p: {
    finger: "Right pinky finger",
    region: "Top row reach",
    advice: "Reach up from semicolon to P without lifting the whole hand.",
  },
  "/": {
    finger: "Right pinky finger",
    region: "Bottom row reach",
    advice: "Drop your right pinky to slash, then return to semicolon.",
  },
  " ": {
    finger: "Thumb",
    region: "Spacebar",
    advice: "Tap the spacebar lightly with whichever thumb feels natural.",
  },
  "-": {
    finger: "Right pinky finger",
    region: "Number row reach",
    advice: "Slow down for the pinky reach and return to home row.",
  },
  "=": {
    finger: "Right pinky finger",
    region: "Number row reach",
    advice: "Use a careful right-pinky reach and keep your wrist relaxed.",
  },
  "'": {
    finger: "Right pinky finger",
    region: "Home row reach",
    advice: "Slide your right pinky from semicolon to apostrophe.",
  },
  "[": {
    finger: "Right pinky finger",
    region: "Top row reach",
    advice: "Reach up and right with the pinky, then return to home row.",
  },
  "]": {
    finger: "Right pinky finger",
    region: "Top row reach",
    advice: "Use a careful pinky reach and reset before the next key.",
  },
  "\\": {
    finger: "Right pinky finger",
    region: "Top row reach",
    advice: "Pause briefly for the far pinky reach.",
  },
};

const SHIFT_SYMBOL_BASE_KEYS: Record<string, string> = {
  "!": "1",
  "@": "2",
  "#": "3",
  "$": "4",
  "%": "5",
  "^": "6",
  "&": "7",
  "*": "8",
  "(": "9",
  ")": "0",
  "_": "-",
  "+": "=",
  ":": ";",
  '"': "'",
  "<": ",",
  ">": ".",
  "?": "/",
  "{": "[",
  "}": "]",
  "|": "\\",
};

function normalizeExpectedKey(char: string): string | null {
  if (!char) return null;
  if (/\s/.test(char)) return " ";
  return char.toLowerCase();
}

function sameTypedKey(expected: string, typed: string): boolean {
  const normalizedExpected = normalizeExpectedKey(expected);
  const normalizedTyped = normalizeExpectedKey(typed);
  if (normalizedExpected === " " && normalizedTyped === " ") return true;
  return expected === typed;
}

export function describeKey(key: string): KeyMetadata {
  const normalized = normalizeExpectedKey(key) || key;
  const baseKey = SHIFT_SYMBOL_BASE_KEYS[normalized] || normalized;
  const baseMetadata = KEY_METADATA[baseKey];

  if (baseMetadata) {
    return SHIFT_SYMBOL_BASE_KEYS[normalized]
      ? {
          finger: `${baseMetadata.finger} with Shift`,
          region: baseMetadata.region,
          advice: "Coordinate Shift first, then press the target key slowly.",
        }
      : baseMetadata;
  }

  return {
    finger: "Standard keyboard reach",
    region: /[^\w\s]/.test(normalized) ? "Symbols" : "Keyboard",
    advice: "Slow the sequence down and let accuracy train the reach.",
  };
}

export function displayKeyLabel(key: string): string {
  const normalized = normalizeExpectedKey(key);
  if (normalized === " ") return "space";
  if (normalized === "\n") return "enter";
  return normalized || key;
}

export function getCharacterMistakes(
  typedText: string,
  targetText: string,
): CharacterMistake[] {
  const mistakes: CharacterMistake[] = [];
  const compareLength = Math.min(typedText.length, targetText.length);

  for (let i = 0; i < compareLength; i++) {
    if (!sameTypedKey(targetText[i], typedText[i])) {
      const expected = normalizeExpectedKey(targetText[i]);
      if (expected) {
        mistakes.push({ expected, typed: typedText[i], index: i });
      }
    }
  }

  for (let i = compareLength; i < targetText.length; i++) {
    const expected = normalizeExpectedKey(targetText[i]);
    if (expected) {
      mistakes.push({ expected, typed: "", index: i });
    }
  }

  return mistakes;
}

export function getWeakKeyAdviceFromTexts(
  sessions: Array<{ typedText: string; targetText: string }>,
  limit = 3,
) {
  const mistakeCounts = new Map<string, number>();

  sessions.forEach((session) => {
    const perSessionCounts = new Map<string, number>();
    getCharacterMistakes(session.typedText, session.targetText).forEach((mistake) => {
      perSessionCounts.set(
        mistake.expected,
        (perSessionCounts.get(mistake.expected) || 0) + 1,
      );
    });

    perSessionCounts.forEach((count, key) => {
      const cappedCount = Math.min(count, 8);
      mistakeCounts.set(key, (mistakeCounts.get(key) || 0) + cappedCount);
    });
  });

  return Array.from(mistakeCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([key, count]) => {
      const metadata = describeKey(key);
      return {
        key: displayKeyLabel(key),
        count,
        finger: metadata.finger,
        region: metadata.region,
        advice: metadata.advice,
      };
    });
}

export function summarizeTypingResult(accuracy: number, wpm: number): string {
  if (accuracy >= 96) {
    return wpm < 18
      ? "Your accuracy is steady. Keep the same calm rhythm and speed will grow naturally."
      : "Your accuracy and rhythm are both strong for this practice.";
  }

  if (accuracy >= 90) {
    return "This is solid practice. A repeat can help make these reaches feel easier.";
  }

  if (accuracy >= 75) {
    return "Slow, careful repetition is the right next step. Accuracy matters more than speed here.";
  }

  return "This text needs a gentler pass. Pause before the tricky keys and let your hands reset.";
}
