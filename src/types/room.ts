export type ServerMessage =
  | { type: "JOINED"; myId: string }
  | { type: "ROOM_STATE"; players: Player[] }
  | { type: "ROOM_FULL" }
  | { type: "GAME_START" }

export type ClientMessage = { type: "READY" } | { type: "UNREADY" }

export interface Player {
  id: string
  ready: boolean
}
