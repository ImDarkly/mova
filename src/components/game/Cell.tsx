import { cn } from "@/lib/utils"
import { useDroppable } from "@dnd-kit/core"

interface CellProps {
  variant: string
  label?: string
  row: number
  col: number
  isOccupied: boolean
}

export default function Cell({
  variant,
  label,
  row,
  col,
  isOccupied,
}: CellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${row}-${col}`,
    disabled: isOccupied,
    data: { row, col },
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
