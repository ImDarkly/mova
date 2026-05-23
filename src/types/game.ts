export interface TileType {
  letter: string
  points: number
}

export interface CellCoord {
  row: number
  col: number
}

export type TileAssignments = Partial<Record<number, CellCoord>>
