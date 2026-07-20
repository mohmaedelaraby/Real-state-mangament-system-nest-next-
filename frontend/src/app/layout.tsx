import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nawy Apartments',
  description: 'Browse and list apartments',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
