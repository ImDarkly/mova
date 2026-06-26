import type { TileType } from "./game"
import type { Player } from "./room"

export type ServerMessage =
  | { type: "ROOM_STATE"; players: Player[] }
  | { type: "ROOM_FULL" }
  | {
      type: "GAME_START"
      currentTurn: string
      roomId?: string
      scores: Record<string, number>
    }
  | { type: "TURN_CHANGE"; currentTurn: string; scores: Record<string, number> }
  | { type: "RACK_STATE"; tiles: TileType[] }
  | { type: "BOARD_STATE"; board: Record<string, TileType> }
  | {
      type: "SUBMIT_ERROR"
      valid: false
      error:
        | "NO_TILES"
        | "NOT_IN_LINE"
        | "GAP_NOT_FILLED"
        | "NOT_CONNECTED"
        | "OUT_OF_BOUNDS"
        | "CELL_OCCUPIED"
        | "DUPLICATE_COORDINATE"
        | "INVALID_WORD"
      invalidWords?: string[]
    }
  | { type: "GAME_OVER"; winnerIds: string[]; scores: Record<string, number> }

export type ClientMessage =
  | { type: "READY" }
  | { type: "UNREADY" }
  | {
      type: "SUBMIT_TURN"
      placements: { rackIndex: number; row: number; col: number }[]
    }
  | { type: "SKIP_TURN" }
