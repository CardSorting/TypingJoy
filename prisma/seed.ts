/** [LAYER: INFRASTRUCTURE] */

import { db } from "@/src/infrastructure/db";

async function main() {
  // Clear all tables in correct order (respecting foreign keys)
  await db.typingSession.deleteMany();
  await db.customPracticeText.deleteMany();
  await db.lesson.deleteMany();

  // ─── Beginner typing lessons ──────────────────────────────
  const lessons = [
    {
      title: "Home Row Basics",
      description:
        "Learn the home row keys — the foundation of touch typing. Keep your fingers on A S D F J K L ;",
      difficulty: "beginner",
      focus: "home-row",
      content: "asdf jkl; asdf jkl; aaa sss ddd fff jjj kkk lll ;;;",
      estimatedMinutes: 5,
    },
    {
      title: "Top Row Reach",
      description:
        "Practice reaching up to the top row keys Q W E R T Y U I O P from the home row.",
      difficulty: "beginner",
      focus: "top-row",
      content:
        "qwertyuiop qwertyuiop qaz wsx edc rfv tgb yhn ujm",
      estimatedMinutes: 5,
    },
    {
      title: "Bottom Row Strength",
      description:
        "Build strength in your bottom row fingers with Z X C V B N M and the punctuation keys.",
      difficulty: "beginner",
      focus: "bottom-row",
      content:
        "zxcvbnm,. zxcvbnm,. zzz xxx ccc vvv bbb nnn mmm",
      estimatedMinutes: 5,
    },
    {
      title: "Number Row",
      description:
        "Get comfortable with the number row. Mix numbers with letters for real-world practice.",
      difficulty: "beginner",
      focus: "numbers",
      content:
        "1234567890 1234567890 1a2s3d4f5g6h7j8k9l",
      estimatedMinutes: 5,
    },
    {
      title: "Symbol Safari",
      description:
        "Tame the special characters! Practice symbols used in coding and writing.",
      difficulty: "beginner",
      focus: "symbols",
      content:
        '!@#$%%^&*() !@#$%%^&*() asdf! jkl@ qwerty#',
      estimatedMinutes: 5,
    },
    {
      title: "Mixed Words",
      description:
        "Practice typing real words that use all rows of the keyboard.",
      difficulty: "beginner",
      focus: "mixed",
      content:
        "the quick brown fox jumps over the lazy dog",
      estimatedMinutes: 5,
    },
    {
      title: "Short Sentences",
      description:
        "Type complete sentences to build rhythm and flow in your typing.",
      difficulty: "beginner",
      focus: "mixed",
      content:
        "This is a typing lesson. Try to type each word correctly. Go slow and steady.",
      estimatedMinutes: 5,
    },
    {
      title: "Speed Builder",
      description:
        "Push your speed with encouraging repetition. Focus on accuracy as you go.",
      difficulty: "beginner",
      focus: "mixed",
      content:
        "Practice makes perfect. The more you type the faster you become. Keep going.",
      estimatedMinutes: 5,
    },
    {
      title: "First Steps",
      description:
        "Your very first typing adventure! Take it slow and enjoy the journey.",
      difficulty: "beginner",
      focus: "mixed",
      content:
        "Welcome to TypingJoy! Let us begin with your first typing practice. Take it slow.",
      estimatedMinutes: 5,
    },
    {
      title: "Getting Faster",
      description:
        "Build on your foundation with longer text. Accuracy first, speed will follow.",
      difficulty: "beginner",
      focus: "mixed",
      content:
        "You are doing great! Now let us try to build some speed. Focus on accuracy first.",
      estimatedMinutes: 5,
    },
  ];

  for (const lesson of lessons) {
    await db.lesson.create({ data: lesson });
  }
}

main();
