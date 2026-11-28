import { describe, expect, it } from "vitest"
import { GameState } from "./gameState"
import { tiles } from "./testUtils"

function startedGame(...ids: string[]) {
  const game = new GameState()
  for (const id of ids) game.playerConnect(id, id)
  for (const id of ids) game.toggleReady(id, true)
  return game
}

describe("GameState", () => {
  it("starts when everyone is ready and deals 7 tiles each", () => {
    const game = startedGame("ann", "bob")
    expect(game.gameStarted).toBe(true)
    expect(game.currentTurn).toBe("ann")
    expect(game.players.ann.rack).toHaveLength(7)
    expect(game.players.bob.rack).toHaveLength(7)
    expect(game.bag).toHaveLength(100 - 14)
  })

  it("leaves the board, rack and turn untouched when a move is rejected", () => {
    const game = startedGame("ann", "bob")
    game.players.ann.rack = tiles("XQZTVWK")
    const rackBefore = [...game.players.ann.rack]

    const result = game.submitTurn("ann", [
      { rackIndex: 0, row: 7, col: 7 },
      { rackIndex: 1, row: 7, col: 8 },
    ])

    expect(result).toMatchObject({
      success: false,
      error: { error: "INVALID_WORD", invalidWords: ["XQ"] },
    })
    expect(game.board[7][7]).toBeNull()
    expect(game.players.ann.rack).toEqual(rackBefore)
    expect(game.currentTurn).toBe("ann")
  })

  it("applies a valid move, scores it, refills the rack and passes the turn", () => {
    const game = startedGame("ann", "bob")
    game.players.ann.rack = tiles("HIABCDE")
    const bagBefore = game.bag.length

    const result = game.submitTurn("ann", [
      { rackIndex: 0, row: 7, col: 7 },
      { rackIndex: 1, row: 7, col: 8 },
    ])

    expect(result).toEqual({ success: true, turnScore: 2 })
    expect(game.board[7][7]?.letter).toBe("H")
    expect(game.board[7][8]?.letter).toBe("I")
    expect(game.players.ann.score).toBe(2)
    expect(game.players.ann.rack).toHaveLength(7)
    expect(game.bag).toHaveLength(bagBefore - 2)
    expect(game.currentTurn).toBe("bob")
  })

  it("keeps a disconnected player's seat and skips their turn until they return", () => {
    const game = startedGame("ann", "bob", "cat")

    game.playerDisconnect("ann")
    expect(game.players.ann.connected).toBe(false)
    expect(game.currentTurn).toBe("bob")

    // Ann reconnects with the same client id and keeps her rack and score.
    const rack = game.players.ann.rack
    const result = game.playerConnect("ann", "ann")
    expect(result).toEqual({ isNewPlayer: false, isRoomFull: false })
    expect(game.players.ann.rack).toBe(rack)
    expect(game.handleReconnect("ann").currentTurn).toBe("bob")
  })

  it("does not let new players join a game in progress", () => {
    const game = startedGame("ann", "bob")
    expect(game.playerConnect("eve", "eve")).toEqual({
      isNewPlayer: true,
      isRoomFull: true,
    })
  })
})
