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
  description: 'AI가 골라주는 나에게 딱 맞는 교육',
  inLanguage: 'ko',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE.url}/articles?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};
