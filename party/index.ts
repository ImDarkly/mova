import type * as Party from "partykit/server"
import { MAX_PLAYERS, MIN_PLAYERS } from "./constants"

interface Player {
  id: string
  ready: boolean
}

export default class Server implements Party.Server {
  players: Record<string, Player> = {}

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    if (Object.keys(this.players).length >= MAX_PLAYERS) {
      conn.send(JSON.stringify({ type: "ROOM_FULL" }))
      conn.close()
      return
    }
    this.players[conn.id] = { id: conn.id, ready: false }
    conn.send(JSON.stringify({ type: "JOINED", myId: conn.id }))
    this.room.broadcast(
      JSON.stringify({
        type: "ROOM_STATE",
        players: Object.values(this.players),
      })
    )
  }

  onClose(conn: Party.Connection) {
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
      this.room.broadcast(JSON.stringify({ type: "GAME_START" }))
    } else {
      this.room.broadcast(JSON.stringify({ type: "ROOM_STATE", players: list }))
    }
  }
}
