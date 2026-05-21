export interface Tile {
  letter: string
  points: number
}

export interface Player {
  id: string
  ready: boolean
  rack: Tile[]
  connected: boolean
}

export type PublicPlayer = Omit<Player, "rack">

export function toPublicPlayer(p: Player): PublicPlayer {
  const { rack: _, ...pub } = p
  return pub
}

export function isPlacement(p: unknown): p is { rackIndex: number } {
  if (typeof p !== "object" || p === null || !("rackIndex" in p)) {
    return false
  }

  const { rackIndex } = p as { rackIndex: unknown }

  return (
    typeof rackIndex === "number" &&
    Number.isInteger(rackIndex) &&
    rackIndex >= 0
  )
}
