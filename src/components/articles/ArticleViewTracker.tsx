'use client';

import { useEffect } from 'react';
import { event as gaEvent } from '@/lib/analytics';

export default function ArticleViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    gaEvent('article_view', { article_slug: slug });
  }, [slug]);

  return null;
}
