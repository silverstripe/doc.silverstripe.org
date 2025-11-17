import { redirect } from 'next/navigation';

export default function EnIndexPage() {
  // Redirect to latest version
  redirect('/en/6/');
}
