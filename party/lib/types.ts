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

export interface CellCoord {
  row: number
  col: number
}

export type PublicPlayer = Omit<Player, "rack">

export function toPublicPlayer(p: Player): PublicPlayer {
  const { rack: _, ...pub } = p
  return pub
}

export function isPlacement(p: unknown): p is { row: number; col: number } {
  if (typeof p !== "object" || p === null || !("row" in p) || !("col" in p)) {
    return false
  }

  const { row, col } = p as { row: unknown; col: unknown }

  return (
    typeof row === "number" &&
    Number.isInteger(row) &&
    row >= 0 &&
    typeof col === "number" &&
    Number.isInteger(col) &&
    col >= 0
  )
}
