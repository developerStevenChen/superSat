/** Program (course) public URL helpers */
export const PROGRAM_LIST_PATH = '/program';

/** Detail page: /{slug} (no /class prefix) */
export function programDetailPath(slug) {
  const cleaned = String(slug || '')
    .trim()
    .replace(/^\/+/, '')
    .replace(/^class\//, '');
  return cleaned ? `/${cleaned}` : PROGRAM_LIST_PATH;
}

/** Normalize legacy /class paths from CMS or API */
export function normalizePublicPath(path) {
  if (!path) return path;
  if (path === '/class') return PROGRAM_LIST_PATH;
  if (path.startsWith('/class/')) return path.replace(/^\/class\//, '/');
  return path;
}
