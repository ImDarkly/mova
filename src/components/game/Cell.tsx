import { cn } from "@/lib/utils"
import { useDroppable } from "@dnd-kit/core"
import { Star } from "lucide-react"
interface CellProps {
  variant: string
  label?: string
  accessibleLabel: string
  row: number
  col: number
  isOccupied: boolean
  disabled: boolean
  selecting: boolean
  onClick: () => void
  center?: boolean
}
export default function Cell({
  variant,
  label,
  accessibleLabel,
  row,
  col,
  isOccupied,
  disabled,
  selecting,
  onClick,
  center,
}: CellProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${row}-${col}`,
    disabled: isOccupied || disabled,
    data: { row, col },
  })
  return (
    <button
      type="button"
      ref={setNodeRef}
      className={cn(
        "board-cell",
        variant,
        isOver && !isOccupied && "drop-hover"
      )}
      disabled={isOccupied || disabled}
      tabIndex={selecting && !isOccupied && !disabled ? 0 : -1}
      aria-label={accessibleLabel}
      onClick={onClick}
    >
      {center ? (
        <Star className="size-1/2" fill="currentColor" aria-hidden="true" />
      ) : (
        <span>{label}</span>
      )}
    </button>
  )
}
