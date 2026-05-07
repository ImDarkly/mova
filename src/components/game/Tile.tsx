import { cn } from "@/lib/utils"
import type { TileType } from "@/types/room"

const LETTER_SIZE = "text-[clamp(1rem,3.5cqw,1.5rem)]"
const POINTS_SIZE = "text-[clamp(0.5rem,1.5cqw,0.75rem)]"

interface TileProps {
  tile: TileType
}

export default function Tile({ tile }: TileProps) {
  return (
    <div className="relative aspect-square h-full max-h-14 max-w-14 min-w-0 flex-1">
      <div className="absolute inset-[6%] flex aspect-square items-center justify-center rounded-[12%] bg-card shadow-sm ring-1 ring-border">
        <span className={cn("font-bold text-foreground", LETTER_SIZE)}>
          {tile.letter}
        </span>
        <span
          className={cn(
            "absolute right-[12%] bottom-[10%] font-medium text-muted-foreground",
            POINTS_SIZE
          )}
        >
          {tile.points}
        </span>
      </div>
    </div>
  )
}
