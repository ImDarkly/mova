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
  const { rack: _rack, ...pub } = p
  return pub
}

export function isPlacement(
  p: unknown
): p is { rackIndex: number; row: number; col: number } {
  if (
    typeof p !== "object" ||
    p === null ||
    !("row" in p) ||
    !("col" in p) ||
    !("rackIndex" in p)
  ) {
    return false
  }

  const { row, col, rackIndex } = p as {
    row: unknown
    col: unknown
    rackIndex: unknown
  }

  return (
    typeof rackIndex === "number" &&
    Number.isInteger(rackIndex) &&
    rackIndex >= 0 &&
    typeof row === "number" &&
    Number.isInteger(row) &&
    row >= 0 &&
    typeof col === "number" &&
    Number.isInteger(col) &&
    col >= 0
  )
}
