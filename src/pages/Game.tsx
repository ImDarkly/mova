import Board from "@/components/game/Board"
import Rack from "@/components/game/Rack"
import RoomLayout from "@/components/room/RoomLayout"
import { useGameSession } from "@/hooks/game/useGameSession"
import type { PlacedTiles } from "@/hooks/game/usePlacement"
import { useParams } from "react-router"

const MOCK_PLACEMENTS: PlacedTiles = {
  112: { letter: "M", points: 3 }, // center (row 7, col 7)
  113: { letter: "O", points: 1 }, // row 7, col 8
  114: { letter: "V", points: 4 }, // row 7, col 9
  115: { letter: "A", points: 1 }, // row 7, col 10
}

function GameSessionView({ roomId }: { roomId: string }) {
  const { tiles } = useGameSession(roomId)

  return (
    <RoomLayout roomId={roomId}>
      <div className="@container-[size] flex min-h-0 w-full flex-1 items-center justify-center">
        <Board placements={MOCK_PLACEMENTS} />
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
