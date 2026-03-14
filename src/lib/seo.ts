import { SITE } from './constants';

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/icons/logo.png`,
  description: SITE.description,
  sameAs: [SITE.links.blogA, SITE.links.blogB, SITE.links.youtube],
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: 'ko',
};
