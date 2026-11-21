import Tile from "./Tile"
import type { TileType } from "@/types/game"
import { useDroppable } from "@dnd-kit/core"
import { useTranslation } from "react-i18next"
import { Undo2 } from "lucide-react"
interface RackProps {
  tiles: (TileType | null)[]
  disabled: boolean
  selected: number | null
  onSelect: (index: number) => void
  onReturnAll: () => void
  hasPlacements: boolean
}
export default function Rack({
  tiles,
  disabled,
  selected,
  onSelect,
  onReturnAll,
  hasPlacements,
}: RackProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "rack", disabled })
  const { t } = useTranslation("game")
  return (
    <div
      ref={setNodeRef}
      className={`rack-stand ${isOver ? "rack-hover" : ""} ${disabled ? "rack-disabled" : ""}`}
    >
      <div className="rack-slots">
        {tiles.map((tile, i) => (
          <div className="rack-slot" key={i}>
            {tile ? (
              <Tile
                tile={tile}
                rackIndex={i}
                disabled={disabled}
                selected={selected === i}
                onClick={() => onSelect(i)}
              />
            ) : (
              <div className="empty-slot" />
            )}
          </div>
        ))}
      </div>
      <button
        className="rack-return"
        type="button"
        onClick={onReturnAll}
        disabled={disabled || !hasPlacements}
        aria-label={t("actions.returnAll")}
      >
        <Undo2 size={18} strokeWidth={2.2} />
      </button>
    </div>
  )
}
