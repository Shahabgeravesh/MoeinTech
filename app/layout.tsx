import { locales } from '@/i18n';
import { redirect } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout only renders for the root path
  // The middleware handles locale routing
  return children;
}
