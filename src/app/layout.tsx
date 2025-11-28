import type { Metadata } from 'next';
import { generateRootMetadata } from '@/lib/seo';
import { RootLayoutClient } from '@/components/RootLayoutClient';
import { getConfig } from '@/lib/config';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'prismjs/themes/prism-okaidia.css';
import './globals.css';

export const metadata: Metadata = generateRootMetadata();

// Inline script to set dark mode before first paint to prevent FOUT
const darkModeScript = `
(function() {
  try {
    var saved = localStorage.getItem('theme_preference');
    var isDark = saved === 'dark';
    if (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDark = true;
    }
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { docsContext } = getConfig();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body>
        <RootLayoutClient docsContext={docsContext}>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
