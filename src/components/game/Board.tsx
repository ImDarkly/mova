import { useState } from "react"
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
  const [activeIndex, setActiveIndex] = useState(
    Math.floor((BOARD_SIZE * BOARD_SIZE) / 2)
  )
  const empty = (index: number) =>
    !boardTiles[`${Math.floor(index / BOARD_SIZE)},${index % BOARD_SIZE}`]
  const focusIndex = empty(activeIndex)
    ? activeIndex
    : Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => i).find(empty)

  return (
    <div
      className="game-board @container size-[min(100cqw,100cqh)]"
      onFocus={(event) => {
        if (
          event.target instanceof HTMLButtonElement &&
          event.target.dataset.row !== undefined
        ) {
          setActiveIndex(
            Number(event.target.dataset.row) * BOARD_SIZE +
              Number(event.target.dataset.col)
          )
        }
      }}
      onKeyDown={(event) => {
        if (
          !selecting ||
          disabled ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          !(event.target instanceof HTMLButtonElement) ||
          event.target.dataset.row === undefined
        )
          return
        const directions: Record<string, [number, number]> = {
          ArrowUp: [-1, 0],
          ArrowDown: [1, 0],
          ArrowLeft: [0, -1],
          ArrowRight: [0, 1],
        }
        const step = directions[event.key]
        if (!step) return
        event.preventDefault()
        let row = Number(event.target.dataset.row) + step[0]
        let col = Number(event.target.dataset.col) + step[1]
        while (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
          if (!boardTiles[`${row},${col}`]) {
            setActiveIndex(row * BOARD_SIZE + col)
            event.currentTarget
              .querySelector<HTMLButtonElement>(
                `[data-row="${row}"][data-col="${col}"]`
              )
              ?.focus()
            return
          }
          row += step[0]
          col += step[1]
        }
      }}
    >
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
              tabStop={selecting && i === focusIndex}
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
