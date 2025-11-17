import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SilverStripe Documentation',
  description: 'SilverStripe CMS Documentation'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
