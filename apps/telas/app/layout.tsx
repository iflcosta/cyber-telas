import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// ============================================
// next/font/google — self-hosted, zero FOUT, mata warning do ESLint
// ============================================
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

const SITE_URL = 'https://telas.cyberinformatica.tech';
const OG_IMAGE = `${SITE_URL}/og-image.png`;
const TITLE = 'Cyber Informática | Centro de Remanufatura e Laminação Industrial de Displays';
const DESCRIPTION =
  'Centro de Remanufatura e Laminação Industrial de Displays. Exclusivo para Assistências Técnicas e Lojistas de Tecnologia. Faturamento Exclusivo via CNPJ.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s · Cyber Informática',
  },
  description: DESCRIPTION,
  keywords: [
    'remanufatura de displays',
    'laminação industrial',
    'laminação OCA',
    'processamento de lotes eletrônicos',
    'OCA a vácuo',
    'Cyber Informática',
    'B2B',
    'assistência técnica',
    'lojista de tecnologia',
  ],
  authors: [{ name: 'Cyber Informática' }],
  creator: 'Cyber Informática',
  publisher: 'Cyber Informática',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Cyber Informática',
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Cyber Informática — Centro de Remanufatura e Laminação Industrial de Displays',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: '/logo-monograma-256.png', sizes: '256x256', type: 'image/png' },
    ],
    apple: [{ url: '/logo-monograma-256.png', sizes: '256x256', type: 'image/png' }],
  },
};

// ============================================
// JSON-LD Schema.org — LocalBusiness + Service
// (Google rich results + melhor indexação)
// ============================================
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#business`,
      name: 'Cyber Informática',
      alternateName: 'Unidade de Engenharia de Componentes Eletrônicos S/A',
      description: DESCRIPTION,
      url: SITE_URL,
      telephone: '+55-11-95436-9269',
      email: 'contato@cyberinformatica.tech',
      image: OG_IMAGE,
      logo: `${SITE_URL}/logo-monograma-256.png`,
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'BR',
        addressLocality: 'São Paulo',
        addressRegion: 'SP',
      },
      areaServed: {
        '@type': 'Country',
        name: 'Brasil',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00',
        },
      ],
      sameAs: [],
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#service`,
      serviceType: 'Laminação OCA Industrial de Displays',
      provider: { '@id': `${SITE_URL}/#business` },
      areaServed: { '@type': 'Country', name: 'Brasil' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Tabela de Faixas de Preço',
        itemListElement: [
          { '@type': 'Offer', name: 'Econômico', price: '80.00', priceCurrency: 'BRL' },
          { '@type': 'Offer', name: 'Intermediário', price: '120.00', priceCurrency: 'BRL' },
          { '@type': 'Offer', name: 'Premium', price: '180.00', priceCurrency: 'BRL' },
          { '@type': 'Offer', name: 'Top', price: '250.00', priceCurrency: 'BRL' },
          { '@type': 'Offer', name: 'Flagship', price: '320.00', priceCurrency: 'BRL' },
        ],
      },
      description:
        'Remanufatura e laminação OCA sob vácuo para displays de smartphones. Processamento de lotes para assistências técnicas e lojistas de tecnologia. Exclusivo B2B.',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
