import type { CellType } from "@/lib/board"

const variants: Record<CellType, string> = {
  normal: "bg-accent",
  doubleLetter: "bg-chart-1",
  tripleLetter: "bg-chart-2",
  doubleWord: "bg-chart-4",
  tripleWord: "bg-chart-5",
  center: "bg-foreground",
}

interface CellProps {
  type: CellType
}

export default function Cell({ type = "normal" }: CellProps) {
  return (
    <div
      className={`aspect-square rounded-[25%] bg-accent ${variants[type]}`}
    />
  )
}
