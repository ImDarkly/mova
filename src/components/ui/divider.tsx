import { Separator } from "./separator"

interface DividerProps {
  label?: string
}

export function Divider({ label = "or" }: DividerProps) {
  return (
    <div className="flex items-center gap-2">
      <Separator className="flex-1" />
      <span className="text-sm text-muted-foreground">{label}</span>
      <Separator className="flex-1" />
    </div>
  )
}
