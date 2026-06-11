import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cyber Informática | Centro de Remanufatura e Laminação Industrial de Displays',
  description: 'Centro de Remanufatura e Laminação Industrial de Displays. Exclusivo para Assistências Técnicas e Lojistas de Tecnologia. Faturamento Exclusivo via CNPJ.',
  keywords: ['remanufatura de displays', 'laminação industrial', 'laminação OCA', 'processamento de lotes eletrônicos', 'Cyber Informática', 'B2B'],
  authors: [{ name: 'Cyber Informática' }],
  openGraph: {
    title: 'Cyber Informática | Centro de Remanufatura e Laminação Industrial de Displays',
    description: 'Centro de Remanufatura e Laminação Industrial de Displays. Exclusivo para Assistências Técnicas e Lojistas de Tecnologia.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Cyber Informática',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/png" sizes="256x256" href="/logo-monograma-256.png" />
        <link rel="apple-touch-icon" sizes="256x256" href="/logo-monograma-256.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
