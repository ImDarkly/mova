import { BOARD_SIZE } from "../constants"
import type { Tile } from "./types"

export function emptyBoard(): (Tile | null)[][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  )
}

export function tiles(letters: string, points = 1): Tile[] {
  return [...letters].map((letter) => ({ letter, points }))
}
