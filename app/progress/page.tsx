/**
 * [LAYER: INFRASTRUCTURE]
 */
import Link from 'next/link';
import { getSessions } from '@/src/core/actions/sessions';
import { formatDuration } from '@/src/domain/calculations';
import AppLayout from '@/src/ui/components/AppLayout';

export const dynamic = 'force-dynamic';

interface SessionWithDetails {
  id: string;
  completedAt: Date;
  wpm: number;
  accuracy: number;
  mistakes: number;
  durationSeconds: number;
  lesson?: { id: string; title: string; difficulty: string } | null;
  customText?: { id: string; title: string } | null;
}

export default async function ProgressPage() {
  const sessions = await getSessions(100) as unknown as SessionWithDetails[];

  const totalSessions = sessions.length;
  const avgWpm =
    totalSessions > 0
      ? Math.round(
          sessions.reduce((sum: number, s: SessionWithDetails) => sum + s.wpm, 0) / totalSessions
        )
      : 0;
  const avgAccuracy =
    totalSessions > 0
      ? Math.round(
          sessions.reduce((sum: number, s: SessionWithDetails) => sum + s.accuracy, 0) / totalSessions
        )
      : 0;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="border-b border-stone-100 pb-4">
          <h1 className="text-2xl font-bold text-amber-800">📓 Progress Journal</h1>
          <p className="text-xs text-stone-500 mt-1">
            Reflect on your writing practice logs, speed curves, and tactile precision over time.
          </p>
        </div>

      {totalSessions === 0 ? (
        <div className="warm-card p-12 text-center text-stone-500 max-w-md mx-auto">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-lg font-bold text-stone-900 mb-2">No drills recorded yet</h2>
          <p className="text-xs text-stone-600 mb-6 leading-relaxed">
            Your personal campus learning journal is currently blank! Put your fingers on the anchor keys and complete a practice milestone to start tracking metrics.
          </p>
          <Link
            href="/lessons"
            className="warm-button text-xs py-2 px-5 inline-block"
          >
            Browse Academy Curriculum
          </Link>
        </div>
      ) : (
        <>
          {/* Scribe Reflections & General Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Cards */}
            <div className="md:col-span-2 grid grid-cols-3 gap-4">
              <div className="warm-card p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Milestones</span>
                <div className="text-2xl font-bold text-stone-850 font-mono mt-2">{totalSessions} drills</div>
                <span className="text-[9px] text-stone-500 mt-1">Total sessions</span>
              </div>
              <div className="warm-card p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Average Speed</span>
                <div className="text-2xl font-bold text-amber-800 font-mono mt-2">{avgWpm} WPM</div>
                <span className="text-[9px] text-stone-500 mt-1">Words per minute</span>
              </div>
              <div className="warm-card p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Precision</span>
                <div className="text-2xl font-bold text-emerald-800 font-mono mt-2">{avgAccuracy}%</div>
                <span className="text-[9px] text-stone-500 mt-1">Overall accuracy</span>
              </div>
            </div>

            {/* Scribe Reflections */}
            <div className="warm-card p-4 bg-amber-50/10 border-amber-300/40 text-xs flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-amber-800 flex items-center gap-1.5 mb-1.5">
                  📝 Scribe Reflection
                </h4>
                <p className="text-[11px] text-stone-600 leading-relaxed italic">
                  &ldquo;Touch typing is not a race. It is the practice of resting and reaching with calm control. Your ledger indicates steady muscle memory development. Keep your wrists floating and shoulders relaxed.&rdquo;
                </p>
              </div>
              <Link
                href="/dashboard"
                className="text-amber-700 hover:text-amber-800 underline font-semibold text-[10px] block mt-3"
              >
                Analyze keyboard reach diagnostics →
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-200">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Lesson</th>
                  <th className="pb-3 pr-4">WPM</th>
                  <th className="pb-3 pr-4">Accuracy</th>
                  <th className="pb-3 pr-4">Mistakes</th>
                  <th className="pb-3 pr-4">Duration</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session: SessionWithDetails) => (
                  <tr
                    key={session.id}
                    className="border-b border-stone-100 hover:bg-stone-50"
                  >
                    <td className="py-3 pr-4 text-stone-600">
                      {new Date(session.completedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4 text-stone-800">
                      {session.lesson?.title || session.customText?.title || 'Custom Text'}
                    </td>
                    <td className="py-3 pr-4 font-bold text-stone-800">
                      {session.wpm}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={
                          session.accuracy > 90
                            ? 'text-green-600'
                            : session.accuracy > 75
                              ? 'text-amber-600'
                              : 'text-red-600'
                        }
                      >
                        {session.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-stone-600">
                      {session.mistakes}
                    </td>
                    <td className="py-3 pr-4 text-stone-600">
                      {session.durationSeconds ? formatDuration(session.durationSeconds) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      </div>
    </AppLayout>
  );
}
