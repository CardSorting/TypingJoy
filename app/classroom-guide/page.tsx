import Link from "next/link";
import { db } from "@/src/infrastructure/db";
import AppLayout from "@/src/ui/components/AppLayout";

export const dynamic = "force-dynamic";

export default async function ClassroomGuidePage() {
  const firstLesson = await db.lesson.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  const fingerMappings = [
    { hand: "Left Hand", fingers: [
      { name: "Pinky", keys: "A, Q, Z, 1, Shift" },
      { name: "Ring", keys: "S, W, X, 2" },
      { name: "Middle", keys: "D, E, C, 3" },
      { name: "Index", keys: "F, G, R, T, V, B, 4, 5" },
      { name: "Thumb", keys: "Spacebar" }
    ]},
    { hand: "Right Hand", fingers: [
      { name: "Thumb", keys: "Spacebar" },
      { name: "Index", keys: "J, H, U, Y, M, N, 6, 7" },
      { name: "Middle", keys: "K, I, Comma (,), 8" },
      { name: "Ring", keys: "L, O, Period (.), 9" },
      { name: "Pinky", keys: "Semicolon (;), P, Slash (/), 0, Dash (-), Equal (=), Shift, Enter" }
    ]}
  ];

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Guide Header */}
        <div className="border-b border-stone-100 pb-4">
          <h1 className="text-2xl font-bold text-amber-800">📖 Student Manual</h1>
          <p className="text-xs text-stone-500 mt-1">
            Teacher-written fundamentals for relaxed, accurate, lifelong touch typing.
          </p>
        </div>

        {/* Home Row Anchor Ridge Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="warm-card p-6 bg-white space-y-4">
            <h2 className="text-base font-bold text-amber-800 flex items-center gap-1.5">
              🏠 Home Row Anchoring
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Your fingers should rest lightly on the middle row of the keyboard when not typing:
            </p>
            <div className="bg-stone-50 p-4 rounded-lg text-center font-mono border border-stone-200/50">
              <div className="text-stone-400 text-[10px] mb-2 font-sans font-semibold uppercase tracking-wider">
                Finger rest positions
              </div>
              <div className="flex justify-center gap-4 text-sm font-semibold">
                <span className="bg-white border border-stone-200 px-2 py-1 rounded shadow-xs" title="Left Pinky">A</span>
                <span className="bg-white border border-stone-200 px-2 py-1 rounded shadow-xs" title="Left Ring">S</span>
                <span className="bg-white border border-stone-200 px-2 py-1 rounded shadow-xs" title="Left Middle">D</span>
                <span className="bg-amber-100 border border-amber-300 px-2 py-1 rounded font-bold text-amber-800 relative shadow-xs" title="Left Index Anchor">
                  F
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-[1.5px] bg-amber-500 rounded-full" />
                </span>
                <span className="text-stone-300 self-center">|</span>
                <span className="bg-amber-100 border border-amber-300 px-2 py-1 rounded font-bold text-amber-800 relative shadow-xs" title="Right Index Anchor">
                  J
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-[1.5px] bg-amber-500 rounded-full" />
                </span>
                <span className="bg-white border border-stone-200 px-2 py-1 rounded shadow-xs" title="Right Middle">K</span>
                <span className="bg-white border border-stone-200 px-2 py-1 rounded shadow-xs" title="Right Ring">L</span>
                <span className="bg-white border border-stone-200 px-2 py-1 rounded shadow-xs" title="Right Pinky">;</span>
              </div>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed italic">
              💡 **The Anchor bumps**: The small ridges on the **F** and **J** keys help your index fingers locate home without looking. When reaching up or down, return your fingers here immediately.
            </p>
          </div>

          {/* Posture & Ergonomics check */}
          <div className="warm-card p-6 bg-white space-y-4">
            <h2 className="text-base font-bold text-amber-800 flex items-center gap-1.5">
              🪑 Typing Ergonomics
            </h2>
            <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
              <p>
                A supportive physical alignment protects your fingers, shoulders, and wrists from fatigue and strains:
              </p>
              <ul className="space-y-2 list-disc pl-4 text-stone-500">
                <li>
                  <strong className="text-stone-700">Float your wrists:</strong> Keep wrists parallel to the keyboard. Letting wrists rest on the table restricts finger reach and locks movements.
                </li>
                <li>
                  <strong className="text-stone-700">Elbows at 90 degrees:</strong> Position your chair height so your elbows bend at a clean right angle.
                </li>
                <li>
                  <strong className="text-stone-700">Look straight ahead:</strong> Position your screen height at eye level to prevent neck strain.
                </li>
                <li>
                  <strong className="text-stone-700">Take micro-rests:</strong> Take a 2-minute stretch rest after every 15 minutes of continuous typing.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Finger-key mapping list */}
        <div className="warm-card p-6 bg-white space-y-5">
          <h2 className="text-base font-bold text-amber-800">🎯 Academic Finger Mappings</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Assigning each key to a specific finger is the secret to muscle memory. Avoid using a single dominant finger for reaches.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fingerMappings.map((side) => (
              <div key={side.hand} className="space-y-3">
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider border-b border-stone-100 pb-1">
                  {side.hand}
                </h3>
                <div className="space-y-2">
                  {side.fingers.map((finger) => (
                    <div key={finger.name} className="flex text-xs leading-relaxed">
                      <span className="w-16 font-semibold text-amber-800">{finger.name}:</span>
                      <span className="flex-1 text-stone-600 font-mono">{finger.keys}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rhythm & Pacing advice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="warm-card p-6 bg-white space-y-3">
            <h2 className="text-base font-bold text-amber-800">🧘 Metronome & Heartbeat Typing</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Real speed is built on consistency. Instead of trying to type familiar words instantly and pausing on difficult ones (bursting), try typing with a steady, metronome-like pulse.
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              A stable, rhythmic pace lowers error rates, reduces hand fatigue, and builds deep muscle memory far faster. Practice with a calm, internal heartbeat.
            </p>
          </div>

          {/* Progression definition seals */}
          <div className="warm-card p-6 bg-white space-y-3">
            <h2 className="text-base font-bold text-amber-800">🎖️ Academy Seals & Badges</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              We reward precision and typing discipline. The seals earned represent accuracy over the entire text:
            </p>
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-block bg-amber-100 border border-amber-400 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[9px] shadow-xs">
                  🌟 Gold Seal
                </span>
                <span className="text-stone-600">Passed with Outstanding Precision (<strong>98% or higher</strong> accuracy).</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-block bg-stone-100 border border-stone-300 text-stone-700 font-bold px-2 py-0.5 rounded-full text-[9px] shadow-xs">
                  ✨ Silver Seal
                </span>
                <span className="text-stone-600">Passed with Steady Precision (<strong>95% to 97.9%</strong> accuracy).</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-block bg-amber-50 border border-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[9px] shadow-xs">
                  📜 Bronze Seal
                </span>
                <span className="text-stone-600">Passed standard progression criteria (<strong>90% to 94.9%</strong> accuracy).</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start First Lesson CTA */}
        <div className="warm-card p-6 bg-amber-50/25 border-amber-300/60 text-center space-y-3">
          <h3 className="text-sm font-bold text-stone-850">Ready to test your anchors?</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            The best way to build touch typing is with slow, rhythmic exercises. Put your fingers on the F and J ridges and start your first foundations milestone.
          </p>
          <div className="pt-2">
            <Link
              href={firstLesson ? `/practice/${firstLesson.id}` : "/lessons"}
              className="warm-button text-xs py-2 px-6 inline-block"
            >
              Start your first foundations milestone →
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
