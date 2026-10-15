import type { Connection } from "partyserver"
import type { MovaServer } from "../index"
import type { PublicPlayer, Tile } from "./types"
import type { ValidationError } from "./validation"

export function broadcastRoomState(
  server: MovaServer,
  players: PublicPlayer[]
) {
  server.broadcast(JSON.stringify({ type: "ROOM_STATE", players }))
}

export function broadcastTurnChange(
  server: MovaServer,
  currentTurn: string | null,
  scores: Record<string, number>
) {
  server.broadcast(JSON.stringify({ type: "TURN_CHANGE", currentTurn, scores }))
}

export function broadcastGameStart(
  server: MovaServer,
  currentTurn: string | null,
  scores: Record<string, number>
) {
  server.broadcast(JSON.stringify({ type: "GAME_START", currentTurn, scores }))
}

export function sendRack(conn: Connection, tiles: Tile[]) {
  conn.send(JSON.stringify({ type: "RACK_STATE", tiles }))
}

export function sendRoomFull(conn: Connection) {
  conn.send(JSON.stringify({ type: "ROOM_FULL" }))
}

export function sendGameStart(
  conn: Connection,
  currentTurn: string | null,
  scores: Record<string, number>
) {
  conn.send(JSON.stringify({ type: "GAME_START", currentTurn, scores }))
}

export function broadcastBoardState(
  server: MovaServer,
  board: (Tile | null)[][]
) {
  const flat: Record<string, Tile> = {}

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const tile = board[row][col]
      if (tile !== null) {
        flat[`${row},${col}`] = tile
      }
    }
  }
  server.broadcast(JSON.stringify({ type: "BOARD_STATE", board: flat }))
}

export function sendSubmitError(conn: Connection, error: ValidationError) {
  conn.send(JSON.stringify({ type: "SUBMIT_ERROR", ...error }))
}

export function broadcastGameOver(
  server: MovaServer,
  winnerIds: string[],
  scores: Record<string, number>
) {
  server.broadcast(JSON.stringify({ type: "GAME_OVER", winnerIds, scores }))
}
