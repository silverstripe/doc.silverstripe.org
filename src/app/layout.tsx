import type { Metadata } from 'next';
import { generateRootMetadata } from '@/lib/seo';
import { Header } from '@/components/Header';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './globals.css';

export const metadata: Metadata = generateRootMetadata();

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
