import type * as Party from "partykit/server"
import { GameState } from "./lib/gameState"
import { toPublicPlayer, type Tile } from "./lib/types"
import {
  broadcastBoardState,
  broadcastGameOver,
  broadcastGameStart,
  broadcastRoomState,
  broadcastTurnChange,
  sendGameStart,
  sendRack,
  sendRoomFull,
  sendSubmitError,
} from "./lib/messages"
import {
  isValidWord,
  isValidWithBlank,
  validatePlacements,
} from "./lib/validation"

export default class Server implements Party.Server {
  gameState = new GameState()

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    const url = new URL(conn.uri)
    const name = url.searchParams.get("name")?.trim() || conn.id

    const result = this.gameState.playerConnect(conn.id, name)

    if (result.isRoomFull) {
      sendRoomFull(conn)
      conn.close()
      return
    }

    const player = this.gameState.players[conn.id]
    if (player && player.rack.length > 0) {
      sendRack(conn, player.rack)
    }

    if (!result.isNewPlayer && this.gameState.gameStarted) {
      const reconnectResult = this.gameState.handleReconnect(conn.id)

      if (reconnectResult.gameOver) {
        conn.send(
          JSON.stringify({
            type: "GAME_OVER",
            winnerIds: reconnectResult.winnerIds,
            scores: reconnectResult.scores,
          })
        )
        if (reconnectResult.currentTurn) {
          broadcastTurnChange(
            this.room,
            reconnectResult.currentTurn,
            reconnectResult.scores
          )
        }
        return
      }

      sendGameStart(conn, reconnectResult.currentTurn, reconnectResult.scores)
      this.sendBoardState(conn, reconnectResult.board)
      broadcastTurnChange(
        this.room,
        reconnectResult.currentTurn,
        reconnectResult.scores
      )
    }

    broadcastRoomState(
      this.room,
      Object.values(this.gameState.players).map(toPublicPlayer)
    )
  }

  onClose(conn: Party.Connection) {
    this.gameState.playerDisconnect(conn.id)

    if (this.gameState.gameStarted) {
      const scores = this.getScores()
      if (this.gameState.currentTurn) {
        broadcastTurnChange(this.room, this.gameState.currentTurn, scores)
      }
    }

    broadcastRoomState(
      this.room,
      Object.values(this.gameState.players).map(toPublicPlayer)
    )
  }

  onMessage(message: string, sender: Party.Connection) {
    let msg: unknown
    try {
      msg = JSON.parse(message)
    } catch {
      return
    }

    if (
      !this.gameState.players[sender.id] ||
      typeof msg !== "object" ||
      msg === null
    ) {
      return
    }

    const action = msg as { type?: string; placements?: unknown }

    if (typeof action.type !== "string") return

    if (action.type === "READY") {
      this.handleReadyToggle(sender, true)
    } else if (action.type === "UNREADY") {
      this.handleReadyToggle(sender, false)
    } else if (action.type === "SUBMIT_TURN") {
      this.handleSubmitTurn(sender, action.placements)
    } else if (action.type === "SKIP_TURN") {
      this.handleSkipTurn(sender)
    }
  }

  private handleReadyToggle(sender: Party.Connection, ready: boolean) {
    const result = this.gameState.toggleReady(sender.id, ready)

    if (result.shouldStartGame) {
      broadcastGameStart(
        this.room,
        this.gameState.currentTurn,
        this.getScores()
      )
      for (const id in this.gameState.players) {
        const player = this.gameState.players[id]
        const conn = this.room.getConnection(id)
        if (conn) {
          sendRack(conn, player.rack)
        }
      }
    } else {
      broadcastRoomState(
        this.room,
        Object.values(this.gameState.players).map(toPublicPlayer)
      )
    }
  }

  private handleSubmitTurn(sender: Party.Connection, placements: unknown) {
    if (sender.id !== this.gameState.currentTurn) {
      return
    }
    if (this.gameState.gameOver) {
      return
    }

    const result = this.gameState.submitTurn(sender.id, placements)

    if (!result.success) {
      sendSubmitError(sender, result.error)
      return
    }

    const player = this.gameState.players[sender.id]
    if (!player) {
      return
    }
    this.room
      .getConnection(sender.id)
      ?.send(JSON.stringify({ type: "RACK_STATE", tiles: player.rack }))

    broadcastBoardState(this.room, this.gameState.board)

    if (this.gameState.gameOver) {
      broadcastGameOver(this.room, this.gameState.winnerIds, this.getScores())
      return
    }

    const scores = this.getScores()
    broadcastTurnChange(this.room, this.gameState.currentTurn, scores)
  }

  private sendBoardState(conn: Party.Connection, board: (Tile | null)[][]) {
    conn.send(JSON.stringify({ type: "BOARD_STATE", board }))
  }

  private getScores(): Record<string, number> {
    const scores: Record<string, number> = {}
    for (const [id, player] of Object.entries(this.gameState.players)) {
      scores[id] = player.score
    }
    return scores
  }

  private handleSkipTurn(sender: Party.Connection) {
    if (sender.id !== this.gameState.currentTurn || this.gameState.gameOver) {
      return
    }

    this.gameState.skipTurn()

    const scores = this.getScores()
    broadcastTurnChange(this.room, this.gameState.currentTurn, scores)
  }
}
