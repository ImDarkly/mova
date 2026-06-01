const KEY = "playerName"

export function getPlayerName(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setPlayerName(name: string): void {
  try {
    localStorage.setItem(KEY, name.trim())
  } catch (e) {
    console.error(e)
  }
}
