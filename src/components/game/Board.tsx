import { BOARD_SIZE } from "@/lib/board"
import type { TileAssignments, TileType } from "@/types/game"
import BoardCell from "./BoardCell"

interface BoardProps {
  boardTiles: Partial<Record<string, TileType>>
  assignments: TileAssignments
}

function buildAssignmentMap(assignments: TileAssignments): Map<string, number> {
  return new Map(
    Object.entries(assignments)
      .filter(([, coord]) => coord != null)
      .map(([rackIndex, coord]) => [
        `${coord!.row},${coord!.col}`,
        Number(rackIndex),
      ])
  )
}

export default function Board({ boardTiles, assignments }: BoardProps) {
  const assignmentMap = buildAssignmentMap(assignments)

  return (
    <div className="@container size-[min(100cqw,100cqh)] rounded-xl bg-border p-[clamp(4px,1cqw,16px)]">
      <div
        className="grid w-full flex-1 gap-px overflow-hidden rounded-lg"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
          const row = Math.floor(i / BOARD_SIZE)
          const col = i % BOARD_SIZE
          return (
            <BoardCell
              key={i}
              row={row}
              col={col}
              boardTile={boardTiles[`${row},${col}`]}
              rackIndex={assignmentMap.get(`${row},${col}`)}
            />
          )
        })}
      </div>
    </div>
  )
}
