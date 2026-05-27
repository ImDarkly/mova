import { CELL_LABELS, CELL_VARIANTS, getCellType } from "@/lib/board"
import type { TileType } from "@/types/game"
import Cell from "./Cell"
import Tile from "./Tile"

interface BoardCellProps {
  row: number
  col: number
  boardTile?: TileType
  rackIndex?: number
}

export default function BoardCell({
  row,
  col,
  boardTile,
  rackIndex,
}: BoardCellProps) {
  const type = getCellType(row, col)
  return (
    <div className="relative">
      <Cell
        row={row}
        col={col}
        variant={CELL_VARIANTS[type]}
        label={CELL_LABELS[type]}
        isOccupied={!!boardTile}
      />
      {boardTile && (
        <div className="absolute inset-0 flex h-full items-center justify-center">
          <Tile
            tile={boardTile}
            hidePoints
            rackIndex={rackIndex}
            isPending={rackIndex !== undefined}
          />
        </div>
      )}
    </div>
  )
}
