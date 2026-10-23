/**
 * Utility to normalize strings for accent-insensitive and case-insensitive searching
 */
export function normalizeSearchTerm(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function matchesSearch(text: string, query: string): boolean {
  if (!query) return true;
  const normalizedText = normalizeSearchTerm(text);
  const normalizedQuery = normalizeSearchTerm(query);
  return normalizedText.includes(normalizedQuery);
}
