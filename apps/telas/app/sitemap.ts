import type { MetadataRoute } from 'next';

const SITE_URL = 'https://telas.cyberinformatica.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/lojista`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/termos-de-uso`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/politica-privacidade`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
