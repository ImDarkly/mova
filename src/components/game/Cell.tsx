interface CellProps {
  variant: string
  label?: string
}

export default function Cell({ variant, label }: CellProps) {
  return (
    <div
      className={`flex aspect-square items-center justify-center rounded-[25%] ${variant}`}
    >
      <span className="text-[clamp(0.6rem,1.5cqw,1.5rem)] font-bold text-accent">
        {label}
      </span>
    </div>
  )
}
