let fallbackClientId: string | undefined

export function getClientId(): string {
  const key = "clientId"
  try {
    const existing = localStorage.getItem(key)
    if (existing) return existing
    const id = crypto.randomUUID()
    localStorage.setItem(key, id)
    return id
  } catch {
    if (!fallbackClientId) fallbackClientId = crypto.randomUUID()
    return fallbackClientId
  }
}
