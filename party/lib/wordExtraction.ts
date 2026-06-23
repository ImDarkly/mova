import { Tile } from "./types"

type Board = (Tile | null)[][]
type Placement = { row: number; col: number }

export function extractWordsFormed(
  placements: Placement[],
  board: Board,
  newTiles: Tile[]
): string[] {
  if (placements.length !== newTiles.length) return []

  // Used to prevent accidental mutation of the actual game state.
  const tempBoard = board.map((row) => [...row])
  placements.forEach((p, i) => {
    if (
      p.row >= 0 &&
      p.row < tempBoard.length &&
      p.col >= 0 &&
      p.col < tempBoard[p.row].length
    ) {
      tempBoard[p.row][p.col] = newTiles[i]
    }
  })

  // A Set ensures we only return unique words, satisfying the requirement.
  const words = new Set<string>()

  const isHorizontal = placements.every((p) => p.row === placements[0].row)
  const isVertical = placements.every((p) => p.col === placements[0].col)

  if (!isHorizontal && !isVertical) return []

  // Identify the primary word created by the move.
  if (isHorizontal) {
    const word = getWordAt(
      tempBoard,
      placements[0].row,
      placements[0].col,
      0,
      1
    )
    // Rules dictate a word must be at least 2 letters long.
    if (word.length >= 2) words.add(word)
  } else if (isVertical) {
    const word = getWordAt(
      tempBoard,
      placements[0].row,
      placements[0].col,
      1,
      0
    )
    if (word.length >= 2) words.add(word)
  }

  // Identify any perpendicular words created by the newly placed tiles.
  placements.forEach((p) => {
    const dx = isHorizontal ? 1 : 0
    const dy = isHorizontal ? 0 : 1
    const word = getWordAt(tempBoard, p.row, p.col, dx, dy)
    if (word.length >= 2) words.add(word)
  })

  return Array.from(words).map((w) => w.toUpperCase())
}

function getWordAt(
  board: Board,
  row: number,
  col: number,
  dx: number,
  dy: number
): string {
  let word = ""

  // Backtrack to find the true beginning of the word,
  // as the placement might be in the middle of an existing sequence.
  let r = row
  let c = col
  while (r - dx >= 0 && c - dy >= 0 && board[r - dx][c - dy] !== null) {
    r -= dx
    c -= dy
  }

  // Iterate forward to reconstruct the full sequence.
  while (r < board.length && c < board[0].length && board[r][c] !== null) {
    word += board[r][c]!.letter
    r += dx
    c += dy
  }

  return word
}
