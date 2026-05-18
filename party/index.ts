import type * as Party from "partykit/server"
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  RACK_SIZE,
  TILE_DISTRIBUTION,
} from "./constants"

interface Player {
  id: string
  ready: boolean
  rack: Tile[]
  connected: boolean
}

export interface Tile {
  letter: string
  points: number
}

function buildBag(): Tile[] {
  const bag: Tile[] = []
  for (const { letter, points, count } of TILE_DISTRIBUTION) {
    for (let i = 0; i < count; i++) {
      bag.push({ letter, points })
    }
  }
  return bag
}

function shuffleBag(bag: Tile[]): Tile[] {
  const shuffled = [...bag]
  const rand = new Uint32Array(1)
  for (let i = shuffled.length - 1; i > 0; i--) {
    crypto.getRandomValues(rand)
    const j = rand[0] % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function drawTiles(
  bag: Tile[],
  count: number
): { drawn: Tile[]; remaining: Tile[] } {
  const remaining = [...bag]
  const drawn = remaining.splice(0, count)
  return { drawn, remaining }
}

function toPublicPlayer(p: Player): Omit<Player, "rack"> {
  const { rack: _, ...pub } = p
  return pub
}

export default class Server implements Party.Server {
  players: Record<string, Player> = {}
  bag: Tile[] = []
  gameStarted = false
  playerOrder: string[] = []
  currentTurn: string = ""

  constructor(readonly room: Party.Room) {}

  advanceToNextConnectedPlayer() {
    const len = this.playerOrder.length
    if (len === 0) return
    const start = this.playerOrder.indexOf(this.currentTurn)
    for (let i = 1; i <= len; i++) {
      const candidate = this.playerOrder[(start + i) % len]
      const p = this.players[candidate]
      if (p && p.connected) {
        this.currentTurn = candidate
        return
      }
    }
  }

  onConnect(conn: Party.Connection) {
    const isReconnect = !!this.players[conn.id]
    if (!isReconnect) {
      if (this.gameStarted || Object.keys(this.players).length >= MAX_PLAYERS) {
        conn.send(JSON.stringify({ type: "ROOM_FULL" }))
        conn.close()
        return
      }
      this.playerOrder.push(conn.id)
    }

    const existing = this.players[conn.id]

    if (!existing) {
      this.players[conn.id] = {
        id: conn.id,
        ready: false,
        rack: [],
        connected: true,
      }
    }

    const player = this.players[conn.id]
    player.connected = true

    if (player.rack.length > 0) {
      conn.send(
        JSON.stringify({
          type: "RACK_STATE",
          tiles: player.rack,
        })
      )
    }

    if (isReconnect && this.gameStarted) {
      conn.send(
        JSON.stringify({
          type: "GAME_START",
          roomId: this.room.id,
          currentTurn: this.currentTurn,
        })
      )
    }

    this.room.broadcast(
      JSON.stringify({
        type: "ROOM_STATE",
        players: Object.values(this.players).map(toPublicPlayer),
      })
    )
  }

  onClose(conn: Party.Connection) {
    const player = this.players[conn.id]
    if (this.gameStarted) {
      if (player) {
        player.connected = false

        if (this.currentTurn === conn.id) {
          this.advanceToNextConnectedPlayer()
          this.room.broadcast(
            JSON.stringify({
              type: "TURN_CHANGE",
              currentTurn: this.currentTurn,
            })
          )
        }

        this.room.broadcast(
          JSON.stringify({
            type: "ROOM_STATE",
            players: Object.values(this.players).map(toPublicPlayer),
          })
        )
      }
      return
    }

    delete this.players[conn.id]
    this.playerOrder = this.playerOrder.filter((id) => id !== conn.id)

    this.room.broadcast(
      JSON.stringify({
        type: "ROOM_STATE",
        players: Object.values(this.players).map(toPublicPlayer),
      })
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
        this.room.broadcast(
          JSON.stringify({
            type: "ROOM_STATE",
            players: list.map(toPublicPlayer),
          })
        )
      }
    }

    if (msg.type === "SUBMIT_TURN") {
      if (sender.id !== this.currentTurn) return

      this.refillRack(sender.id)
      this.advanceToNextConnectedPlayer()

      this.room.broadcast(
        JSON.stringify({
          type: "TURN_CHANGE",
          currentTurn: this.currentTurn,
        })
      )
      return
    }
  }

  startGame() {
    if (this.gameStarted) return
    this.gameStarted = true

    this.currentTurn =
      this.playerOrder.find((id) => this.players[id]?.connected) ||
      this.playerOrder[0]

    this.bag = shuffleBag(buildBag())

    for (const id in this.players) {
      const player = this.players[id]

      const { drawn, remaining } = drawTiles(this.bag, RACK_SIZE)
      this.bag = remaining
      player.rack = drawn

      this.room
        .getConnection(id)
        ?.send(JSON.stringify({ type: "RACK_STATE", tiles: drawn }))
    }

    this.room.broadcast(
      JSON.stringify({ type: "GAME_START", currentTurn: this.currentTurn })
    )
  }

  refillRack(connId: string) {
    const player = this.players[connId]
    if (!player) return

    const needed = RACK_SIZE - player.rack.length
    if (needed <= 0 || this.bag.length === 0) return

    const { drawn, remaining } = drawTiles(
      this.bag,
      Math.min(needed, this.bag.length)
    )

    this.bag = remaining
    player.rack.push(...drawn)

    this.room
      .getConnection(connId)
      ?.send(JSON.stringify({ type: "RACK_STATE", tiles: player.rack }))
  }
}
