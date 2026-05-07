import Tile from "@/components/game/Tile"
import type { TileType } from "@/types/room"

interface RackProps {
  tiles: TileType[]
}

export default function Rack({ tiles }: RackProps) {
  return (
    <div className="@container flex w-auto items-center justify-center gap-1 rounded-xl bg-border px-2 py-2">
      {tiles.map((tile, i) => (
        <Tile key={i} tile={tile} />
      ))}
    </div>
  )
}
