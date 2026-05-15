import {
  BOARD_SIZE,
  getCellType,
  CELL_VARIANTS,
  CELL_LABELS,
} from "@/lib/board"
import Cell from "@/components/game/Cell"
import type { PlacedTiles } from "@/hooks/game/usePlacement"
import Tile from "@/components/game/Tile"

interface BoardProps {
  placements: PlacedTiles
}

export default function Board({ placements }: BoardProps) {
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
          return (
            <div key={i} className="relative">
              <Cell
                cellIndex={i}
                variant={CELL_VARIANTS[type]}
                label={CELL_LABELS[type]}
                isOccupied={!!placements[i]}
              />
              {placements[i] && (
                <div className="absolute inset-0 flex h-full items-center justify-center">
                  <Tile rackIndex={i} tile={placements[i]} hidePoints />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
