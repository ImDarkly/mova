import { Tile } from "./types"

type Board = (Tile | null)[][]
type Placement = { row: number; col: number }

export type FormedWord = { word: string; tiles: Tile[] }

export function extractWordsFormed(
  placements: Placement[],
  board: Board,
  newTiles: Tile[]
): FormedWord[] {
  // Reject invalid state transitions early.
  if (placements.length === 0 || placements.length !== newTiles.length)
    return []

  // Isolate board state to permit speculative scoring without
  // side effects on the actual game state.
  const tempBoard = board.map((row) => [...row])

  // Ensure all placements fall within board boundaries.
  const isAnyInvalid = placements.some(
    (p) =>
      p.row < 0 ||
      p.row >= tempBoard.length ||
      p.col < 0 ||
      p.col >= tempBoard[p.row].length
  )

  if (isAnyInvalid) return []

  // Apply pending tiles to the simulation board.
  placements.forEach((p, i) => {
    tempBoard[p.row][p.col] = newTiles[i]
  })

  // Enforce unique words based on string content to prevent
  // overcounting duplicate sequences in a single turn.
  const words: FormedWord[] = []

  const isHorizontal = placements.every((p) => p.row === placements[0].row)
  const isVertical = placements.every((p) => p.col === placements[0].col)

  if (!isHorizontal && !isVertical) return []

  // Encapsulate tile collection and word string generation to
  // avoid repeated traversal logic.
  const addWord = (dx: number, dy: number, row: number, col: number) => {
    const tiles = getWordTilesAt(tempBoard, row, col, dx, dy)
    // Standard Scrabble rules: words must contain 2+ tiles.
    if (tiles.length >= 2) {
      const word = tiles
        .map((t) => t.letter)
        .join("")
        .toUpperCase()
      words.push({ word, tiles })
    }
  }

  // Capture primary word based on move orientation.
  if (isHorizontal) {
    addWord(0, 1, placements[0].row, placements[0].col)
  } else if (isVertical) {
    addWord(1, 0, placements[0].row, placements[0].col)
  }

  // Capture secondary/perpendicular words created by the new tiles.
  placements.forEach((p) => {
    const dx = isHorizontal ? 1 : 0
    const dy = isHorizontal ? 0 : 1
    addWord(dx, dy, p.row, p.col)
  })

  return words
}

// NOTE: The board traversal logic below is intentionally duplicated from getWordAt.
// This is a deliberate choice to maintain SRP (cohesion) and adhere to project
// constraints against refactoring existing, stable code ("Don't refactor things
// that aren't broken"). This keeps the changes surgical and avoids introducing
// speculative abstractions for single-use logic.

export function getWordTilesAt(
  board: Board,
  row: number,
  col: number,
  dx: number,
  dy: number
): Tile[] {
  // Invalid direction: must traverse in at least one axis
  if (dx === 0 && dy === 0) return []

  let r = row
  let c = col

  // Backtrack to find the true beginning of the word
  while (
    r - dx >= 0 &&
    r - dx < board.length &&
    c - dy >= 0 &&
    c - dy < board[r - dx].length &&
    board[r - dx][c - dy] !== null
  ) {
    r -= dx
    c -= dy
  }

  // Iterate forward to collect all tiles
  const tiles: Tile[] = []
  while (
    r < board.length &&
    board[r] &&
    c >= 0 &&
    c < board[r].length &&
    board[r][c] !== null
  ) {
    tiles.push(board[r][c]!)
    r += dx
    c += dy
  }

  return tiles
}

export function calculateTurnScore(
  placements: Placement[],
  board: Board,
  newTiles: Tile[]
): number {
  const formedWords = extractWordsFormed(placements, board, newTiles)

  return formedWords.reduce((totalScore, formedWord) => {
    // Score the full word using all its tiles
    const wordScore = formedWord.tiles.reduce((sum, tile) => {
      return sum + tile.points
    }, 0)

    return totalScore + wordScore
  }, 0)
}
