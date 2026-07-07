import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Showmatic AI — SaaS Explainer Videos, Made Simple',
    template: '%s | Showmatic AI',
  },
  description:
    'Create polished SaaS explainer videos in minutes. Choose a template, add your content, and export without complex video editing.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'Showmatic AI',
    title: 'Showmatic AI — SaaS Explainer Videos, Made Simple',
    description:
      'Create polished SaaS explainer videos in minutes. Choose a template, add your content, and export without complex video editing.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
