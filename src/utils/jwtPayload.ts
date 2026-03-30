function parseJwtRecord(accessToken: string): Record<string, unknown> | null {
  try {
    const parts = accessToken.split('.')
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const pad = (4 - (base64.length % 4)) % 4
    const padded = base64 + '='.repeat(pad)
    const json = atob(padded)
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

/** `exp` is invalid or missing → treated as not valid (fail closed). */
export function isJwtValid(accessToken: string): boolean {
  const payload = parseJwtRecord(accessToken)
  if (!payload) return false
  const exp = payload.exp
  if (typeof exp !== 'number') return false
  return exp * 1000 > Date.now()
}

/** Read JWT payload (signature not verified — same as server trust boundaries). */
export function readJwtPayload(accessToken: string): {
  id?: string
  email?: string
  role?: string
} | null {
  const payload = parseJwtRecord(accessToken)
  if (!payload) return null
  return {
    id: typeof payload.id === 'string' ? payload.id : undefined,
    email: typeof payload.email === 'string' ? payload.email : undefined,
    role: typeof payload.role === 'string' ? payload.role : undefined,
  }
}
