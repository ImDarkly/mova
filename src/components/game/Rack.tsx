import Tile from "@/components/game/Tile"
import { cn } from "@/lib/utils"
import type { TileType } from "@/types/room"
import { useDroppable } from "@dnd-kit/core"

interface RackProps {
  tiles: (TileType | null)[]
  disabled?: boolean
}

export default function Rack({ tiles, disabled }: RackProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "rack", disabled })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "@container flex w-full items-center justify-center gap-1 rounded-xl bg-border px-2 py-2",
        !disabled && isOver ? "ring-2 ring-primary/30" : null
      )}
    >
      {tiles.map((tile, i) => (
        <div
          key={i}
          className="relative aspect-square h-full max-h-20 max-w-20 min-w-0 flex-1"
        >
          {tile ? (
            <Tile tile={tile} rackIndex={i} disabled={disabled} />
          ) : (
            <div className="h-full w-full opacity-0" />
          )}
        </div>
      ))}
    </div>
  )
}
