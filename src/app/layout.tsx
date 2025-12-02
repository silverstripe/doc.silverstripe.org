import type { Metadata } from 'next';
import { generateRootMetadata } from '@/lib/seo';
import { RootLayoutClient } from '@/components/RootLayoutClient';
import { getConfig } from '@/lib/config';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'prismjs/themes/prism-okaidia.css';
import './globals.css';

export const metadata: Metadata = generateRootMetadata();

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { docsContext } = getConfig();

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <RootLayoutClient docsContext={docsContext}>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
