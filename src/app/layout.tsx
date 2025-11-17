import type { Metadata } from 'next';
import { generateRootMetadata } from '@/lib/seo';

export const metadata: Metadata = generateRootMetadata();

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
