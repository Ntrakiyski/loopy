// app/layout.tsx

import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
// REMOVE THIS: import { Toaster } from '@/components/ui/toaster';
import { Toaster } from 'sonner'; // IMPORT SONNER INSTEAD
import { WebPlaybackProvider } from '@/player/web-playback-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'Spotify Segment Looper',
  description: 'Loop segments of your favorite Spotify tracks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <WebPlaybackProvider>
          {children}
        </WebPlaybackProvider>
        {/* Use the sonner Toaster component */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}