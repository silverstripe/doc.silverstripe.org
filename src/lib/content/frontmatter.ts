import matter from 'gray-matter';
import { DocumentMeta } from '@/types';

/**
 * Parse frontmatter from markdown content
 */
export function parseFrontmatter(content: string): {
  data: DocumentMeta;
  content: string;
} {
  try {
    const { data, content: markdownContent } = matter(content);
    const validatedData = validateFrontmatter(data);
    return {
      data: validatedData,
      content: markdownContent,
    };
  } catch (error) {
    throw new Error(`Failed to parse frontmatter: ${error}`);
  }
}

/**
 * Validate and normalize frontmatter data
 */
export function validateFrontmatter(data: Record<string, unknown>): DocumentMeta {
  const validated: DocumentMeta = {
    title: data.title ? String(data.title) : undefined,
    summary: data.summary ? String(data.summary) : undefined,
    introduction: data.introduction ? String(data.introduction) : undefined,
    icon: data.icon ? String(data.icon) : undefined,
    iconBrand: data.iconBrand ? String(data.iconBrand) : undefined,
    hideChildren: Boolean(data.hideChildren) || false,
    hideSelf: Boolean(data.hideSelf) || false,
    unhideSelf: Boolean(data.unhideSelf) || false,
  };

  // Keep any additional unknown fields as-is
  Object.keys(data).forEach((key) => {
    if (!(key in validated)) {
      validated[key] = data[key];
    }
  });

  // Remove undefined values
  Object.keys(validated).forEach((key) => {
    if (validated[key as keyof DocumentMeta] === undefined) {
      delete validated[key as keyof DocumentMeta];
    }
  });

  return validated;
}
