import { CELL_VARIANTS, getCellType } from "@/lib/board"
import type { TileType } from "@/types/game"
import Cell from "./Cell"
import Tile from "./Tile"
import { useTranslation } from "react-i18next"
interface BoardCellProps {
  row: number
  col: number
  boardTile?: TileType
  rackIndex?: number
  disabled: boolean
  tabStop: boolean
  onPlace: (row: number, col: number) => void
  onReturn: (index: number) => void
}
export default function BoardCell({
  row,
  col,
  boardTile,
  rackIndex,
  disabled,
  tabStop,
  onPlace,
  onReturn,
}: BoardCellProps) {
  const type = getCellType(row, col)
  const { t } = useTranslation("board")
  const { t: game } = useTranslation("game")
  return (
    <div className="board-square">
      <Cell
        row={row}
        col={col}
        variant={CELL_VARIANTS[type]}
        label={type === "normal" ? "" : t(`cellLabels.${type}`)}
        accessibleLabel={game(
          type !== "normal" && type !== "center"
            ? "tile.bonusCell"
            : "tile.cell",
          {
            row: row + 1,
            col: col + 1,
            bonus: t(`cellNames.${type}`),
            label: t(`cellLabels.${type}`),
          }
        )}
        isOccupied={!!boardTile}
        disabled={disabled}
        tabStop={tabStop}
        onClick={() => onPlace(row, col)}
        center={type === "center"}
      />
      {boardTile && (
        <div className="absolute inset-0">
          <Tile
            tile={boardTile}
            rackIndex={rackIndex}
            isPending={rackIndex !== undefined}
            disabled={disabled}
            onClick={() => rackIndex !== undefined && onReturn(rackIndex)}
          />
        </div>
      )}
    </div>
  )
}
