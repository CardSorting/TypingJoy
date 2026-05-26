/**
 * [LAYER: UI]
 * HomePage — Calm learning hub for structured typing practice, trends, and mastery tracking.
 */

import Link from "next/link";
import { getDashboardStats } from "@/src/core/actions/stats";
import DashboardCards from "@/src/ui/components/DashboardCards";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const stats = await getDashboardStats();
  const trendToneClass =
    stats.recentTrend.tone === "improving"
      ? "border-emerald-200 bg-emerald-50/40 text-emerald-900"
      : stats.recentTrend.tone === "accuracy"
        ? "border-sky-200 bg-sky-50/50 text-sky-950"
        : stats.recentTrend.tone === "speed"
          ? "border-amber-200 bg-amber-50/50 text-amber-950"
          : "border-stone-200 bg-white/75 text-stone-700";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 rounded-xl border border-amber-200/70 bg-amber-50/45 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
          Daily typing practice
        </p>
        <h1 className="mt-1 text-3xl font-bold text-stone-900">TypingJoy</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
          A calm place to build touch-typing accuracy, one focused practice at a time.
        </p>
      </div>

      {stats.totalSessions === 0 ? (
        <div className="mx-auto max-w-xl rounded-xl border border-amber-200 bg-white/85 p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-stone-900">Start with one short lesson</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Rest your fingers on <strong>A S D F</strong> and <strong>J K L ;</strong>.
            Your first session will unlock real progress and coaching from your own typing.
          </p>
          <Link href={stats.learningRecommendation?.href || "/lessons"} className="warm-button mt-6 inline-block">
            {stats.learningRecommendation?.actionLabel || "Browse lessons"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">
              Practice overview
            </h2>
            <DashboardCards stats={stats} />

            <div className="warm-card p-5">
              <h3 className="font-bold text-stone-800 text-sm mb-2">7-day consistency</h3>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                Practiced <strong className="text-amber-800">{stats.consistencyDaysCount}</strong> of
                the last 7 days. Short, accurate sessions are enough to keep the habit alive.
              </p>
              <div className="flex gap-2 justify-between max-w-xs mx-auto">
                {stats.consistencyDays.map((day) => (
                  <div key={day.dateLabel} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-stone-500 font-bold uppercase">
                      {day.dayLabel}
                    </span>
                    <div
                      className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold ${
                        day.practiced
                          ? "bg-amber-600 border-amber-700 text-white"
                          : "bg-white border-stone-200 text-stone-400"
                      }`}
                      aria-label={
                        day.practiced
                          ? `Practiced on ${day.dateLabel}`
                          : `No practice on ${day.dateLabel}`
                      }
                    >
                      {day.practiced ? "Yes" : "No"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-xl border p-5 ${trendToneClass}`}>
              <h3 className="font-bold text-sm mb-1">{stats.recentTrend.label}</h3>
              <p className="text-xs font-medium leading-relaxed">{stats.recentTrend.detail}</p>
              <p className="mt-3 text-[11px] text-stone-500">
                WPM trend: {stats.recentTrendWpm > 0 ? "+" : ""}
                {stats.recentTrendWpm}. Accuracy trend:{" "}
                {stats.recentAccuracyTrend > 0 ? "+" : ""}
                {stats.recentAccuracyTrend}%.
              </p>
            </div>

            {stats.bestSession && (
              <div className="warm-card p-5 border-emerald-200 bg-emerald-50/25">
                <h3 className="font-bold text-emerald-900 text-sm mb-2">
                  Personal best with high accuracy
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-stone-800 text-sm">
                      {stats.bestSession.title}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      {new Date(stats.bestSession.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-green-700 font-mono">
                      {stats.bestSession.wpm} <span className="text-xs font-normal">WPM</span>
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      {stats.bestSession.accuracy}% accuracy
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {stats.learningRecommendation && (
              <div>
                <h2 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2 mb-3">
                  Next step
                </h2>
                <div className="warm-card p-5 bg-amber-50/35 border-amber-300 flex flex-col justify-between h-auto">
                  <div>
                    <h3 className="font-bold text-stone-800 text-base mb-1">
                      {stats.learningRecommendation.title}
                    </h3>
                    <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                      {stats.learningRecommendation.reason}
                    </p>
                  </div>
                  <Link
                    href={stats.learningRecommendation.href}
                    className="warm-button text-center w-full block text-xs"
                  >
                    {stats.learningRecommendation.actionLabel}
                  </Link>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2 mb-3">
                Weak-key coaching
              </h2>
              <div className="warm-card p-5 bg-yellow-50/30 border-yellow-300/70 border">
                {stats.weakKeyAdvice.length > 0 ? (
                  <>
                  <p className="text-xs text-stone-600 mb-4 leading-relaxed font-medium">
                    These are the intended keys most often missed in your last 10 sessions.
                  </p>
                  <div className="space-y-3">
                    {stats.weakKeyAdvice.map((advice, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-1 text-xs border-b border-stone-200/40 pb-2 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-center">
                          <span>
                            Intended key{" "}
                            <strong className="text-amber-800 font-mono text-sm bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                              &apos;{advice.key}&apos;
                            </strong>
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {advice.count} misses
                          </span>
                        </div>
                        <div className="text-stone-600 font-medium text-[10px]">
                          {advice.finger} · {advice.region}
                        </div>
                        <div className="text-stone-500 text-[10px] leading-relaxed">
                          {advice.advice}
                        </div>
                      </div>
                    ))}
                  </div>
                  </>
                ) : (
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Finish a practice session and this card will show real key-specific coaching from your typed text.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2 mb-3">
                Keyboard mastery
              </h2>
              <div className="warm-card p-5 space-y-4">
                {stats.focusMastery.map((mastery) => {
                  const percent =
                    mastery.totalCount > 0
                      ? Math.round((mastery.passedCount / mastery.totalCount) * 100)
                      : 0;

                  return (
                    <div key={mastery.category} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium text-stone-600">
                        <span className="capitalize">
                          {mastery.category.replace("-", " ")}
                        </span>
                        <span>
                          {mastery.passedCount}/{mastery.totalCount} passed
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
