import { site, home, img, telIntl, absolute } from './site';

// schema.org structured data for local SEO. Google reads it to fill the business panel
// (phone, hours, area served). Ratings are deliberately absent: Google ignores
// self-published reviews on a LocalBusiness and can penalise them.

export function businessSchema(siteUrl: URL | undefined, services: { title: string; id: string }[]) {
  const homeUrl = absolute('/', siteUrl);
  const hours = site.hours
    .filter((h) => h.days.length && h.opens && h.closes)
    .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes }));

  return {
    '@context': 'https://schema.org',
    '@type': site.schemaType,
    '@id': `${homeUrl}#entreprise`,
    name: site.name,
    description: home.seoDescription,
    url: homeUrl,
    telephone: telIntl(site.phone),
    email: site.email,
    image: img(home.heroImage, 1200, 630),
    founder: { '@type': 'Person', name: site.owner },
    foundingDate: String(site.founded),
    priceRange: site.priceRange,
    address: {
      '@type': 'PostalAddress',
      ...(site.showAddress && site.street ? { streetAddress: site.street } : {}),
      addressLocality: site.city,
      postalCode: site.postalCode,
      addressRegion: site.region,
      addressCountry: 'FR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.lat, longitude: site.lng },
    areaServed: site.areas.map((name) => ({ '@type': 'City', name })),
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
    ...(site.googleBusinessUrl ? { sameAs: [site.googleBusinessUrl] } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Prestations',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, url: absolute(`/prestations/${s.id}/`, siteUrl) },
      })),
    },
  };
}

export function breadcrumbSchema(siteUrl: URL | undefined, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absolute(item.path, siteUrl),
    })),
  };
}

export function serviceSchema(siteUrl: URL | undefined, s: { title: string; summary: string; id: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.title,
    description: s.summary,
    url: absolute(`/prestations/${s.id}/`, siteUrl),
    provider: { '@id': `${absolute('/', siteUrl)}#entreprise` },
    areaServed: site.areas.map((name) => ({ '@type': 'City', name })),
  };
}
