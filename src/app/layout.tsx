import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { generateRootMetadata } from '@/lib/metadata/metadata';
import { RootLayoutClient } from '@/components/RootLayoutClient';
import { getConfig } from '@/lib/config/config';
import { DarkModeScript } from './dark-mode-script';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'prismjs/themes/prism-okaidia.css';
import '../styles/app.css';

const inter = Inter({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = generateRootMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { docsContext, docsearchAppId } = getConfig();

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={inter.variable}>
      <head>
        <link
          rel="preconnect"
          href={`https://${docsearchAppId}-dsn.algolia.net`}
          crossOrigin="anonymous"
        />
        <DarkModeScript />
      </head>
      <body>
        <RootLayoutClient docsContext={docsContext}>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
