import { describe, expect, it } from "vitest"
import { emptyBoard, tiles } from "./testUtils"
import { isValidWord, validatePlacements } from "./validation"

describe("validatePlacements", () => {
  it("requires the first move to cover the centre square", () => {
    const board = emptyBoard()
    const offCentre = [
      { rackIndex: 0, row: 0, col: 0 },
      { rackIndex: 1, row: 0, col: 1 },
    ]
    expect(validatePlacements(offCentre, board)).toEqual({
      valid: false,
      error: "NOT_CONNECTED",
    })

    const onCentre = [
      { rackIndex: 0, row: 7, col: 7 },
      { rackIndex: 1, row: 7, col: 8 },
    ]
    expect(validatePlacements(onCentre, board)).toEqual({ valid: true })
  })

  it("rejects tiles that are not in one row or column", () => {
    const diagonal = [
      { rackIndex: 0, row: 7, col: 7 },
      { rackIndex: 1, row: 8, col: 8 },
    ]
    expect(validatePlacements(diagonal, emptyBoard())).toMatchObject({
      error: "NOT_IN_LINE",
    })
  })

  it("rejects a gap, but accepts it when an existing tile fills it", () => {
    const board = emptyBoard()
    const withGap = [
      { rackIndex: 0, row: 7, col: 6 },
      { rackIndex: 1, row: 7, col: 8 },
    ]
    expect(validatePlacements(withGap, board)).toMatchObject({
      error: "GAP_NOT_FILLED",
    })

    board[7][7] = tiles("A")[0]
    expect(validatePlacements(withGap, board)).toEqual({ valid: true })
  })

  it("rejects later moves that do not touch any existing tile", () => {
    const board = emptyBoard()
    board[7][7] = tiles("A")[0]
    const floating = [{ rackIndex: 0, row: 0, col: 0 }]
    expect(validatePlacements(floating, board)).toMatchObject({
      error: "NOT_CONNECTED",
    })
  })

  it("rejects occupied cells and off-board coordinates", () => {
    const board = emptyBoard()
    board[7][7] = tiles("A")[0]
    expect(
      validatePlacements([{ rackIndex: 0, row: 7, col: 7 }], board)
    ).toMatchObject({ error: "CELL_OCCUPIED" })
    expect(
      validatePlacements([{ rackIndex: 0, row: 7, col: 15 }], board)
    ).toMatchObject({ error: "OUT_OF_BOUNDS" })
  })
})

describe("isValidWord", () => {
  it("checks words against the SOWPODS dictionary, case-insensitively", () => {
    expect(isValidWord("cat")).toBe(true)
    expect(isValidWord("QI")).toBe(true)
    expect(isValidWord("XQZT")).toBe(false)
    expect(isValidWord("")).toBe(false)
  })
})
