import { getAllArticles } from '@/lib/articles';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRFC822(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

export function GET() {
  const articles = getAllArticles()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 20);

  const items = articles
    .map(
      (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>https://smartedu-pick.com/articles/${article.slug}</link>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${toRFC822(article.publishedAt)}</pubDate>
      <guid isPermaLink="true">https://smartedu-pick.com/articles/${article.slug}</guid>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>스마트에듀픽</title>
    <link>https://smartedu-pick.com</link>
    <description>AI가 골라주는 나에게 딱 맞는 교육</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://smartedu-pick.com/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
