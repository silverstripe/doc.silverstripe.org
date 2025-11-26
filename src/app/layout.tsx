import type { Metadata } from 'next';
import { generateRootMetadata } from '@/lib/seo';
import { RootLayoutClient } from '@/components/RootLayoutClient';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'prismjs/themes/prism-okaidia.css';
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
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
