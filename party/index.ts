import type * as Party from "partykit/server"
import { MAX_PLAYERS, MIN_PLAYERS } from "./constants"

interface Player {
  id: string
  ready: boolean
}

type Players = Record<string, Player>

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async getPlayers(): Promise<Players> {
    return (await this.room.storage.get("players")) ?? {}
  }

  async savePLayers(players: Players): Promise<void> {
    await this.room.storage.put("players", players)
  }

  async broadcastState(players: Players): Promise<void> {
    this.room.broadcast(
      JSON.stringify({
        type: "ROOM_STATE",
        players: Object.values(players),
      })
    )
  }

  async onConnect(conn: Party.Connection) {
    const connections = [...this.room.getConnections()]

    if (connections.length > MAX_PLAYERS) {
      conn.send(JSON.stringify({ type: "ROOM_FULL" }))
      conn.close()
      return
    }

    const players = await this.getPlayers()
    players[conn.id] = { id: conn.id, ready: false }
    await this.savePLayers(players)

    conn.send(JSON.stringify({ type: "JOINED", myId: conn.id }))
    await this.broadcastState(players)
  }

  async onClose(conn: Party.Connection) {
    const players = await this.getPlayers()
    delete players[conn.id]
    await this.savePLayers(players)
    await this.broadcastState(players)
  }

  async onMessage(message: string, sender: Party.Connection) {
    const msg = JSON.parse(message)
    const players = await this.getPlayers()

    switch (msg.type) {
      case "READY":
        players[sender.id].ready = true
        break
      case "UNREADY":
        players[sender.id].ready = false
        break
      default:
        return
    }

    await this.savePLayers(players)

    const playerList = Object.values(players)
    const allReady =
      playerList.length >= MIN_PLAYERS && playerList.every((p) => p.ready)

    if (allReady) {
      this.room.broadcast(JSON.stringify({ type: "GAME_START" }))
      return
    }

    await this.broadcastState(players)
  }
}

Server satisfies Party.Worker
