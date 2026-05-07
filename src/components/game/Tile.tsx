import { cn } from "@/lib/utils"
import type { TileType } from "@/types/room"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

const LETTER_SIZE = "text-[clamp(1rem,3.5cqw,1.5rem)]"
const POINTS_SIZE = "text-[clamp(0.5rem,1.5cqw,0.75rem)]"

interface TileProps {
  tile: TileType
  rackIndex: number
  disabled?: boolean
}

export default function Tile({ tile, rackIndex, disabled }: TileProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `rack-${rackIndex}`,
      disabled,
      data: { rackIndex: tile },
    })

  const style = transform
    ? { transform: CSS.Transform.toString(transform) }
    : undefined

  return (
    <div
      className="relative aspect-square h-full max-h-14 max-w-14 min-w-0 flex-1"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div
        className={cn(
          "absolute inset-[6%] flex aspect-square items-center justify-center rounded-[12%] bg-card shadow-sm ring-1 ring-border",
          isDragging && "opacity-0"
        )}
      >
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
