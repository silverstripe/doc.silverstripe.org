import { redirect } from 'next/navigation';
import { getConfig } from '@/lib/config/config';
import { getDefaultVersion } from '@/lib/versions/version-utils';

export default function Home() {
  const { docsContext } = getConfig();
  // Redirect to latest version for the current context
  redirect(`/en/${getDefaultVersion(docsContext)}/`);
}
