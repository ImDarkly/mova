import { routePartykitRequest, Server } from "partyserver"
import type { Connection, WSMessage } from "partyserver"
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

type Env = {
  Main: DurableObjectNamespace<MovaServer>
}

export class MovaServer extends Server<Env> {
  gameState = new GameState()

  onConnect(conn: Connection) {
    const url = conn.uri ? new URL(conn.uri) : null
    const name = url?.searchParams.get("name")?.trim() || conn.id

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
            this,
            reconnectResult.currentTurn,
            reconnectResult.scores
          )
        }
        return
      }

      sendGameStart(conn, reconnectResult.currentTurn, reconnectResult.scores)
      this.sendBoardState(conn, reconnectResult.board)
      broadcastTurnChange(
        this,
        reconnectResult.currentTurn,
        reconnectResult.scores
      )
    }

    broadcastRoomState(
      this,
      Object.values(this.gameState.players).map(toPublicPlayer)
    )
  }

  onClose(conn: Connection) {
    this.gameState.playerDisconnect(conn.id)

    if (this.gameState.gameStarted) {
      const scores = this.getScores()
      if (this.gameState.currentTurn) {
        broadcastTurnChange(this, this.gameState.currentTurn, scores)
      }
    }

    broadcastRoomState(
      this,
      Object.values(this.gameState.players).map(toPublicPlayer)
    )
  }

  onMessage(sender: Connection, message: WSMessage) {
    if (typeof message !== "string") return
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

  private handleReadyToggle(sender: Connection, ready: boolean) {
    const result = this.gameState.toggleReady(sender.id, ready)

    if (result.shouldStartGame) {
      broadcastGameStart(this, this.gameState.currentTurn, this.getScores())
      for (const id in this.gameState.players) {
        const player = this.gameState.players[id]
        const conn = this.getConnection(id)
        if (conn) {
          sendRack(conn, player.rack)
        }
      }
    } else {
      broadcastRoomState(
        this,
        Object.values(this.gameState.players).map(toPublicPlayer)
      )
    }
  }

  private handleSubmitTurn(sender: Connection, placements: unknown) {
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
    this.getConnection(sender.id)?.send(
      JSON.stringify({ type: "RACK_STATE", tiles: player.rack })
    )

    broadcastBoardState(this, this.gameState.board)

    if (this.gameState.gameOver) {
      broadcastGameOver(this, this.gameState.winnerIds, this.getScores())
      return
    }

    const scores = this.getScores()
    broadcastTurnChange(this, this.gameState.currentTurn, scores)
  }

  private sendBoardState(conn: Connection, board: (Tile | null)[][]) {
    conn.send(JSON.stringify({ type: "BOARD_STATE", board }))
  }

  private getScores(): Record<string, number> {
    const scores: Record<string, number> = {}
    for (const [id, player] of Object.entries(this.gameState.players)) {
      scores[id] = player.score
    }
    return scores
  }

  private handleSkipTurn(sender: Connection) {
    if (sender.id !== this.gameState.currentTurn || this.gameState.gameOver) {
      return
    }

    this.gameState.skipTurn()

    const scores = this.getScores()
    broadcastTurnChange(this, this.gameState.currentTurn, scores)
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not Found", { status: 404 })
    )
  },
} satisfies ExportedHandler<Env>
