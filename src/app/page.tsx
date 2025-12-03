import { redirect } from 'next/navigation';
import { DEFAULT_VERSION } from '@/global-config';

export default function Home() {
  // Redirect to latest version
  redirect(`/en/${DEFAULT_VERSION}/`);
}
