/** Turn API-relative paths like `/image/foo.jpg` into absolute URLs for `<img src>`. */
export function resolveMediaUrl(path: string | undefined | null): string {
  if (!path?.trim()) return ''
  const p = path.trim()
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  const rawBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
  const origin = rawBase.replace(/\/api\/v1\/?$/i, '')
  const suffix = p.startsWith('/') ? p : `/${p}`
  return `${origin}${suffix}`
}
