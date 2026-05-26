/** [LAYER: UI] */
import Link from "next/link";
import { getDashboardStats } from "@/src/core/actions/stats";
import DashboardCards from "@/src/ui/components/DashboardCards";

export default async function HomePage() {
  const stats = await getDashboardStats();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-amber-800 mb-3">
          Welcome to TypingJoy!
        </h1>
        <p className="text-lg text-stone-500 max-w-lg mx-auto">
          Practice typing with fun lessons and track your progress.
        </p>
      </div>

      {/* Stats */}
      <DashboardCards stats={stats} />

      {/* Empty state or activity */}
      {stats.totalSessions === 0 ? (
        <div className="text-center mt-12 bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-12">
          <div className="text-6xl mb-4">⌨️</div>
          <h2 className="text-xl font-semibold text-stone-700 mb-2">
            No sessions yet
          </h2>
          <p className="text-stone-500 mb-6">
            Start your first typing lesson and begin tracking your progress!
          </p>
          <Link
            href="/lessons"
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-medium transition-all inline-block shadow-sm"
          >
            Browse Lessons
          </Link>
        </div>
      ) : (
        <div className="mt-12 space-y-4">
          <div className="warm-divider" />
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-700">
              Recent Activity
            </h2>
            <Link
              href="/progress"
              className="text-amber-600 hover:text-amber-700 font-medium text-sm"
            >
              View all progress →
            </Link>
          </div>
          <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-8">
            <p className="text-stone-500 mb-4">
              Keep practicing to build your skills!
            </p>
            <Link
              href="/lessons"
              className="warm-button inline-block"
            >
              Practice Another Lesson
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}