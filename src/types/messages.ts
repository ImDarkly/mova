import type { TileType } from "./game"
import type { Player } from "./room"

export type ServerMessage =
  | { type: "ROOM_STATE"; players: Player[] }
  | { type: "ROOM_FULL" }
  | { type: "GAME_START"; roomId: string; currentTurn: string }
  | { type: "TURN_CHANGE"; currentTurn: string }
  | { type: "RACK_STATE"; tiles: TileType[] }

export type ClientMessage =
  | { type: "READY" }
  | { type: "UNREADY" }
  | {
      type: "SUBMIT_TURN"
      placements: { rackIndex: number; row: number; col: number }[]
    }
