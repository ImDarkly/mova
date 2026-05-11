import { cn } from "@/lib/utils"
import { useDroppable } from "@dnd-kit/core"

interface CellProps {
  variant: string
  label?: string
  cellIndex: number
  isOccupied: boolean
}

export default function Cell({
  variant,
  label,
  cellIndex,
  isOccupied,
}: CellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${cellIndex}`,
    disabled: isOccupied,
    data: { cellIndex },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        `relative flex aspect-square items-center justify-center ${variant}`,
        isOver && !isOccupied && "ring-2 ring-primary/50 ring-inset"
      )}
    >
      <span className="text-[clamp(0.6rem,1.5cqw,1.5rem)] font-bold">
        {label}
      </span>
    </div>
  )
}
