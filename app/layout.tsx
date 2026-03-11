import type { Metadata } from 'next';
import { Alike, Source_Sans_3, Mulish } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import LayoutWrapper from '@/components/LayoutWrapper';
import './globals.css';

const alike = Alike({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  variable: '--font-subheading',
  display: 'swap',
});

const mulish = Mulish({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EMMA Foundation | Empowered Muslimah',
  description: 'EMMA Foundation - Empowered Muslimah. Supporting and empowering Muslim women through community, retreats, and meaningful connections.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${alike.variable} ${sourceSans.variable} ${mulish.variable}`}>
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
        <SpeedInsights />
      </body>
    </html>
  );
}
