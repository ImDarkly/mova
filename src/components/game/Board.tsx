import { BOARD_SIZE, getCellType } from "@/lib/board"
import Cell from "@/components/game/Cell"

export default function Board() {
  return (
    <div
      className="grid aspect-square gap-1 overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        height: "min(100cqw, 100cqh)",
      }}
    >
      {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
        const row = Math.floor(i / BOARD_SIZE)
        const col = i % BOARD_SIZE
        return <Cell key={i} type={getCellType(row, col)} />
      })}
    </div>
  )
}
