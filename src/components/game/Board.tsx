import { BOARD_SIZE } from "@/lib/board"
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
      {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  )
}
