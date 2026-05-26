/**
 * [LAYER: UI]
 * DashboardCards — Compact statistics cards for the learning hub.
 */

"use client";

interface DashboardCardsProps {
  stats: {
    totalSessions: number;
    averageWpm: number;
    averageAccuracy: number;
    bestWpm: number;
    bestSession: { wpm: number; accuracy: number; title: string } | null;
  };
}

export default function DashboardCards({ stats }: DashboardCardsProps) {
  const cards = [
    {
      label: "Sessions completed",
      display: `${stats.totalSessions}`,
      icon: "✍️",
      sub: "Completed typing drills",
    },
    {
      label: "Average speed",
      display: `${stats.averageWpm} WPM`,
      icon: "⏱️",
      sub: "Words per minute",
    },
    {
      label: "Average accuracy",
      display: `${stats.averageAccuracy}%`,
      icon: "🎯",
      sub: "Aim for 90%+ target",
    },
    {
      label: stats.bestSession ? "Best session" : "Best speed",
      display: stats.bestSession ? `${stats.bestSession.wpm} WPM` : `${stats.bestWpm} WPM`,
      icon: "🌟",
      sub: stats.bestSession ? `${stats.bestSession.accuracy}% accuracy` : "No session recorded",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="warm-card p-5 flex flex-col justify-between hover:shadow-md hover:border-amber-300/80 transition-all duration-200"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-stone-500 font-bold text-[10px] uppercase tracking-wider">{card.label}</span>
            <span className="text-sm" aria-hidden="true">{card.icon}</span>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-amber-800 font-mono">
              {card.display}
            </div>
            {card.sub && (
              <div className="text-[10px] text-stone-500 font-medium mt-1 leading-relaxed">{card.sub}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}