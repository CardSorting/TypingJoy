/**
 * [LAYER: UI]
 * DashboardPage — The student's digital study desk.
 * Gathers aggregate data, showcases recommended practice milestones, provides
 * diagnostics panels, and features typewriter keyboard heatmaps.
 */

import Link from "next/link";
import { getDashboardStats } from "@/src/core/actions/stats";
import AppLayout from "@/src/ui/components/AppLayout";
import DashboardGreeting from "@/src/ui/components/DashboardGreeting";
import DashboardKeyboard from "@/src/ui/components/DashboardKeyboard";
import DashboardCards from "@/src/ui/components/DashboardCards";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Greeting Card */}
        <DashboardGreeting />

        {stats.totalSessions === 0 ? (
          <div className="rounded-xl border border-amber-200 bg-white p-8 text-center shadow-sm max-w-xl mx-auto">
            <div className="text-4xl mb-3">📖</div>
            <h2 className="text-xl font-bold text-stone-900">Start with your first lesson</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Your typing desk is currently empty! Resting your fingers on <strong>A S D F</strong> and <strong>J K L ;</strong> is the first step.
              Your very first practice session will unlock progress tracking and tactile coaching.
            </p>
            <Link
              href={stats.learningRecommendation?.href || "/lessons"}
              className="warm-button mt-6 inline-block"
            >
              {stats.learningRecommendation?.actionLabel || "Browse lessons"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left/Middle Column (Practice overview & Diagnostics) */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-base font-bold text-stone-700 border-b border-stone-100 pb-2 mb-4">
                  Practice overview
                </h2>
                <DashboardCards stats={stats} />
              </div>

              {/* Consistency Tracker card */}
              <div className="warm-card p-5">
                <h3 className="font-bold text-stone-800 text-sm mb-1">7-day consistency</h3>
                <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                  You completed practice on <strong className="text-amber-800">{stats.consistencyDaysCount}</strong> of
                  the last 7 days. Continuous short practices are better than long spikes.
                </p>
                <div className="flex gap-2 justify-between max-w-xs mx-auto">
                  {stats.consistencyDays.map((day) => (
                    <div key={day.dateLabel} className="flex flex-col items-center gap-1">
                      <span className="text-[9px] text-stone-400 font-bold uppercase">
                        {day.dayLabel}
                      </span>
                      <div
                        className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs font-semibold ${
                          day.practiced
                            ? "bg-amber-600 border-amber-700 text-white shadow-sm"
                            : "bg-[#faf8f5] border-stone-200 text-stone-300"
                        }`}
                        aria-label={
                          day.practiced
                            ? `Practiced on ${day.dateLabel}`
                            : `No practice on ${day.dateLabel}`
                        }
                      >
                        {day.practiced ? "✓" : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tactile Diagnostic Typewriter heatmaps */}
              <div>
                <h2 className="text-base font-bold text-stone-700 border-b border-stone-100 pb-2 mb-4">
                  Tactile Coaching & Diagnostics
                </h2>
                <div className="warm-card p-5 space-y-5">
                  {stats.weakKeyAdvice.length > 0 ? (
                    <>
                      {/* Keyboard diagnostic */}
                      <DashboardKeyboard weakKeys={stats.weakKeyAdvice} />

                      {/* Diagnostic breakdown lists */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Weak Key list */}
                        <div className="bg-stone-50/50 p-4 rounded-lg border border-stone-200/30">
                          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                            Intended keys most missed
                          </p>
                          <div className="space-y-3">
                            {stats.weakKeyAdvice.map((advice, idx) => (
                              <div
                                key={idx}
                                className="flex flex-col gap-0.5 text-xs border-b border-stone-200/40 pb-2 last:border-0 last:pb-0"
                              >
                                <div className="flex justify-between items-center">
                                  <span>
                                    Key{" "}
                                    <strong className="text-amber-800 font-mono text-xs bg-white px-1.5 py-0.5 rounded border border-amber-200/60">
                                      &apos;{advice.key}&apos;
                                    </strong>
                                  </span>
                                  <span className="text-[10px] text-stone-400 font-mono">
                                    {advice.count} misses
                                  </span>
                                </div>
                                <div className="text-stone-500 text-[10px] leading-relaxed">
                                  {advice.finger} · {advice.advice}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Region weakness & confusion zones */}
                        <div className="space-y-3">
                          {stats.regionWeakness && (
                            <div className="bg-stone-50/50 p-3 rounded-lg border border-stone-200/30 text-xs">
                              <p className="font-semibold text-stone-700 flex items-center gap-1 mb-1">
                                🗺️ Region Weakness
                              </p>
                              <p className="text-stone-600 text-[11px] leading-relaxed">
                                Weakest region: <strong className="text-amber-800">{stats.regionWeakness.region.replace("-", " ")}</strong> ({stats.regionWeakness.percentage}% of misses).
                              </p>
                              <p className="text-[10px] text-stone-500 leading-relaxed mt-0.5">
                                {stats.regionWeakness.advice}
                              </p>
                            </div>
                          )}

                          {stats.confusionZones.length > 0 && (
                            <div className="bg-stone-50/50 p-3 rounded-lg border border-stone-200/30 text-xs">
                              <p className="font-semibold text-stone-700 flex items-center gap-1 mb-1.5">
                                🔄 Confusion Zones
                              </p>
                              <div className="space-y-2">
                                {stats.confusionZones.map((cz, index) => (
                                  <div key={index} className="text-stone-600 text-[10px] leading-tight">
                                    Typed <strong className="font-mono text-amber-800 bg-white px-0.5 rounded border border-amber-200/40">&apos;{cz.typed}&apos;</strong> instead of <strong className="font-mono text-amber-800 bg-white px-0.5 rounded border border-amber-200/40">&apos;{cz.expected}&apos;</strong>: {cz.advice}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-stone-500 italic leading-relaxed text-center py-6">
                      Coaching diagnostics will update here with keys-missed heatmaps once practice data is gathered.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (Goals & Mastery & Personal Best) */}
            <div className="space-y-6">
              {/* Goal recommendation */}
              {stats.learningRecommendation && (
                <div>
                  <h2 className="text-base font-bold text-stone-700 border-b border-stone-100 pb-2 mb-4">
                    Next Goal
                  </h2>
                  <div className="warm-card p-5 bg-amber-50/20 border-amber-300/80 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] bg-amber-200/70 text-amber-900 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Recommended Lesson
                      </span>
                      <h3 className="font-bold text-stone-800 text-base mt-2 mb-1">
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

              {/* Progress trend */}
              <div className={`rounded-xl border p-5 ${trendToneClass}`}>
                <h3 className="font-bold text-sm mb-1">{stats.recentTrend.label}</h3>
                <p className="text-xs leading-relaxed">{stats.recentTrend.detail}</p>
                <p className="mt-3 text-[10px] text-stone-400 font-mono">
                  WPM: {stats.recentTrendWpm > 0 ? "+" : ""}
                  {stats.recentTrendWpm} · Accuracy:{" "}
                  {stats.recentAccuracyTrend > 0 ? "+" : ""}
                  {stats.recentAccuracyTrend}%.
                </p>
              </div>

              {/* Keyboard Mastery Category breakdown */}
              <div>
                <h2 className="text-base font-bold text-stone-700 border-b border-stone-100 pb-2 mb-4">
                  Curriculum Mastery
                </h2>
                <div className="warm-card p-5 space-y-4">
                  {stats.focusMastery.map((mastery) => {
                    const percent =
                      mastery.totalCount > 0
                        ? Math.round((mastery.passedCount / mastery.totalCount) * 100)
                        : 0;

                    return (
                      <div key={mastery.category} className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-medium text-stone-600">
                          <span className="capitalize">
                            {mastery.category.replace("-", " ")}
                          </span>
                          <span>
                            {mastery.passedCount}/{mastery.totalCount} passed
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5">
                          <div
                            className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal best */}
              {stats.bestSession && (
                <div>
                  <h2 className="text-base font-bold text-stone-700 border-b border-stone-100 pb-2 mb-4">
                    Personal Best
                  </h2>
                  <div className="warm-card p-5 border-emerald-200 bg-emerald-50/20">
                    <h3 className="font-bold text-stone-800 text-sm">
                      {stats.bestSession.title}
                    </h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      Completed {new Date(stats.bestSession.completedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xl font-extrabold text-emerald-800 font-mono">
                        {stats.bestSession.wpm} <span className="text-xs font-normal text-stone-400">WPM</span>
                      </p>
                      <p className="text-xs text-emerald-700 font-medium">
                        {stats.bestSession.accuracy}% accuracy
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
