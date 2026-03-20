import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllArticleSlugs, getRelatedArticles } from '@/lib/articles';
import { renderMDX, extractHeadings, extractFAQs } from '@/lib/mdx';
import { getCategoryById } from '@/data/categories';
import ArticleTOC from '@/components/articles/ArticleTOC';
import RelatedTests from '@/components/articles/RelatedTests';
import RelatedArticles from '@/components/articles/RelatedArticles';
import ArticleShareBar from '@/components/articles/ArticleShareBar';
import ArticleViewTracker from '@/components/articles/ArticleViewTracker';
import NewsletterCTA from '@/components/articles/NewsletterCTA';
import ReadingProgress from '@/components/articles/ReadingProgress';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: '아티클을 찾을 수 없습니다' };

  const { meta } = article;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.tags.join(', '),
    authors: [{ name: meta.author }],
    alternates: {
      canonical: `https://smartedu-pick.com/articles/${slug}`,
    },
    openGraph: {
      title: `${meta.title} | 스마트에듀픽`,
      description: meta.description,
      url: `https://smartedu-pick.com/articles/${slug}`,
      type: 'article',
      publishedTime: meta.publishedAt,
      modifiedTime: meta.updatedAt,
      authors: [meta.author],
      tags: meta.tags,
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const { meta, content } = article;
  const category = getCategoryById(meta.category);
  const headings = extractHeadings(content);
  const faqs = extractFAQs(content);
  const mdxContent = await renderMDX(content);
  const related = getRelatedArticles(meta.relatedArticles);

  // Schema.org Article structured data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.description,
    author: {
      '@type': 'Person',
      name: meta.author,
    },
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt,
    publisher: {
      '@type': 'Organization',
      name: '스마트에듀픽',
      url: 'https://smartedu-pick.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://smartedu-pick.com/articles/${slug}`,
    },
    keywords: meta.tags.join(', '),
  };

  // Schema.org FAQPage structured data
  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <ArticleViewTracker slug={slug} />
      <ReadingProgress />
      <div className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          {/* Article Header */}
          <header className="mx-auto mb-10 max-w-3xl">
            {category && (
              <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {category.emoji} {category.label}
              </span>
            )}
            <h1 className="mb-4 text-2xl font-extrabold leading-tight text-text-primary md:text-3xl lg:text-4xl">
              {meta.title}
            </h1>
            <p className="mb-4 text-base text-text-secondary md:text-lg">
              {meta.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span>✍️ {meta.author}</span>
              <span>📅 {meta.publishedAt.replace(/-/g, '.')}</span>
              <span>⏱ {meta.readingTime} 읽기</span>
            </div>
          </header>

          {/* Mobile TOC */}
          <div className="mx-auto max-w-3xl lg:hidden">
            <ArticleTOC headings={headings} />
          </div>

          {/* Main Layout: Content + Sidebar */}
          <div className="mx-auto max-w-6xl lg:flex lg:gap-10">
            {/* Article Content */}
            <article className="mx-auto min-w-0 max-w-3xl flex-1">
              {/* Ad Slot Placeholder 1 */}
              {/* AdSense 승인 후 자동 표시 */}

              {/* MDX Content */}
              <div className="prose prose-lg max-w-none prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:text-text-primary prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-xl prose-h2:md:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-lg prose-p:leading-relaxed prose-p:text-text-secondary prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-ul:text-text-secondary prose-ol:text-text-secondary prose-li:leading-relaxed prose-blockquote:border-primary prose-blockquote:text-text-secondary">
                {mdxContent}
              </div>

              {/* Ad Slot Placeholder 2 */}
              {/* AdSense 승인 후 자동 표시 */}

              {/* FAQ Section */}
              {faqs.length > 0 && (
                <section className="my-12">
                  <h2 className="mb-6 text-xl font-bold text-text-primary md:text-2xl">
                    ❓ 자주 묻는 질문
                  </h2>
                  <div className="space-y-4">
                    {faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-border bg-surface p-5"
                      >
                        <h3 className="mb-2 font-bold text-text-primary">
                          Q. {faq.question}
                        </h3>
                        <p className="text-sm leading-relaxed text-text-secondary">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tags */}
              <div className="my-8 flex flex-wrap gap-2">
                {meta.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/articles?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-bg px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Share Bar */}
              <div className="my-8">
                <ArticleShareBar title={meta.title} slug={slug} />
              </div>

              {/* Ad Slot Placeholder 3 */}
              {/* AdSense 승인 후 자동 표시 */}

              {/* Related Test CTA Banner */}
              {meta.relatedTests.length > 0 && (
                <div className="my-10 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 p-6 md:p-8">
                  <h2 className="mb-2 text-lg font-bold text-text-primary md:text-xl">
                    🎯 이 아티클을 읽은 분들이 가장 많이 해본 테스트
                  </h2>
                  <p className="mb-5 text-sm text-text-secondary">
                    읽은 내용을 바탕으로 나에게 맞는 유형을 확인해보세요
                  </p>
                  <RelatedTests testIds={meta.relatedTests} variant="bottom" />
                </div>
              )}

              {/* Related Articles */}
              {related.length > 0 && (
                <div className="my-10">
                  <RelatedArticles articles={related} />
                </div>
              )}

              {/* Newsletter CTA */}
              <div className="my-10">
                <NewsletterCTA variant="bottom" />
              </div>
            </article>

            {/* Desktop Sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <ArticleTOC headings={headings} />
              {meta.relatedTests.length > 0 && (
                <RelatedTests testIds={meta.relatedTests} variant="sidebar" />
              )}
              <NewsletterCTA variant="sidebar" />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
