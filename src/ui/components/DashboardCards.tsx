/**
 * [LAYER: UI]
 * DashboardCards — Displays compact typing statistics.
 */

"use client";

interface DashboardCardsProps {
  stats: {
    totalSessions: number;
    averageWpm: number;
    averageAccuracy: number;
    bestWpm: number;
  };
}

export default function DashboardCards({ stats }: DashboardCardsProps) {
  const cards = [
    {
      label: "Total Sessions",
      value: stats.totalSessions,
      render: (v: number) => v.toString(),
    },
    {
      label: "Average WPM",
      value: stats.averageWpm,
      render: (v: number) => `${v}`,
    },
    {
      label: "Accuracy",
      value: stats.averageAccuracy,
      render: (v: number) => `${v}%`,
    },
    {
      label: "Best WPM",
      value: stats.bestWpm,
      render: (v: number) => `${v}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="stat-card hover:shadow-md hover:border-amber-300/60 transition-all duration-200"
        >
          <div className="stat-label">{card.label}</div>
          <div className="stat-value mt-2">
            {card.render(card.value)}
          </div>
        </div>
      ))}
    </div>
  );
}
