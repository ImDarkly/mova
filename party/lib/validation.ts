import { Tile } from "./types"

type Placement = { rackIndex: number; row: number; col: number }
type ValidationResult =
  | { valid: true }
  | {
      valid: false
      error: "NO_TILES" | "NOT_IN_LINE" | "GAP_NOT_FILLED" | "NOT_CONNECTED"
    }
export type SubmitErrorCode = Extract<
  ValidationResult,
  { valid: false }
>["error"]

export function validatePlacements(
  placements: Placement[],
  board: (Tile | null)[][]
): ValidationResult {
  if (placements.length === 0) return { valid: false, error: "NO_TILES" }

  if (placements.length > 1) {
    const lineResult = isInline(placements, board)
    if (!lineResult.valid) return lineResult
  }

  return isConnected(placements, board)
}

function isInline(
  placements: Placement[],
  board: (Tile | null)[][]
): ValidationResult {
  const rows = placements.map((p) => p.row)
  const cols = placements.map((p) => p.col)

  const allSameRow = rows.every((r) => r === rows[0])
  const allSameCol = cols.every((c) => c === cols[0])

  if (!allSameCol && !allSameRow) return { valid: false, error: "NOT_IN_LINE" }

  if (allSameRow) {
    const minCol = Math.min(...cols)
    const maxCol = Math.max(...cols)

    for (let c = minCol; c <= maxCol; c++) {
      const isNewTile = placements.some((p) => p.row === rows[0] && p.col === c)
      const isOnBoard = board[rows[0]][c] !== null
      if (!isNewTile && !isOnBoard) {
        return { valid: false, error: "GAP_NOT_FILLED" }
      }
    }
  } else {
    const minRow = Math.min(...rows)
    const maxRow = Math.max(...rows)

    for (let r = minRow; r <= maxRow; r++) {
      const isNewTile = placements.some((p) => p.col === cols[0] && p.row === r)
      const isOnBoard = board[r][cols[0]] !== null
      if (!isNewTile && !isOnBoard) {
        return { valid: false, error: "GAP_NOT_FILLED" }
      }
    }
  }

  return { valid: true }
}

function isConnected(
  placements: Placement[],
  board: (Tile | null)[][]
): ValidationResult {
  const boardEmpty = board.every((row) => row.every((cell) => cell === null))

  if (boardEmpty) {
    const coversCenter = placements.some((p) => p.row === 7 && p.col === 7)
    return coversCenter
      ? { valid: true }
      : { valid: false, error: "NOT_CONNECTED" }
  }

  const neighbours = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]

  const hasNeighbour = placements.some((p) =>
    neighbours.some(([dr, dc]) => {
      const nr = p.row + dr
      const nc = p.col + dc

      const isWithinBounds =
        nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length

      return isWithinBounds && board[nr][nc] !== null
    })
  )

  return hasNeighbour
    ? { valid: true }
    : { valid: false, error: "NOT_CONNECTED" }
}
