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
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
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

export default class Server implements Party.Server {
  players: Record<string, Player> = {}
  bag: Tile[] = []
  gameStarted = false

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    if (this.gameStarted && !this.players[conn.id]) {
      conn.send(JSON.stringify({ type: "ROOM_FULL" }))
      conn.close()
      return
    }

    if (Object.keys(this.players).length >= MAX_PLAYERS) {
      conn.send(JSON.stringify({ type: "ROOM_FULL" }))
      conn.close()
      return
    }

    const existing = this.players[conn.id]

    if (!existing) {
      this.players[conn.id] = {
        id: conn.id,
        ready: false,
        rack: [],
      }
    }

    const player = this.players[conn.id]

    if (player.rack.length > 0) {
      conn.send(
        JSON.stringify({
          type: "RACK_STATE",
          tiles: player.rack,
        })
      )
    }

    this.room.broadcast(
      JSON.stringify({
        type: "ROOM_STATE",
        players: Object.values(this.players),
      })
    )
  }

  onClose(conn: Party.Connection) {
    if (this.gameStarted) {
      return
    }

    delete this.players[conn.id]

    this.room.broadcast(
      JSON.stringify({
        type: "ROOM_STATE",
        players: Object.values(this.players),
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

    const ready =
      msg.type === "READY" ? true : msg.type === "UNREADY" ? false : null
    if (ready === null) return

    this.players[sender.id].ready = ready

    const list = Object.values(this.players)
    const allReady = list.length >= MIN_PLAYERS && list.every((p) => p.ready)

    if (allReady) {
      this.startGame()
    } else {
      this.room.broadcast(JSON.stringify({ type: "ROOM_STATE", players: list }))
    }
  }
  startGame() {
    if (this.gameStarted) return
    this.gameStarted = true

    this.bag = shuffleBag(buildBag())

    for (const conn of this.room.getConnections()) {
      const player = this.players[conn.id]
      if (!player) continue

      const { drawn, remaining } = drawTiles(this.bag, RACK_SIZE)
      this.bag = remaining
      player.rack = drawn

      conn.send(JSON.stringify({ type: "RACK_STATE", tiles: drawn }))
    }

    this.room.broadcast(JSON.stringify({ type: "GAME_START" }))
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

    const conn = [...this.room.getConnections()].find((c) => c.id === connId)
    conn?.send(JSON.stringify({ type: "RACK_STATE", tiles: player.rack }))
  }
}
