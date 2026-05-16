export type ServerMessage =
  | { type: "ROOM_STATE"; players: Player[] }
  | { type: "ROOM_FULL" }
  | { type: "GAME_START"; currentTurn: string }
  | { type: "RACK_STATE"; tiles: TileType[] }

export type ClientMessage = { type: "READY" } | { type: "UNREADY" }

export interface Player {
  id: string
  ready: boolean
}

export interface TileType {
  letter: string
  points: number
}
