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

export interface Player {
  id: string
  ready: boolean
}

export interface TileType {
  letter: string
  points: number
}

export type TileAssignments = Partial<Record<number, CellCoord>>

export type PlayerStatus = "ready" | "not-ready" | "your-turn" | "their-turn"

export interface CellCoord {
  row: number
  col: number
}
