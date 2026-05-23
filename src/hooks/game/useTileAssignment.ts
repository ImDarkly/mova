import type { CellCoord, TileAssignments, TileType } from "@/types/game"
import { useState } from "react"

export function useTileAssignment(initialTiles: TileType[]) {
  const [assignments, setAssignments] = useState<TileAssignments>({})
  const [prevInitialTiles, setPrevInitialTiles] = useState(initialTiles)

  if (initialTiles !== prevInitialTiles) {
    setPrevInitialTiles(initialTiles)
    setAssignments((prev) => {
      const cleaned = Object.fromEntries(
        Object.entries(prev).filter(([rackIndex]) => {
          const idx = Number(rackIndex)
          return idx >= 0 && idx < initialTiles.length
        })
      )
      return cleaned
    })
  }

  const rack: (TileType | null)[] = initialTiles.map((tile, i) =>
    i in assignments ? null : tile
  )

  const boardTiles: Partial<Record<string, TileType>> = Object.entries(
    assignments
  ).reduce(
    (acc, [rackIndex, coord]) => {
      if (coord) {
        const tile = initialTiles[Number(rackIndex)]
        if (tile) acc[`${coord.row},${coord.col}`] = tile
      }
      return acc
    },
    {} as Partial<Record<string, TileType>>
  )

  const assignTile = (rackIndex: number, coord: CellCoord) => {
    setAssignments((prev) => ({
      ...prev,
      [rackIndex]: coord,
    }))
  }

  const returnTile = (rackIndex: number) => {
    setAssignments((prev) => {
      const next = { ...prev }
      delete next[rackIndex]
      return next
    })
  }

  const returnAll = () => setAssignments({})
  const isOccupied = (row: number, col: number) => {
    return Object.values(assignments).some(
      (coord) => coord && coord.row === row && coord.col === col
    )
  }

  return {
    assignments,
    rack,
    boardTiles,
    assignTile,
    returnTile,
    returnAll,
    isOccupied,
  }
}
