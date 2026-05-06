import type { CellVariant } from "@/lib/board"

interface CellProps {
  variant: CellVariant
  label?: string
}

export default function Cell({ variant, label }: CellProps) {
  return (
    <div
      className={`flex aspect-square items-center justify-center ${variant}`}
    >
      <span className="text-[clamp(0.6rem,1.5cqw,1.5rem)] font-bold">
        {label}
      </span>
    </div>
  )
}
