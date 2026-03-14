import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  thumbnail: string;
  featured: boolean;
  relatedTests: string[];
  relatedArticles: string[];
  readingTime: string;
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.mdx'));

  return files
    .map((filename) => {
      const slug = filename.replace('.mdx', '');
      const filePath = path.join(ARTICLES_DIR, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      const stats = readingTime(content);

      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        category: data.category || '',
        tags: data.tags || [],
        author: data.author || '스마트에듀픽',
        publishedAt: data.publishedAt || '',
        updatedAt: data.updatedAt || '',
        thumbnail: data.thumbnail || '',
        featured: data.featured || false,
        relatedTests: data.relatedTests || [],
        relatedArticles: data.relatedArticles || [],
        readingTime: `${Math.ceil(stats.minutes)}분`,
      } as ArticleMeta;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getArticleBySlug(slug: string) {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    meta: {
      slug,
      title: data.title || '',
      description: data.description || '',
      category: data.category || '',
      tags: data.tags || [],
      author: data.author || '스마트에듀픽',
      publishedAt: data.publishedAt || '',
      updatedAt: data.updatedAt || '',
      thumbnail: data.thumbnail || '',
      featured: data.featured || false,
      relatedTests: data.relatedTests || [],
      relatedArticles: data.relatedArticles || [],
      readingTime: `${Math.ceil(stats.minutes)}분`,
    } as ArticleMeta,
    content,
  };
}

export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''));
}

export function getRelatedArticles(slugs: string[]): ArticleMeta[] {
  const all = getAllArticles();
  return slugs
    .map((slug) => all.find((a) => a.slug === slug))
    .filter(Boolean) as ArticleMeta[];
}
