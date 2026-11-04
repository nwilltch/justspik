import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JustSpik — Reflex Speech Training',
  description: 'Entraîne tes réflexes d’élocution en anglais sous chrono avec JustSpik.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-[#fafaf9] text-stone-900 antialiased selection:bg-teal-100 selection:text-teal-900">
        {children}
      </body>
    </html>
  );
}
