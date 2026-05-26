/**
 * [LAYER: INFRASTRUCTURE]
 */
import Link from 'next/link';
import { getSessions } from '@/src/core/actions/sessions';
import { formatDuration } from '@/src/domain/calculations';

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Your Progress</h1>

      {totalSessions === 0 ? (
        <div className="text-center py-16 text-stone-500">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-lg mb-4">
            No progress yet. Complete a lesson to start tracking!
          </p>
          <Link
            href="/lessons"
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2 inline-block"
          >
            Browse Lessons
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="stat-card">
              <div className="stat-value text-stone-800">{totalSessions}</div>
              <div className="stat-label">Total Sessions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-amber-600">{avgWpm}</div>
              <div className="stat-label">Average WPM</div>
            </div>
            <div className="stat-card">
              <div className="stat-value text-green-600">{avgAccuracy}%</div>
              <div className="stat-label">Average Accuracy</div>
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
  );
}