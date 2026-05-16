import { cn } from "@/lib/utils"
import type { TileType } from "@/types/room"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

const LETTER_SIZE = "text-[clamp(1rem,3.5cqw,2rem)]"
const POINTS_SIZE = "text-[clamp(0.5rem,3.5cqw,1rem)]"

interface TileProps {
  tile: TileType
  rackIndex?: number
  disabled?: boolean
  hidePoints?: boolean
}

export default function Tile({
  tile,
  rackIndex,
  disabled,
  hidePoints,
}: TileProps) {
  const isStatic = rackIndex === undefined

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `rack-${rackIndex}`,
      disabled,
      data: { rackIndex, tile },
    })

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
  }

  return (
    <div
      className="relative h-full w-full"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div
        className={cn(
          "absolute inset-[6%] flex items-center justify-center rounded-[12%] bg-card shadow-sm ring-1 ring-border",
          !isStatic && isDragging && "opacity-0"
        )}
      >
        <span className={cn("font-bold text-foreground", LETTER_SIZE)}>
          {tile.letter}
        </span>
        {!hidePoints && (
          <span
            className={cn(
              "absolute right-[16%] bottom-[12%] font-medium text-muted-foreground",
              POINTS_SIZE
            )}
          >
            {tile.points}
          </span>
        )}
      </div>
    </div>
  )
}
