/**
 * [LAYER: UI]
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'TypingJoy — Learn to Type with Calm Accuracy',
  description: 'A warm, patient touch-typing tutor that helps you build accuracy through focused, gentle practice.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="flex items-center justify-between bg-amber-50/80 backdrop-blur-sm border-b border-amber-200 px-4 py-3 sticky top-0 z-50">
          <Link href="/" className="text-xl font-bold text-amber-700 flex items-center gap-2">
            ⌨️ TypingJoy
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/lessons" className="text-stone-600 hover:text-amber-700 font-medium transition">
              Lessons
            </Link>
            <Link href="/custom-texts" className="text-stone-600 hover:text-amber-700 font-medium transition">
              Custom Texts
            </Link>
            <Link href="/progress" className="text-stone-600 hover:text-amber-700 font-medium transition">
              Progress
            </Link>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <footer className="text-center text-stone-400 text-sm py-8">
          ⌨️ TypingJoy &mdash; Learn to type with joy
        </footer>
      </body>
    </html>
  );
}