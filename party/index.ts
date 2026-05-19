import type * as Party from "partykit/server"
import { MAX_PLAYERS, MIN_PLAYERS, RACK_SIZE } from "./constants"
import { buildBag, drawTiles, refillRack, shuffleBag } from "./lib/bag"
import {
  broadcastGameStart,
  broadcastRoomState,
  broadcastTurnChange,
  sendGameStart,
  sendRack,
  sendRoomFull,
} from "./lib/messages"
import {
  advanceToNextConnectedPlayer,
  findFirstConnectedPlayer,
} from "./lib/turns"
import { toPublicPlayer, type Player, type Tile } from "./lib/types"

export default class Server implements Party.Server {
  players: Record<string, Player> = {}
  bag: Tile[] = []
  gameStarted = false
  playerOrder: string[] = []
  currentTurn: string | null = null

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

    if (!this.players[sender.id]) return
    if (typeof msg !== "object" || msg === null || !("type" in msg)) return

    if (msg.type === "READY" || msg.type === "UNREADY") {
      this.players[sender.id].ready = msg.type === "READY"
      const list = Object.values(this.players)
      const allReady = list.length >= MIN_PLAYERS && list.every((p) => p.ready)
      if (allReady) {
        this.startGame()
      } else {
        broadcastRoomState(this.room, list.map(toPublicPlayer))
      }
    }

    if (msg.type === "SUBMIT_TURN") {
      if (sender.id !== this.currentTurn) return

      const player = this.players[sender.id]
      const raw = (msg as Record<string, unknown>).placements

      if (Array.isArray(raw)) {
        const indices = [
          ...new Set(
            raw
              .filter(
                (p): p is { rackIndex: number } =>
                  p !== null &&
                  typeof p === "object" &&
                  "rackIndex" in p &&
                  typeof (p as Record<string, unknown>).rackIndex === "number"
              )
              .map((p) => p.rackIndex)
          ),
        ].sort((a, b) => b - a)

        for (const index of indices) {
          if (index >= 0 && index < player.rack.length) {
            player.rack.splice(index, 1)
          }
        }
      }

      const { rack, bag } = refillRack(player.rack, this.bag)
      player.rack = rack
      this.bag = bag
      const conn = this.room.getConnection(sender.id)
      if (conn) sendRack(conn, player.rack)

      this.currentTurn = advanceToNextConnectedPlayer(
        this.playerOrder,
        this.players,
        this.currentTurn
      )
      broadcastTurnChange(this.room, this.currentTurn)
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
}
