export function matchesSearch(
  source: string | null | undefined,
  query: string | null | undefined
): boolean {
  if (!query) return true;
  if (!source) return false;
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  return normalize(String(source)).includes(normalize(String(query)));
}
