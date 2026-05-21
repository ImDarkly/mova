import type * as Party from "partykit/server"
import type { PublicPlayer, Tile } from "./types"

export function broadcastRoomState(room: Party.Room, players: PublicPlayer[]) {
  room.broadcast(JSON.stringify({ type: "ROOM_STATE", players }))
}

export function broadcastTurnChange(
  room: Party.Room,
  currentTurn: string | null
) {
  room.broadcast(JSON.stringify({ type: "TURN_CHANGE", currentTurn }))
}

export function broadcastGameStart(
  room: Party.Room,
  currentTurn: string | null
) {
  room.broadcast(JSON.stringify({ type: "GAME_START", currentTurn }))
}

export function sendRack(conn: Party.Connection, tiles: Tile[]) {
  conn.send(JSON.stringify({ type: "RACK_STATE", tiles }))
}

export function sendRoomFull(conn: Party.Connection) {
  conn.send(JSON.stringify({ type: "ROOM_FULL" }))
}

export function sendGameStart(
  conn: Party.Connection,
  currentTurn: string | null
) {
  conn.send(JSON.stringify({ type: "GAME_START", currentTurn }))
}
