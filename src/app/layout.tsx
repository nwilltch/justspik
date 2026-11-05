import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

export const metadata: Metadata = {
  metadataBase: new URL('https://justspik.com'),
  title: {
    default: 'JustSpik — Reflex Speech Training',
    template: '%s | JustSpik',
  },
  description:
    'Entraîne tes réflexes d’élocution et de prononciation sous chrono avec JustSpik. Parle avec aisance et fluidité à l’oral.',
  keywords: [
    'anglais oral',
    'justspik',
    'apprentissage langues',
    'prononciation anglais',
    'réflexes élocution',
    'speech training',
    'practice speaking',
  ],
  authors: [{ name: 'JustSpik Team' }],
  creator: 'JustSpik',
  publisher: 'JustSpik',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://justspik.com',
  },
  openGraph: {
    title: 'JustSpik — Reflex Speech Training',
    description:
      'Entraîne tes réflexes d’élocution et de prononciation sous chrono avec JustSpik. Répète, améliore ta fluidité et bats tes records à l’oral.',
    url: 'https://justspik.com',
    siteName: 'JustSpik',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'JustSpik — Reflex Speech Training',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JustSpik — Reflex Speech Training',
    description:
      'Entraîne tes réflexes d’élocution et de prononciation sous chrono avec JustSpik. Parle avec aisance et fluidité à l’oral.',
    creator: '@justspik',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Brieflish Analytics - Intégration officielle */}
        <script
          defer
          data-domain="justspik.com"
          src="https://brieflish.com/tracker.js"
        />
      </head>
      <body className="bg-[#fafaf9] text-stone-900 antialiased selection:bg-teal-100 selection:text-teal-900 min-h-screen">
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
