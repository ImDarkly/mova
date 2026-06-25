import { Tile } from "./types"

type Board = (Tile | null)[][]
type Placement = { row: number; col: number }

export function extractWordsFormed(
  placements: Placement[],
  board: Board,
  newTiles: Tile[]
): string[] {
  if (placements.length === 0 || placements.length !== newTiles.length)
    return []

  // Used to prevent accidental mutation of the actual game state.
  const tempBoard = board.map((row) => [...row])
  // Validate all placements upfront. If any are out of bounds,
  // reject the entire operation to prevent partial/invalid states.
  const isAnyInvalid = placements.some(
    (p) =>
      p.row < 0 ||
      p.row >= tempBoard.length ||
      p.col < 0 ||
      p.col >= tempBoard[p.row].length
  )

  if (isAnyInvalid) return []

  // Process valid placements
  placements.forEach((p, i) => {
    tempBoard[p.row][p.col] = newTiles[i]
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

  // Iterate forward to reconstruct the full sequence.
  while (
    r < board.length &&
    board[r] &&
    c >= 0 &&
    c < board[r].length &&
    board[r][c] !== null
  ) {
    word += board[r][c]!.letter
    r += dx
    c += dy
  }

  return word
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
  // Temporary board for scoring calculation
  const tempBoard = board.map((row) => [...row])
  placements.forEach((p, i) => {
    tempBoard[p.row][p.col] = newTiles[i]
  })

  let totalScore = 0
  const wordsTiles: Tile[][] = []

  const isHorizontal = placements.every((p) => p.row === placements[0].row)
  const isVertical = placements.every((p) => p.col === placements[0].col)

  // Identify words formed
  if (isHorizontal) {
    const wordTiles = getWordTilesAt(
      tempBoard,
      placements[0].row,
      placements[0].col,
      0,
      1
    )
    if (wordTiles.length >= 2) wordsTiles.push(wordTiles)
  } else if (isVertical) {
    const wordTiles = getWordTilesAt(
      tempBoard,
      placements[0].row,
      placements[0].col,
      1,
      0
    )
    if (wordTiles.length >= 2) wordsTiles.push(wordTiles)
  }

  placements.forEach((p) => {
    const dx = isHorizontal ? 1 : 0
    const dy = isHorizontal ? 0 : 1
    const wordTiles = getWordTilesAt(tempBoard, p.row, p.col, dx, dy)
    if (wordTiles.length >= 2) {
      // Ensure we don't double count if the same word was already added
      if (!wordsTiles.some((wt) => wt === wordTiles)) {
        wordsTiles.push(wordTiles)
      }
    }
  })

  // Sum points (standard Scrabble: sum of all tiles in formed words)
  wordsTiles.forEach((word) => {
    totalScore += word.reduce((sum, tile) => sum + tile.points, 0)
  })

  return totalScore
}
