import type { Metadata, Viewport } from 'next';
import { Lora, Poiret_One } from 'next/font/google';
import { SmoothScroll } from '@/components/SmoothScroll';
import { site } from '@/content/site';
import './globals.css';

const display = Poiret_One({
  weight: '400',
  subsets: ['cyrillic', 'latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = Lora({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${site.name} — база отдыха`,
  description: 'Домики в лесу, баня на дровах, тишина и свежий воздух. Демо-сайт базы отдыха.',
};

export const viewport: Viewport = {
  themeColor: '#424123',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
