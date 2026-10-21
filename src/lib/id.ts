export function createId(prefix = 'card'): string {
  const random =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

  return `${prefix}-${random}`
}
