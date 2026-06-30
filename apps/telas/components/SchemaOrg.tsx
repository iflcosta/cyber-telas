// ============================================
// SchemaOrg — JSON-LD para SEO orgânico
//
// Server component (sem 'use client') que injeta Schema.org
// markup com os 76 modelos atendidos. Visível pro Google,
// invisível pro usuário — alimenta B2B-SEO de "laminação
// iPhone 17 SP", "troca tela Galaxy S25" etc.
//
// Preço público = valor cliente final (70% do full).
// NUNCA expõe valor lojista (35%) — confidencial.
// ============================================

import { MODEL_GROUPS } from '@/lib/pricing-models';
import { calcularPrecoTier, findTier } from '@/lib/pricing-tiers';

const SITE_URL = 'https://telas.cyberinformatica.tech';

export default function SchemaOrg() {
  const items = MODEL_GROUPS.flatMap((group) =>
    group.models.map((model) => {
      const tier = findTier(model.full);
      const finalPrice = calcularPrecoTier(model.full, 'final');
      return {
        '@type': 'ListItem' as const,
        position: 0, // preenchido depois
        item: {
          '@type': 'Service' as const,
          name: `Laminação OCA — ${group.brand} ${model.model}`,
          serviceType: 'Laminação OCA Industrial de Displays',
          category: tier ? tier.label : 'Laminação OCA',
          provider: {
            '@type': 'Organization' as const,
            name: 'Cyber Informática',
          },
          areaServed: {
            '@type': 'Country' as const,
            name: 'Brasil',
          },
          offers: {
            '@type': 'Offer' as const,
            price: finalPrice.toString(),
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock',
            priceValidUntil: '2026-12-31',
            url: `${SITE_URL}/#cotacao`,
          },
        },
      };
    }),
  );

  // Preenche position sequencial
  items.forEach((item, idx) => {
    item.position = idx + 1;
  });

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}#organization`,
        name: 'Cyber Informática',
        alternateName: 'Cyber Informatica',
        url: SITE_URL,
        logo: `${SITE_URL}/logo-horizontal.png`,
        description:
          'Centro de Remanufatura e Laminação Industrial de Displays. Sala limpa controlada, tecnologia OCA sob vácuo.',
        telephone: '+55-11-95436-9269',
        email: 'contato@cyberinformatica.tech',
        areaServed: {
          '@type': 'Country',
          name: 'Brasil',
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'BR',
          addressLocality: 'São Paulo',
          addressRegion: 'SP',
        },
        sameAs: [
          'https://cyberinformatica.tech',
        ],
      },
      {
        '@type': 'Service',
        '@id': `${SITE_URL}#service-laminacao-oca`,
        name: 'Laminação OCA Industrial de Displays',
        serviceType: 'Laminação OCA',
        description:
          'Laminação OCA (Optically Clear Adhesive) industrial de displays em sala limpa controlada. Tecnologia sob vácuo com autoclave industrial.',
        provider: {
          '@id': `${SITE_URL}#organization`,
        },
        areaServed: {
          '@type': 'Country',
          name: 'Brasil',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Modelos atendidos — Laminação OCA',
          numberOfItems: items.length,
          itemListElement: items,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}