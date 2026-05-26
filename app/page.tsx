/**
 * [LAYER: UI]
 * MarketingPage — Welcome landing page for TypingJoy Academy.
 * Explains the cozy digital classroom concept, outlines structured typing units,
 * previews student stats consoles, and guides new writers to enter the study desk.
 */

import Link from "next/link";

export default function MarketingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fffdfa] text-stone-800 selection:bg-amber-100 selection:text-amber-900">
      {/* Academy Header */}
      <nav className="flex items-center justify-between bg-amber-50/60 backdrop-blur-xs border-b border-amber-100/60 px-6 py-4 sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold text-amber-800 flex items-center gap-2">
          ⌨️ TypingJoy Academy
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/classroom-guide" className="hidden sm:inline-block text-xs font-semibold text-stone-600 hover:text-amber-800 transition">
            Student manual
          </Link>
          <Link href="/dashboard" className="warm-button text-xs py-2 px-5">
            Enter Study Desk →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-20 text-center space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200 text-xs font-bold text-amber-800">
          🏫 A cozy digital typing school
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight max-w-2xl mx-auto">
          Learn touch typing, <br />
          <span className="font-serif-academy italic text-amber-800 font-normal">one calm reach</span> at a time.
        </h1>
        <p className="max-w-xl mx-auto text-base text-stone-600 leading-relaxed">
          TypingJoy is a patient, supportive typing school designed to build muscle memory without gamer pressure, speed counters, or noise. Go slow to go fast.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href="/dashboard" className="warm-button text-sm">
            Begin Practice
          </Link>
          <Link href="/classroom-guide" className="warm-button-secondary text-sm">
            Read Guide First
          </Link>
        </div>

        {/* Tactile Preview Card */}
        <div className="pt-8 max-w-3xl mx-auto">
          <div className="warm-card p-6 bg-white shadow-md border border-amber-200/50 flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-stone-100 pb-3 mb-4 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span>Typing Surface — Focus Unit active</span>
              <span>18 WPM · 98% Accuracy</span>
            </div>
            <div className="font-mono text-xl tracking-wider leading-relaxed bg-stone-50 p-6 rounded-lg text-stone-500 w-full text-center whitespace-pre-wrap select-none border border-stone-100">
              <span className="text-emerald-800 bg-emerald-50 px-0.5 rounded">a</span>
              <span className="text-emerald-800 bg-emerald-50 px-0.5 rounded">s</span>
              <span className="text-emerald-800 bg-emerald-50 px-0.5 rounded">d</span>
              <span className="text-emerald-800 bg-emerald-50 px-0.5 rounded">f</span>
              <span> </span>
              <span className="text-stone-900 bg-amber-100 outline outline-2 outline-amber-600 px-0.5 rounded font-bold">j</span>
              <span>k l ; a s d f j k l ;</span>
            </div>
            <p className="text-xs text-amber-700/80 font-medium mt-4">
              ⌨️ Tactile feedback indicators guide your index anchors onto the Home Row (F and J).
            </p>
          </div>
        </div>
      </section>

      {/* Pedagogy Pillars */}
      <section className="bg-amber-50/20 border-y border-amber-200/30 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-md mx-auto mb-12">
            <h2 className="text-2xl font-bold text-stone-900">Our Touch Typing Philosophy</h2>
            <p className="text-xs text-stone-500 mt-2">
              Unlike arcade games that induce rush errors, TypingJoy builds calm, clean precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-3xl">🏠</div>
              <h3 className="font-bold text-stone-800 text-base">Home Row Anchors</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Learn to rest your hands naturally and return to the anchor ridges (F and J) after every reach. Everything starts home.
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-3xl">🧠</div>
              <h3 className="font-bold text-stone-800 text-base">Tactile Diagnostics</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                TypingJoy analyzes your typed patterns, mapping weak keys, region drifts, and common confusion zones (like confusing E with I).
              </p>
            </div>
            <div className="space-y-3">
              <div className="text-3xl">🛡️</div>
              <h3 className="font-bold text-stone-800 text-base">Emotionally Safe</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                No ticking timers or loud sirens when you make mistakes. We measure consistency and accuracy. Slow down to succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Path Explain */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded">
              Curriculum Units
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 leading-tight">
              A structured roadmap <br />
              from foundations to speed.
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Our lessons are partitioned into sequential stages. Complete a lesson with at least <strong className="text-amber-800">90% accuracy</strong> to unlock the next reach milestone.
            </p>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <span className="text-amber-500">🟤</span> <strong>Level 1 Foundations:</strong> Rest and anchor on Home Row.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-500">🟡</span> <strong>Level 2 Reaches:</strong> Vertical extensions to Top Row.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-500">🟢</span> <strong>Level 3 Confidence:</strong> Slide extensions to Bottom Row.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-500">🔵</span> <strong>Level 4 Expansion:</strong> Numbers, shifts, and code symbols.
              </li>
            </ul>
            <div className="pt-2">
              <Link href="/dashboard" className="warm-button text-xs">
                Browse Curriculum Path
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="warm-card p-6 bg-white shadow-sm border border-stone-200/50 space-y-4">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Roadmap Preview
              </p>
              <div className="space-y-3">
                <div className="border border-stone-200/60 rounded-lg p-3 bg-stone-50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-700">1. Home Row Basics</h4>
                    <p className="text-[10px] text-stone-400">Keys: A S D F J K L ;</p>
                  </div>
                  <span className="text-xs text-green-600 font-bold">Passed ⭐</span>
                </div>
                <div className="border border-stone-200/60 rounded-lg p-3 bg-stone-50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-700">2. Top Row Reach</h4>
                    <p className="text-[10px] text-stone-400">Keys: Q W E R T Y U I O P</p>
                  </div>
                  <span className="text-xs text-amber-600 font-bold">Current Target 🎯</span>
                </div>
                <div className="border border-stone-200/60 rounded-lg p-3 bg-stone-50/50 opacity-50 flex items-center justify-between select-none">
                  <div>
                    <h4 className="text-xs font-bold text-stone-700">3. Bottom Row Strength</h4>
                    <p className="text-[10px] text-stone-400">Keys: Z X C V B N M</p>
                  </div>
                  <span className="text-xs text-stone-400">Locked 🔒</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Mock Quotes Section */}
      <section className="bg-stone-50 border-t border-stone-200/40 py-16 text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">
            A Supportive Scribe Community
          </p>
          <blockquote className="text-lg text-stone-700 italic font-serif-academy leading-relaxed">
            &ldquo;TypingJoy feels like sitting in a quiet, sunlit library with a patient instructor. I stopped looking at my keyboard in less than a week.&rdquo;
          </blockquote>
          <p className="text-xs text-stone-500 font-semibold">— Classroom Student Log</p>
        </div>
      </section>

      {/* Academy Footer */}
      <footer className="bg-stone-100 border-t border-stone-200 py-12 text-center text-xs text-stone-400 space-y-2 mt-auto">
        <p>⌨️ TypingJoy Academy &mdash; Dedicated to patient tactile learning.</p>
        <p className="opacity-70">SQLite &middot; Next.js 16 &middot; Tailwind CSS</p>
      </footer>
    </div>
  );
}
