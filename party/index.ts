import type * as Party from "partykit/server"
import { BOARD_SIZE, MAX_PLAYERS, MIN_PLAYERS, RACK_SIZE } from "./constants"
import { buildBag, drawTiles, refillRack, shuffleBag } from "./lib/bag"
import {
  broadcastBoardState,
  broadcastGameStart,
  broadcastRoomState,
  broadcastTurnChange,
  sendGameStart,
  sendRack,
  sendRoomFull,
  sendSubmitError,
} from "./lib/messages"
import {
  advanceToNextConnectedPlayer,
  findFirstConnectedPlayer,
} from "./lib/turns"
import {
  isPlacement,
  toPublicPlayer,
  type Player,
  type Tile,
} from "./lib/types"
import { validatePlacements } from "./lib/validation"

export default class Server implements Party.Server {
  players: Record<string, Player> = {}
  bag: Tile[] = []
  gameStarted = false
  playerOrder: string[] = []
  currentTurn: string | null = null
  board: (Tile | null)[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  )

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    const isReconnect = !!this.players[conn.id]

    if (!isReconnect) {
      if (this.gameStarted || Object.keys(this.players).length >= MAX_PLAYERS) {
        sendRoomFull(conn)
        conn.close()
        return
      }
      this.playerOrder.push(conn.id)
      this.players[conn.id] = {
        id: conn.id,
        ready: false,
        rack: [],
        connected: true,
      }
    }

    const player = this.players[conn.id]
    player.connected = true

    if (player.rack.length > 0) sendRack(conn, player.rack)

    if (isReconnect && this.gameStarted) {
      if (!this.players[this.currentTurn ?? ""]?.connected) {
        this.currentTurn = advanceToNextConnectedPlayer(
          this.playerOrder,
          this.players,
          this.currentTurn
        )
        broadcastTurnChange(this.room, this.currentTurn)
      }
      sendGameStart(conn, this.currentTurn)
      broadcastBoardState(this.room, this.board)
    }

    broadcastRoomState(
      this.room,
      Object.values(this.players).map(toPublicPlayer)
    )
  }

  onClose(conn: Party.Connection) {
    const player = this.players[conn.id]

    if (this.gameStarted) {
      if (player) {
        player.connected = false
        if (this.currentTurn === conn.id) {
          this.currentTurn = advanceToNextConnectedPlayer(
            this.playerOrder,
            this.players,
            this.currentTurn
          )
          broadcastTurnChange(this.room, this.currentTurn)
        }
        broadcastRoomState(
          this.room,
          Object.values(this.players).map(toPublicPlayer)
        )
      }
      return
    }

    delete this.players[conn.id]
    this.playerOrder = this.playerOrder.filter((id) => id !== conn.id)
    broadcastRoomState(
      this.room,
      Object.values(this.players).map(toPublicPlayer)
    )
  }

  onMessage(message: string, sender: Party.Connection) {
    let msg: unknown
    try {
      msg = JSON.parse(message)
    } catch {
      return
    }

    if (!this.players[sender.id] || typeof msg !== "object" || msg === null)
      return

    const action = msg as { type?: string; placements?: unknown }

    if (typeof action.type !== "string") return

    if (action.type === "READY" || action.type === "UNREADY") {
      this.handleReadyToggle(sender, action.type)
    } else if (action.type === "SUBMIT_TURN") {
      this.handleSubmitTurn(sender, action)
    }
  }

  startGame() {
    if (this.gameStarted) return
    this.gameStarted = true

    this.currentTurn = findFirstConnectedPlayer(this.playerOrder, this.players)
    this.bag = shuffleBag(buildBag())

    for (const id in this.players) {
      const player = this.players[id]
      const { drawn, remaining } = drawTiles(this.bag, RACK_SIZE)
      this.bag = remaining
      player.rack = drawn
      const conn = this.room.getConnection(id)
      if (conn) sendRack(conn, drawn)
    }

    broadcastGameStart(this.room, this.currentTurn)
  }

  private handleSubmitTurn(
    sender: Party.Connection,
    msg: { placements?: unknown }
  ) {
    // Only the active player is allowed to submit a turn
    if (sender.id !== this.currentTurn) return

    const player = this.players[sender.id]
    const placements = Array.isArray(msg.placements)
      ? msg.placements.filter(isPlacement)
      : []

    const result = validatePlacements(placements, this.board)
    if (!result.valid) {
      sendSubmitError(sender, result.error)
      return
    }

    for (const { row, col, rackIndex } of placements) {
      this.board[row][col] = player.rack[rackIndex]
    }

    const indices = this.getValidatedRackIndices(msg.placements)

    // Removing tiles from the end of the array first prevents index shifts
    // from invalidating remaining indices in the sequence.
    this.removeTilesFromRack(player, indices)

    const { rack, bag } = refillRack(player.rack, this.bag)
    player.rack = rack
    this.bag = bag

    this.room
      .getConnection(sender.id)
      ?.send(JSON.stringify({ type: "RACK_STATE", tiles: rack }))

    broadcastBoardState(this.room, this.board)

    this.currentTurn = advanceToNextConnectedPlayer(
      this.playerOrder,
      this.players,
      this.currentTurn
    )
    broadcastTurnChange(this.room, this.currentTurn)
  }

  private getValidatedRackIndices(placements: unknown): number[] {
    if (!Array.isArray(placements)) return []

    // Deduplication is necessary because a player might accidentally
    // submit the same rack index twice in a single turn.
    return [
      ...new Set(placements.filter(isPlacement).map((p) => p.rackIndex)),
    ].sort((a, b) => b - a)
  }

  private handleReadyToggle(
    sender: Party.Connection,
    type: "READY" | "UNREADY"
  ) {
    this.players[sender.id].ready = type === "READY"
    const list = Object.values(this.players)
    const allReady = list.length >= MIN_PLAYERS && list.every((p) => p.ready)

    if (allReady) {
      this.startGame()
    } else {
      broadcastRoomState(this.room, list.map(toPublicPlayer))
    }
  }

  private removeTilesFromRack(player: Player, indices: number[]) {
    for (const index of indices) {
      if (index >= 0 && index < player.rack.length) {
        player.rack.splice(index, 1)
      }
    }
  }
}
