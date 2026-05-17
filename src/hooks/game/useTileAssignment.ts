import type { TileAssignments, TileType } from "@/types/room"
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

  const boardTiles: Partial<Record<number, TileType>> = Object.entries(
    assignments
  ).reduce(
    (acc, [rackIndex, cellIndex]) => {
      const tile = initialTiles[Number(rackIndex)]
      if (tile) acc[Number(cellIndex)] = tile
      return acc
    },
    {} as Partial<Record<number, TileType>>
  )

  const assignTile = (rackIndex: number, cellIndex: number) => {
    setAssignments((prev) => ({
      ...prev,
      [rackIndex]: cellIndex,
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
  const isOccupied = (cellIndex: number) =>
    Object.values(assignments).includes(cellIndex)

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
