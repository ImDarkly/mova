import {
  BOARD_SIZE,
  getCellType,
  CELL_VARIANTS,
  CELL_LABELS,
} from "@/lib/board"
import Cell from "@/components/game/Cell"
import Tile from "@/components/game/Tile"
import type { TileAssignments, TileType } from "@/types/room"

interface BoardProps {
  boardTiles: Partial<Record<string, TileType>>
  assignments: TileAssignments
}

export default function Board({ boardTiles, assignments }: BoardProps) {
  return (
    <div className="@container size-[min(100cqw,100cqh)] rounded-xl bg-border p-[clamp(4px,1cqw,16px)]">
      <div
        className="grid w-full flex-1 gap-px overflow-hidden rounded-lg"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
          const row = Math.floor(i / BOARD_SIZE)
          const col = i % BOARD_SIZE
          const type = getCellType(row, col)
          const rackIndexEntry = Object.entries(assignments).find(
            ([, coord]) => coord && coord.row === row && coord.col === col
          )
          const rackIndex = rackIndexEntry
            ? Number(rackIndexEntry[0])
            : undefined

          return (
            <div key={i} className="relative">
              <Cell
                row={row}
                col={col}
                variant={CELL_VARIANTS[type]}
                label={CELL_LABELS[type]}
                isOccupied={!!boardTiles[`${row},${col}`]}
              />
              {boardTiles[`${row},${col}`] && (
                <div className="absolute inset-0 flex h-full items-center justify-center">
                  <Tile
                    tile={boardTiles[`${row},${col}`]!}
                    hidePoints
                    rackIndex={rackIndex}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
