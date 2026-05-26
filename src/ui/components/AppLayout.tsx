/**
 * [LAYER: UI]
 * AppLayout — Cohesive study-desk shell wrapping lessons, practice logs, guide, and settings.
 * Manages responsive sidebar navigation, identity badge ranks, and client-side theme application.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocalSettings, getLocalStats, StudentSettings } from "@/src/core/utils/settings";

interface AppLayoutProps {
  children: React.ReactNode;
  focusMode?: boolean;
}

export default function AppLayout({ children, focusMode = false }: AppLayoutProps) {
  const pathname = usePathname();
  const [profileName, setProfileName] = useState("Learner Scribe");
  const [stats, setStats] = useState({ totalSessions: 0, averageWpm: 0, consistencyDaysCount: 0 });
  const [settings, setSettings] = useState<StudentSettings | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFocusActive, setIsFocusActive] = useState(focusMode);

  // Redirect to onboarding if not completed and trying to access inside pages
  useEffect(() => {
    const activeSettings = getLocalSettings();
    if (!activeSettings.onboardingCompleted && pathname !== "/onboarding" && pathname !== "/") {
      window.location.href = "/onboarding";
    }
  }, [pathname]);

  // Set initial focus mode on practice pages if configured
  useEffect(() => {
    const activeSettings = getLocalSettings();
    if (pathname.startsWith("/practice") && activeSettings.autoFocusMode) {
      const timer = setTimeout(() => {
        setIsFocusActive(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Listen to visual focus toggle events dispatched by child components
  useEffect(() => {
    const handleFocusToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.focusMode === "boolean") {
        setIsFocusActive(customEvent.detail.focusMode);
      }
    };
    window.addEventListener("typingjoy_focus_toggle", handleFocusToggle);
    return () => window.removeEventListener("typingjoy_focus_toggle", handleFocusToggle);
  }, []);

  // Load settings and profile data from localStorage
  useEffect(() => {
    const activeSettings = getLocalSettings();
    const localStats = getLocalStats();
    
    // Load theme & style overrides on mount
    document.documentElement.setAttribute("data-theme", activeSettings.theme);
    document.documentElement.setAttribute("data-font", activeSettings.fontFamily);
    document.documentElement.setAttribute("data-focus-contrast", activeSettings.focusContrast);
    document.documentElement.setAttribute("data-compact", String(activeSettings.compactUi));

    const timer = setTimeout(() => {
      setProfileName(activeSettings.profileName);
      setSettings(activeSettings);
      setStats(localStats);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Compute learner rank title based on WPM
  const getLearnerRank = (wpm: number, sessions: number) => {
    if (sessions === 0) return { title: "Novice Scribe", icon: "🪶" };
    if (wpm < 20) return { title: "Apprentice Typist", icon: "✉️" };
    if (wpm < 40) return { title: "Journeyman Scribe", icon: "📜" };
    if (wpm < 60) return { title: "Scholar Keyboardist", icon: "📖" };
    return { title: "Grand Master Scribe", icon: "👑" };
  };

  const rank = getLearnerRank(stats.averageWpm, stats.totalSessions);

  const navLinks = [
    { href: "/dashboard", label: "Classroom Desk", icon: "🏫" },
    { href: "/lessons", label: "Academy Curriculum", icon: "📚" },
    { href: "/custom-texts", label: "Custom Writing Studio", icon: "✍️" },
    { href: "/progress", label: "Progress Journal", icon: "📈" },
    { href: "/classroom-guide", label: "Classroom Manual", icon: "📖" },
    { href: "/settings", label: "Environmental Controls", icon: "⚙️" },
  ];

  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    const trail = [{ label: "🏫 Classroom Desk", href: "/dashboard" }];
    
    if (parts.length === 0 || parts[0] === "dashboard") {
      return [{ label: "🏫 Classroom Desk", href: "/dashboard" }];
    }
    
    if (parts[0] === "lessons") {
      trail.push({ label: "📚 Academy Curriculum", href: "/lessons" });
      if (parts[1] === "new") {
        trail.push({ label: "📝 Create Reach", href: "/lessons/new" });
      } else if (parts[1]) {
        trail.push({ label: "✍️ Edit Reach", href: `/lessons/${parts[1]}` });
      }
    } else if (parts[0] === "custom-texts") {
      trail.push({ label: "✍️ Custom Writing Studio", href: "/custom-texts" });
      if (parts[1] === "new") {
        trail.push({ label: "📝 Create Text", href: "/custom-texts/new" });
      } else if (parts[1]) {
        trail.push({ label: "✍️ Edit Text", href: `/custom-texts/${parts[1]}` });
      }
    } else if (parts[0] === "practice") {
      trail.push({ label: "🎯 Practice Studio", href: pathname });
    } else if (parts[0] === "progress") {
      trail.push({ label: "📓 Progress Journal", href: "/progress" });
    } else if (parts[0] === "classroom-guide") {
      trail.push({ label: "📖 Classroom Manual", href: "/classroom-guide" });
    } else if (parts[0] === "settings") {
      trail.push({ label: "⚙️ Environmental Controls", href: "/settings" });
    } else if (parts[0] === "onboarding") {
      return [{ label: "🏫 Campus Onboarding", href: "/onboarding" }];
    }
    
    return trail;
  };

  const breadcrumbs = getBreadcrumbs();

  // If focusMode is active, render a highly immersive, distraction-free environment
  if (isFocusActive) {
    return (
      <div className="min-h-screen bg-[#faf8f5] dark:bg-[#1a2318] transition-colors duration-300">
        <main className="px-4 py-8 md:py-16">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#faf8f5] transition-colors duration-300">
      {/* Mobile Top Navbar */}
      <header className="md:hidden flex items-center justify-between bg-amber-50/90 border-b border-amber-200/60 px-4 py-3 sticky top-0 z-50">
        <Link href="/" className="text-lg font-bold text-amber-800 flex items-center gap-2">
          ⌨️ TypingJoy
        </Link>
        <div className="flex items-center gap-3">
          {stats.consistencyDaysCount > 0 && (
            <span className="text-xs bg-amber-100/80 text-amber-800 font-bold px-2 py-0.5 rounded-full" title="Consistency streak">
              🔥 {stats.consistencyDaysCount}d
            </span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-stone-700 hover:text-amber-800 p-1 border border-stone-200 rounded"
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* Mobile Breadcrumb Bar */}
      {!isFocusActive && (
        <div className="md:hidden bg-amber-50/20 border-b border-amber-200/10 px-4 py-2 text-[10px] text-stone-500 flex gap-2 overflow-x-auto whitespace-nowrap">
          {breadcrumbs.map((bc, idx) => (
            <span key={bc.href} className="flex items-center gap-1.5">
              {idx > 0 && <span className="text-stone-300">/</span>}
              <Link href={bc.href} className="hover:text-amber-800">
                {bc.label}
              </Link>
            </span>
          ))}
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:static inset-y-0 left-0 z-40 w-64 bg-amber-50/80 md:bg-amber-50/45 border-r border-amber-200/50 flex flex-col justify-between transition-transform duration-300 ease-in-out`}
      >
        <div className="p-5 flex-1 flex flex-col overflow-y-auto">
          {/* Logo */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-2 text-2xl font-bold text-amber-800 border-b border-amber-200/55 pb-4 mb-6"
          >
            <span>⌨️</span> TypingJoy
          </Link>

          {/* Scribe Campus ID Card Widget */}
          <div className="bg-[#fdfcf9] rounded-xl p-4 border border-amber-200/50 shadow-xs mb-6 flex flex-col items-center relative overflow-hidden font-sans border-dashed text-center">
            <div className="absolute top-0 right-0 w-12 h-12 bg-amber-100/30 rounded-bl-full flex justify-end items-start p-1.5 text-xs text-amber-700 font-bold select-none opacity-40">
              ID
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-xl border border-amber-300/40 shadow-inner mb-2">
              {rank.icon}
            </div>
            <h3 className="font-bold text-stone-850 text-xs truncate max-w-full leading-tight font-serif-academy italic">
              {profileName}
            </h3>
            <p className="text-[9px] text-amber-750 font-bold tracking-wider uppercase mt-1">
              {rank.title}
            </p>
            
            <div className="w-full border-t border-dotted border-stone-200 mt-3 pt-3 text-[10px] text-stone-500 space-y-1">
              <div className="flex justify-between">
                <span>Registration:</span>
                <span className="font-mono text-[9px] text-stone-700">
                  {settings?.onboardingDate || "Campus Launch"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Milestone WPM:</span>
                <span className="font-mono text-[9px] text-stone-700 font-bold">
                  {stats.averageWpm || "-"} WPM
                </span>
              </div>
              <div className="flex justify-between">
                <span>Practices:</span>
                <span className="font-mono text-[9px] text-stone-700">
                  {stats.totalSessions || "0"} drills
                </span>
              </div>
              {stats.consistencyDaysCount > 0 && (
                <div className="flex justify-between">
                  <span>Desk Streak:</span>
                  <span className="font-mono text-[9px] text-amber-700 font-bold">
                    🔥 {stats.consistencyDaysCount} days
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 flex-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-amber-600 text-white shadow-sm font-semibold"
                      : "text-stone-600 hover:bg-amber-100/60 hover:text-amber-800"
                  }`}
                  onClick={() => {
                    // Close sidebar on mobile select
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  <span className="text-base" aria-hidden="true">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info inside sidebar */}
        <div className="p-5 border-t border-amber-200/30 text-center text-[10px] text-stone-400">
          TypingJoy Classroom Suite © 2026
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between border-b border-amber-200/20 px-8 py-4 bg-white/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            {breadcrumbs.map((bc, idx) => (
              <span key={bc.href} className="flex items-center gap-2">
                {idx > 0 && <span className="text-stone-300 font-normal">/</span>}
                <Link href={bc.href} className="hover:text-amber-800 transition">
                  {bc.label}
                </Link>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/classroom-guide"
              className="text-stone-500 hover:text-amber-800 text-xs font-semibold flex items-center gap-1 transition"
            >
              📖 Manual
            </Link>
            <Link
              href="/settings"
              className="text-stone-500 hover:text-amber-800 text-xs font-semibold flex items-center gap-1 transition"
            >
              ⚙️ Settings
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-grow p-4 md:p-8 overflow-y-auto max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile drawer backdrop */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-35 backdrop-blur-xs"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
