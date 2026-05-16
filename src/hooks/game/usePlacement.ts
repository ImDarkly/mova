import type { TileType } from "@/types/room"
import { useCallback, useEffect, useState } from "react"

export type PlacedTiles = Record<number, TileType>

type PlacedIndices = Set<number>

export function usePlacement(initialTiles: TileType[]) {
  const [placedIndices, setPlacedIndices] = useState<PlacedIndices>(new Set())
  const [placements, setPlacements] = useState<PlacedTiles>({})
  const [prevInitialTiles, setPrevInitialTiles] =
    useState<TileType[]>(initialTiles)

  if (initialTiles !== prevInitialTiles) {
    setPrevInitialTiles(initialTiles)
    setPlacedIndices(new Set())
    setPlacements({})
  }

  const rack: (TileType | null)[] = initialTiles.map((tile, i) =>
    placedIndices.has(i) ? null : tile
  )

  const placeTile = useCallback(
    (rackIndex: number, cellIndex: number) => {
      const tile = initialTiles[rackIndex]
      if (!tile) return

      setPlacedIndices((prev) => new Set(prev).add(rackIndex))
      setPlacements((prev) => ({ ...prev, [cellIndex]: tile }))
    },
    [initialTiles]
  )

  const isOccupied = useCallback(
    (cellIndex: number) => cellIndex in placements,
    [placements]
  )

  return { rack, placements, placeTile, isOccupied }
}
