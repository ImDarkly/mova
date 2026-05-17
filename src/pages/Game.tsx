import Board from "@/components/game/Board"
import Rack from "@/components/game/Rack"
import Tile from "@/components/game/Tile"
import RoomLayout from "@/components/room/RoomLayout"
import { Button } from "@/components/ui/button"
import { useGameSession } from "@/hooks/game/useGameSession"
import { useTileAssignment } from "@/hooks/game/useTileAssignment"
import type { TileType } from "@/types/room"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { Trash } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router"

function GameSessionView({ roomId }: { roomId: string }) {
  const { tiles } = useGameSession(roomId)
  const {
    rack,
    assignTile,
    boardTiles,
    returnTile,
    isOccupied,
    returnAll,
    assignments,
  } = useTileAssignment(tiles)
  const [activeTile, setActiveTile] = useState<TileType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

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
    const overData = over.data.current as { cellIndex?: number } | undefined

    if (over.id === "rack") {
      if (typeof activeData?.rackIndex != "number") return
      returnTile(activeData.rackIndex)
    } else {
      if (
        typeof activeData?.rackIndex !== "number" ||
        typeof overData?.cellIndex !== "number"
      )
        return
      if (isOccupied(overData.cellIndex)) return
      assignTile(activeData.rackIndex, overData.cellIndex)
    }
  }

  const handleDragCancel = () => {
    setActiveTile(null)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <RoomLayout roomId={roomId}>
        <div className="@container-[size] flex min-h-0 w-full flex-1 items-center justify-center">
          <Board boardTiles={boardTiles} assignments={assignments} />
        </div>
        <Button onClick={returnAll} variant="destructive">
          {<Trash />}
        </Button>
        <Rack tiles={rack} />
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
