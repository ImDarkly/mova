import { describe, expect, it } from "vitest"
import { flattenBoard } from "./messages"
import { emptyBoard } from "./testUtils"

describe("flattenBoard", () => {
  it('keys occupied cells by "row,col" and leaves empty cells out', () => {
    const board = emptyBoard()
    board[7][7] = { letter: "H", points: 4 }
    board[7][8] = { letter: "I", points: 1 }

    expect(flattenBoard(board)).toEqual({
      "7,7": { letter: "H", points: 4 },
      "7,8": { letter: "I", points: 1 },
    })
  })
})
