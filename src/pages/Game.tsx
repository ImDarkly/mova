import Board from "@/components/game/Board"
import Rack from "@/components/game/Rack"
import ScoreBoardList from "@/components/game/ScoreBoardList"
import Tile from "@/components/game/Tile"
import RoomLayout from "@/components/room/RoomLayout"
import { Button } from "@/components/ui/button"
import { useGameSession } from "@/hooks/game/useGameSession"
import { useTileAssignment } from "@/hooks/game/useTileAssignment"
import type { TileType } from "@/types/game"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { Check, Trash } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router"

function GameSessionView({ roomId }: { roomId: string }) {
  const { tiles, players, currentTurn, isMyTurn, boardTiles, send } =
    useGameSession(roomId)
  const {
    rack,
    assignTile,
    pendingTiles,
    returnTile,
    isOccupied,
    returnAll,
    assignments,
  } = useTileAssignment(tiles)
  const mergedBoardTiles = { ...boardTiles, ...pendingTiles }
  const [activeTile, setActiveTile] = useState<TileType | null>(null)

  const isSubmittingRef = useRef(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  useEffect(() => {
    if (isSubmittingRef.current) {
      returnAll()
      isSubmittingRef.current = false
    }
  }, [currentTurn, returnAll])

  const handleDragStart = (event: DragStartEvent) => {
    const activeData = event.active.data.current as
      | { tile?: TileType }
      | undefined
    if (!activeData?.tile) return
    setActiveTile(activeData.tile)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTile(null)

    const { active, over } = event
    if (!over || !active) return

    const activeData = active.data.current as { rackIndex?: number } | undefined
    const overData = over.data.current as
      | { row?: number; col?: number }
      | undefined

    if (over.id === "rack") {
      if (typeof activeData?.rackIndex != "number") return
      returnTile(activeData.rackIndex)
    } else {
      if (
        typeof activeData?.rackIndex !== "number" ||
        typeof overData?.row !== "number" ||
        typeof overData?.col !== "number"
      )
        return
      const coordKey = `${overData.row},${overData.col}`
      if (isOccupied(overData.row, overData.col) || boardTiles[coordKey]) return
      assignTile(activeData.rackIndex, { row: overData.row, col: overData.col })
    }
  }

  const handleDragCancel = () => {
    setActiveTile(null)
  }

  const handleSubmitTurn = () => {
    isSubmittingRef.current = true

    const placements = Object.entries(assignments)
      .filter(([, coord]) => coord != null)
      .map(([rackIndex, coord]) => ({
        rackIndex: Number(rackIndex),
        row: coord!.row,
        col: coord!.col,
      }))

    send({ type: "SUBMIT_TURN", placements })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <RoomLayout roomId={roomId}>
        <ScoreBoardList players={players} currentTurn={currentTurn} />
        <div className="@container-[size] flex min-h-0 w-full flex-1 items-center justify-center">
          <Board boardTiles={mergedBoardTiles} assignments={assignments} />
        </div>
        <div className="flex w-full items-center gap-2">
          <Button
            onClick={returnAll}
            variant="destructive"
            disabled={Object.keys(assignments).length === 0}
            aria-label="Clear all placements"
          >
            <Trash />
          </Button>
          <Rack tiles={rack} disabled={!isMyTurn} />
          <Button
            variant="secondary"
            disabled={!isMyTurn || Object.keys(assignments).length === 0}
            onClick={handleSubmitTurn}
            aria-label="Submit turn"
          >
            <Check />
          </Button>
        </div>
      </RoomLayout>

      <DragOverlay dropAnimation={null}>
        {activeTile ? <Tile tile={activeTile} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>()
  if (!roomId) return null
  return <GameSessionView roomId={roomId} />
}
