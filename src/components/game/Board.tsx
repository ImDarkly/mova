import { BOARD_SIZE } from "@/lib/board"
import type { TileAssignments, TileType } from "@/types/game"
import BoardCell from "./BoardCell"

interface BoardProps {
  boardTiles: Partial<Record<string, TileType>>
  assignments: TileAssignments
  disabled: boolean
  selecting: boolean
  onPlace: (row: number, col: number) => void
  onReturn: (index: number) => void
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

export default function Board({
  boardTiles,
  assignments,
  disabled,
  selecting,
  onPlace,
  onReturn,
}: BoardProps) {
  const assignmentMap = buildAssignmentMap(assignments)

  return (
    <div className="game-board @container size-[min(100cqw,100cqh)]">
      <div
        className="grid h-full w-full gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
          const row = Math.floor(i / BOARD_SIZE)
          const col = i % BOARD_SIZE
          return (
            <BoardCell
              key={i}
              disabled={disabled}
              selecting={selecting}
              onPlace={onPlace}
              onReturn={onReturn}
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
