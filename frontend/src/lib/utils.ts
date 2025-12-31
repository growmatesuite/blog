import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Robustly extracts plain text from a node structure (React children or Strapi block children)
 */
export function extractText(children: any): string {
  if (!children) return '';
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);

  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }

  // Handle React props.children or Strapi block property structure
  const node = children.props || children;
  if (node.text) return node.text;
  if (node.children) return extractText(node.children);

  return '';
}

/**
 * Generates a URL-friendly ID from text, matching the ArticleContent generation logic
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
