// ============================================
// SchemaOrg — JSON-LD B2B (usado em /lojista)
//
// Server component que declara o Service B2B e o catálogo de
// modelos atendidos (bom para SEO orgânico: "laminação iPhone 17",
// "troca vidro Galaxy S25"). Referencia a entidade única do negócio
// (@id definido no layout) — não redefine a organização.
//
// NÃO expõe preços (valores em auditoria / confidenciais).
// ============================================

import { MODEL_GROUPS } from '@/lib/pricing-models';

const SITE_URL = 'https://telas.cyberinformatica.tech';

export default function SchemaOrg() {
  const items = MODEL_GROUPS.flatMap((group) =>
    group.models.map((model) => ({
      '@type': 'ListItem' as const,
      position: 0, // preenchido depois
      item: {
        '@type': 'Service' as const,
        name: `Laminação OCA — ${group.brand} ${model.model}`,
        serviceType: 'Laminação OCA / troca de vidro de display',
        provider: { '@id': `${SITE_URL}/#business` },
        areaServed: { '@type': 'Country' as const, name: 'Brasil' },
      },
    })),
  );

  // Preenche position sequencial
  items.forEach((item, idx) => {
    item.position = idx + 1;
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}/#service-lojista`,
    name: 'Laminação OCA para lojistas e assistências técnicas',
    serviceType: 'Laminação OCA / troca de vidro de display',
    description:
      'Laminação OCA — troca do vidro externo preservando o display original — para assistências técnicas e lojistas credenciados (CNPJ).',
    provider: { '@id': `${SITE_URL}/#business` },
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
