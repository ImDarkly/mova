import Board from "@/components/game/Board"
import Rack from "@/components/game/Rack"
import RoomLayout from "@/components/room/RoomLayout"
import { useGameSession } from "@/hooks/game/useGameSession"
import { useParams } from "react-router"

function GameSessionView({ roomId }: { roomId: string }) {
  const { tiles } = useGameSession(roomId)

  return (
    <RoomLayout roomId={roomId}>
      <div className="@container-[size] flex min-h-0 w-full flex-1 items-center justify-center">
        <Board />
      </div>
      <Rack tiles={tiles} />
    </RoomLayout>
  )
}

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>()

  if (!roomId) return null

  return <GameSessionView roomId={roomId} />
}
