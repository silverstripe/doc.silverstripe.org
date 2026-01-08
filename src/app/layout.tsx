import type { Metadata } from 'next';
import { generateRootMetadata } from '@/lib/metadata/metadata';
import { RootLayoutClient } from '@/components/RootLayoutClient';
import { getConfig } from '@/lib/config/config';
import { DarkModeScript } from './dark-mode-script';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'prismjs/themes/prism-okaidia.css';
import './globals.css';

export const metadata: Metadata = generateRootMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { docsContext, docsearchAppId } = getConfig();

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link
          rel="preconnect"
          href={`https://${docsearchAppId}-dsn.algolia.net`}
          crossOrigin="anonymous"
        />
        <DarkModeScript />
      </head>
      <body className="body-container">
        <div className="main-wrapper">
          <RootLayoutClient docsContext={docsContext}>{children}</RootLayoutClient>
        </div>
      </body>
    </html>
  );
}
