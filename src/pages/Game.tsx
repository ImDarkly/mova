import Board from "@/components/game/Board"
import Rack from "@/components/game/Rack"
import ScoreBoardList from "@/components/game/ScoreBoardList"
import Tile from "@/components/game/Tile"
import GameOver from "@/components/game/GameOver"
import GameMenu from "@/components/game/GameMenu"
import RoomLayout from "@/components/room/RoomLayout"
import LeaveRoomButton from "@/components/room/LeaveRoomButton"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { useGameSession } from "@/hooks/game/useGameSession"
import { useTileAssignment } from "@/hooks/game/useTileAssignment"
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
import { SkipForward, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
function GameTurn({
  roomId,
  session,
}: {
  roomId: string
  session: ReturnType<typeof useGameSession>
}) {
  const { t } = useTranslation("game")
  const {
    tiles,
    players,
    currentTurn,
    isMyTurn,
    boardTiles,
    send,
    scores,
    lastError,
  } = session
  const {
    rack,
    assignTile,
    pendingTiles,
    returnTile,
    isOccupied,
    returnAll,
    assignments,
  } = useTileAssignment(tiles)
  const [selected, setSelected] = useState<number | null>(null)
  const [activeTile, setActiveTile] = useState<TileType | null>(null)
  const [submission, setSubmission] = useState<{
    error: typeof lastError
  } | null>(null)
  const [skipOpen, setSkipOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const submitting = submission !== null && submission.error === lastError
  const disabled = !isMyTurn || submitting
  const hasPlacements = Object.keys(assignments).length > 0
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 10 } })
  )
  useEffect(() => {
    const clear = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null)
    }
    window.addEventListener("keydown", clear)
    return () => window.removeEventListener("keydown", clear)
  }, [])
  const clear = () => {
    returnAll()
    setSelected(null)
  }
  const place = (index: number, row: number, col: number) => {
    if (disabled || isOccupied(row, col) || boardTiles[`${row},${col}`]) return
    assignTile(index, { row, col })
    setSelected(null)
  }
  const dragStart = (event: DragStartEvent) => {
    if (disabled) return
    setSelected(null)
    const data = event.active.data.current as { tile?: TileType } | undefined
    if (data?.tile) setActiveTile(data.tile)
  }
  const dragEnd = (event: DragEndEvent) => {
    setActiveTile(null)
    if (disabled) return
    const index = event.active.data.current?.rackIndex
    const over = event.over
    if (typeof index !== "number" || !over) return
    if (over.id === "rack") {
      returnTile(index)
      return
    }
    const { row, col } = over.data.current ?? {}
    if (typeof row === "number" && typeof col === "number")
      place(index, row, col)
  }
  const submit = () => {
    if (disabled || !hasPlacements) return
    setSelected(null)
    setSubmission({ error: lastError })
    try {
      send({
        type: "SUBMIT_TURN",
        placements: Object.entries(assignments).flatMap(([index, coord]) =>
          coord
            ? [{ rackIndex: Number(index), row: coord.row, col: coord.col }]
            : []
        ),
      })
    } catch {
      setSubmission(null)
      toast.error(t("errors.connection.failed.title"))
    }
  }
  const skip = () => {
    setSkipOpen(false)
    if (disabled) return
    try {
      send({ type: "SKIP_TURN" })
      clear()
    } catch {
      toast.error(t("errors.skip.failed.title"), {
        description: t("errors.skip.failed.description"),
      })
    }
  }
  const turnName = players.find((p) => p.id === currentTurn)?.name ?? ""
  return (
    <DndContext
      sensors={sensors}
      onDragStart={dragStart}
      onDragEnd={dragEnd}
      onDragCancel={() => setActiveTile(null)}
    >
      <RoomLayout
        roomId={roomId}
        gameActions={
          <GameMenu
            roomId={roomId}
            disabled={disabled}
            onSkip={() => setSkipOpen(true)}
            onLeave={() => setLeaveOpen(true)}
          />
        }
      >
        <div className="game-layout">
          <ScoreBoardList
            players={players}
            currentTurn={currentTurn}
            scores={scores}
          />
          <main className="game-main">
            <div className="board-space @container-[size]">
              <Board
                boardTiles={{ ...boardTiles, ...pendingTiles }}
                assignments={assignments}
                disabled={disabled}
                selecting={selected !== null}
                onPlace={(row, col) => {
                  if (selected !== null) place(selected, row, col)
                }}
                onReturn={returnTile}
              />
            </div>
            <div className="game-dock">
              <p className="game-status" aria-live="polite" aria-atomic="true">
                {submitting ? (
                  t("status.checking")
                ) : isMyTurn ? (
                  <>
                    <strong>{t("status.yourTurn")}</strong>{" "}
                    {hasPlacements ? (
                      t("status.ready")
                    ) : (
                      <>
                        <span className="lg:hidden">{t("status.tap")}</span>
                        <span className="hidden lg:inline">
                          {t("status.tapOrDrag")}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span className="waiting-dot" />
                    {t("status.playing", { name: turnName })}
                  </>
                )}
              </p>
              <div className="game-controls">
                <Button
                  className="skip-button"
                  variant="ghost"
                  disabled={disabled}
                  onClick={() => setSkipOpen(true)}
                >
                  <SkipForward size={18} />
                  {t("actions.skip")}
                </Button>
                <Rack
                  tiles={rack}
                  disabled={disabled}
                  selected={selected}
                  onSelect={(i) => setSelected(selected === i ? null : i)}
                  onReturnAll={clear}
                  hasPlacements={hasPlacements}
                />
                {isMyTurn ? (
                  <Button
                    className="play-button"
                    disabled={disabled || !hasPlacements}
                    aria-disabled={disabled || !hasPlacements}
                    onClick={submit}
                  >
                    {submitting && <LoaderCircle className="animate-spin" />}
                    {t(submitting ? "actions.playing" : "actions.play")}
                  </Button>
                ) : (
                  <div className="wait-bar">{t("status.waiting")}</div>
                )}
              </div>
            </div>
          </main>
        </div>
      </RoomLayout>
      <DragOverlay dropAnimation={null}>
        {activeTile ? <Tile tile={activeTile} lifted /> : null}
      </DragOverlay>
      <AlertDialog open={skipOpen} onOpenChange={setSkipOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("skip.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("skip.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("skip.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={skip}>
              {t("actions.skip")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <LeaveRoomButton
        hideTrigger
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
      />
    </DndContext>
  )
}
// A new turn starts with an empty draft and no selected tile.
function GameSessionView({ roomId }: { roomId: string }) {
  const session = useGameSession(roomId)
  return session.gameOver ? (
    <GameOver players={session.players} result={session.gameOver} />
  ) : (
    <GameTurn key={session.currentTurn} roomId={roomId} session={session} />
  )
}
export default function Game() {
  const { roomId } = useParams<{ roomId: string }>()
  return roomId ? <GameSessionView roomId={roomId} /> : null
}
