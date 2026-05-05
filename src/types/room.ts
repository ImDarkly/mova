export type ServerMessage =
  | { type: "JOINED"; myId: string }
  | { type: "ROOM_STATE"; players: Player[] }
  | { type: "ROOM_FULL" }
  | { type: "GAME_START" }
  | { type: "RACK_STATE"; tiles: Tile[] }

export type ClientMessage = { type: "READY" } | { type: "UNREADY" }

export interface Player {
  id: string
  ready: boolean
}

export interface Tile {
  letter: string
  points: number
}
