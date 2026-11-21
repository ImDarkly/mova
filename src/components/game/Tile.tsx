import { cn } from "@/lib/utils"
import type { TileType } from "@/types/game"
import { useDraggable } from "@dnd-kit/core"
import { useTranslation } from "react-i18next"
interface TileProps {
  tile: TileType
  rackIndex?: number
  disabled?: boolean
  hidePoints?: boolean
  isPending?: boolean
  selected?: boolean
  lifted?: boolean
  onClick?: () => void
}
export default function Tile({
  tile,
  rackIndex,
  disabled,
  hidePoints,
  isPending,
  selected,
  lifted,
  onClick,
}: TileProps) {
  const { t } = useTranslation("game")
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `rack-${rackIndex}`,
    disabled: disabled || rackIndex === undefined,
    data: { rackIndex, tile },
  })
  const face = (
    <>
      <span className="tile-letter">{tile.letter}</span>{" "}
      {!hidePoints && <span className="tile-points">{tile.points}</span>}
    </>
  )
  const className = cn(
    "game-tile",
    isPending && "pending",
    selected && "selected",
    lifted && "lifted",
    isDragging && "invisible"
  )
  if (rackIndex === undefined) return <span className={className}>{face}</span>
  return (
    <button
      type="button"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={className}
      disabled={disabled}
      aria-disabled={disabled}
      aria-pressed={!isPending ? !!selected : undefined}
      aria-label={t(isPending ? "tile.return" : "tile.label", {
        letter: tile.letter,
        count: tile.points,
      })}
      onClick={onClick}
    >
      {face}
    </button>
  )
}
