import Board from "@/components/game/Board"
import Rack from "@/components/game/Rack"
import ScoreBoardList from "@/components/game/ScoreBoardList"
import Tile from "@/components/game/Tile"
import RoomLayout from "@/components/room/RoomLayout"
import { Button } from "@/components/ui/button"
import { useGameSession } from "@/hooks/game/useGameSession"
import { useTileAssignment } from "@/hooks/game/useTileAssignment"
import { getClientId } from "@/lib/clientId"
import type { TileType } from "@/types/game"
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { Check, Trash } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"

function GameSessionView({ roomId }: { roomId: string }) {
  const navigate = useNavigate()
  const {
    tiles,
    players,
    currentTurn,
    isMyTurn,
    boardTiles,
    send,
    scores,
    gameOver,
  } = useGameSession(roomId)
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
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 10 },
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

  if (gameOver) {
    const myId = getClientId()
    const isWinner = gameOver.winnerIds.includes(myId)
    const isTie = gameOver.winnerIds.length > 1

    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <h1 className="font-heading text-2xl font-medium">
          {isTie && isWinner
            ? "It's a tie!"
            : isWinner
              ? "You win!"
              : "You lose!"}
        </h1>
        <div className="flex flex-col gap-1">
          {[...players]
            .sort(
              (a, b) =>
                (gameOver.scores[b.id] ?? 0) - (gameOver.scores[a.id] ?? 0)
            )
            .map((p) => (
              <div key={p.id} className="flex gap-4 text-sm">
                <span
                  className={
                    p.id === myId ? "font-medium" : "text-muted-foreground"
                  }
                >
                  {p.name}
                </span>
                <span>{gameOver.scores[p.id] ?? 0}</span>
              </div>
            ))}
        </div>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <RoomLayout roomId={roomId}>
        <ScoreBoardList
          players={players}
          currentTurn={currentTurn}
          scores={scores}
        />
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
        {activeTile ? <Tile tile={activeTile} hidePoints /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>()
  if (!roomId) return null
  return <GameSessionView roomId={roomId} />
}
