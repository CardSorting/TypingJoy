/**
 * [LAYER: UI]
 * DashboardGreeting — Personal client-side welcoming card that greets the user with their
 * custom name and shares supportive classroom teaching insights to build typing confidence.
 */

"use client";

import { useEffect, useState } from "react";
import { getLocalSettings } from "@/src/core/utils/settings";

const TEACHER_QUOTES = [
  "Prioritize accuracy first, speed is just muscle memory that has grown comfortable.",
  "Rest your fingers lightly on the home row bumps (F and J). They are your safe anchor points.",
  "Try typing with a relaxed, steady heartbeat. A constant rhythm is faster than burst typing.",
  "Keep your wrists floating gently above the desk. Sinking them locks up your pinky reaches.",
  "Touch typing is a journey of patient repetition. Every accurate session builds a lifetime habit.",
  "Take deep breaths and check your posture. Straight back, flat feet, relaxed shoulders.",
  "If a reach feels difficult, slow down. Accuracy on that reach today means speed on it tomorrow.",
];

export default function DashboardGreeting() {
  const [profileName, setProfileName] = useState("Student Scribe");
  const [randomQuote, setRandomQuote] = useState("");
  const [greeting, setGreeting] = useState("Welcome back");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const settings = getLocalSettings();
    const index = Math.floor(Math.random() * TEACHER_QUOTES.length);
    const quote = TEACHER_QUOTES[index];

    const getGreetingText = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 17) return "Good afternoon";
      return "Good evening";
    };

    const timer = setTimeout(() => {
      setMounted(true);
      setProfileName(settings.profileName);
      setGreeting(getGreetingText());
      setRandomQuote(quote);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-xl border border-amber-200/50 bg-amber-50/20 p-6 animate-pulse">
        <div className="h-5 w-48 bg-stone-200 rounded mb-2" />
        <div className="h-4 w-96 bg-stone-100 rounded" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200/50 bg-amber-50/20 p-6 relative overflow-hidden">
      <div className="absolute right-4 top-4 text-4xl opacity-10 select-none">🏫</div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
        Classroom Study Desk
      </p>
      <h1 className="mt-1 text-2xl font-bold text-stone-900">
        {greeting}, <span className="text-amber-800 font-serif-academy italic">{profileName}</span>!
      </h1>
      <div className="mt-3 max-w-2xl border-l-2 border-amber-400 pl-3">
        <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
          Teacher&apos;s Advice for Today
        </p>
        <p className="text-sm text-stone-600 mt-1 italic leading-relaxed">
          &ldquo;{randomQuote}&rdquo;
        </p>
      </div>
    </div>
  );
}
