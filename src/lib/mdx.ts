import { compileMDX } from 'next-mdx-remote/rsc';
import ExpertNote from '@/components/articles/ExpertNote';

const mdxComponents = {
  ExpertNote,
};

export async function renderMDX(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
    },
  });

  return content;
}

// Extract headings from MDX content for TOC
export function extractHeadings(
  content: string
): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ id, text, level });
  }

  return headings;
}

// Extract FAQ from markdown content
export interface FAQ {
  question: string;
  answer: string;
}

export function extractFAQs(content: string): FAQ[] {
  const faqRegex = /\*\*Q\.\s*(.+?)\*\*\s*\n\n([\s\S]*?)(?=\n\n\*\*Q\.|$)/g;
  const faqs: FAQ[] = [];
  let match;

  while ((match = faqRegex.exec(content)) !== null) {
    faqs.push({
      question: match[1].trim(),
      answer: match[2].trim(),
    });
  }

  return faqs;
}
