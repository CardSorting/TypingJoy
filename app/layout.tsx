/**
 * [LAYER: UI]
 * RootLayout — Root Next.js layout component.
 * Sets the default HTML context and body wrapper, deferring layout details to page views.
 */
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TypingJoy — Cozy Touch-Typing Academy',
  description: 'A warm, patient touch-typing tutor that helps you build accuracy through focused, gentle practice.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}