import {
  BOARD_SIZE,
  getCellType,
  CELL_VARIANTS,
  CELL_LABELS,
} from "@/lib/board"
import Cell from "@/components/game/Cell"

export default function Board() {
  return (
    <div className="size-[min(100cqw,100cqh)] rounded-xl bg-border p-[clamp(4px,1cqw,16px)]">
      <div
        className="grid h-full w-full gap-px overflow-hidden rounded-lg"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
          const row = Math.floor(i / BOARD_SIZE)
          const col = i % BOARD_SIZE
          const type = getCellType(row, col)
          return (
            <Cell
              key={i}
              variant={CELL_VARIANTS[type]}
              label={CELL_LABELS[type]}
            />
          )
        })}
      </div>
    </div>
  )
}
