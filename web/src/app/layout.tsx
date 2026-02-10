import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'claw-slack | Multi-tab chat for OpenClaw Gateway',
  description: '🦞 Multi-tab chat UI for OpenClaw Gateway sessions',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}