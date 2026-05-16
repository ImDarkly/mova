let fallbackClientId: string | undefined

function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getClientId(): string {
  const key = "clientId"
  try {
    const existing = localStorage.getItem(key)
    if (existing) return existing
    const id = globalThis.crypto?.randomUUID?.() ?? generateId()
    localStorage.setItem(key, id)
    return id
  } catch {
    if (!fallbackClientId)
      fallbackClientId = globalThis.crypto?.randomUUID?.() ?? generateId()
    return fallbackClientId
  }
}
