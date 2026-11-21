import { PAWN_COLORS } from "@/lib/room"
export default function Pawn({ index }: { index: number }) {
  return (
    <span
      aria-hidden="true"
      className="pawn"
      style={{ backgroundColor: PAWN_COLORS[index % PAWN_COLORS.length] }}
    />
  )
}
