import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import CookieConsent from '@/components/CookieConsent';
import './globals.css';

// ============================================
// LGPD consent default — inline no head (não usa next/script por questão de ordem)
// É pequeno e executa antes de qualquer tag de analytics.
// ============================================
const consentDefaultScript = `
(function(){
  try {
    var KEY='lgpd-consent';
    var raw=localStorage.getItem(KEY);
    var granted={analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted'};
    window.dataLayer=window.dataLayer||[];
    window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
    if(raw){
      var c=JSON.parse(raw);
      if(c && c.v===1){
        granted.analytics_storage=c.analytics?'granted':'denied';
        granted.ad_storage=c.marketing?'granted':'denied';
        granted.ad_user_data=c.marketing?'granted':'denied';
        granted.ad_personalization=c.marketing?'granted':'denied';
        gtag('consent','update',granted);
        return;
      }
    }
    gtag('consent','default',Object.assign({wait_for_update:500},granted));
  } catch(e) {}
})();
`;

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
// ============================================
// Meta tags otimizadas (alvos: title ≤60, description ≤125)
// Anteriores: title 77, description 153 (truncavam em X/LinkedIn/mobile)
// ============================================
const TITLE = 'Laminação OCA Industrial de Displays · Cyber Informática';
const DESCRIPTION =
  'Laminação OCA industrial B2B. Para assistências técnicas e lojistas. Apenas CNPJ. Lotes prontos em 24h.';

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
      <head>
        {/* LGPD consent mode default — DEVE rodar antes de qualquer tag de analytics */}
        <script
          dangerouslySetInnerHTML={{ __html: consentDefaultScript }}
        />
      </head>
      <body>
        {children}
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
