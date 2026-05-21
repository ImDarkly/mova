import { Player } from "./types"

export function findFirstConnectedPlayer(
  playerOrder: string[],
  players: Record<string, Player>
): string | null {
  return playerOrder.find((id) => players[id]?.connected) ?? null
}

export function advanceToNextConnectedPlayer(
  playerOrder: string[],
  players: Record<string, Player>,
  currentTurn: string | null
): string | null {
  const len = playerOrder.length
  if (len === 0) return null
  const start = currentTurn ? playerOrder.indexOf(currentTurn) : -1
  for (let i = 1; i <= len; i++) {
    const candidate = playerOrder[(start + i) % len]
    if (players[candidate]?.connected) return candidate
  }
  return null
}
