import { describe, expect, it } from "vitest"
import { emptyBoard, tiles } from "./testUtils"
import { calculateTurnScore, extractWordsFormed } from "./wordExtraction"

describe("extractWordsFormed", () => {
  it("finds the word a single tile makes with a tile already on the board", () => {
    // Board already has "AT" across row 7.
    const board = emptyBoard()
    board[7][7] = { letter: "A", points: 1 }
    board[7][8] = { letter: "T", points: 1 }

    // Put "C" above "A": the new tile forms "CA" going down.
    const words = extractWordsFormed(
      [{ row: 6, col: 7 }],
      board,
      tiles("C")
    ).map((w) => w.word)

    expect(words).toContain("CA")
  })

  it("extends an existing word through the tiles already on the board", () => {
    const board = emptyBoard()
    board[7][7] = { letter: "A", points: 1 }
    board[7][8] = { letter: "T", points: 1 }

    const words = extractWordsFormed(
      [
        { row: 7, col: 6 },
        { row: 7, col: 9 },
      ],
      board,
      tiles("CS")
    ).map((w) => w.word)

    expect(words).toEqual(["CATS"])
  })

  it("finds the main word and every cross-word a move creates", () => {
    // "HE" is on row 7; playing "AT" right under it also forms "HA" and "ET".
    const board = emptyBoard()
    board[7][7] = { letter: "H", points: 1 }
    board[7][8] = { letter: "E", points: 1 }

    const words = extractWordsFormed(
      [
        { row: 8, col: 7 },
        { row: 8, col: 8 },
      ],
      board,
      tiles("AT")
    ).map((w) => w.word)

    expect(words).toEqual(["AT", "HA", "ET"])
  })

  it("does not mutate the real board while checking a move", () => {
    const board = emptyBoard()
    extractWordsFormed(
      [
        { row: 7, col: 7 },
        { row: 7, col: 8 },
      ],
      board,
      tiles("HI")
    )
    expect(board[7][7]).toBeNull()
    expect(board[7][8]).toBeNull()
  })
})

describe("calculateTurnScore", () => {
  it("sums tile points of every word formed, including old tiles", () => {
    const board = emptyBoard()
    board[7][7] = { letter: "Q", points: 10 }

    // Placing "I" after "Q" forms "QI": 10 + 1.
    const score = calculateTurnScore([{ row: 7, col: 8 }], board, [
      { letter: "I", points: 1 },
    ])
    expect(score).toBe(11)
  })
})
