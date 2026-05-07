import Tile from "@/components/game/Tile"
import type { TileType } from "@/types/room"

interface RackProps {
  tiles: (TileType | null)[]
  disabled?: boolean
}

export default function Rack({ tiles, disabled }: RackProps) {
  return (
    <div className="@container flex w-auto items-center justify-center gap-1 rounded-xl bg-border px-2 py-2">
      {tiles.map((tile, i) =>
        tile ? (
          <Tile key={i} tile={tile} rackIndex={i} disabled={disabled} />
        ) : (
          <div
            key={i}
            className="relative aspect-square h-full max-h-14 max-w-14 min-w-0 flex-1 opacity-0"
          />
        )
      )}
    </div>
  )
}
