import Board from "@/components/game/Board"
import Rack from "@/components/game/Rack"
import RoomLayout from "@/components/room/RoomLayout"
import { useParams } from "react-router"

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>()

  if (!roomId) return null

  return (
    <RoomLayout roomId={roomId}>
      <div className="@container-[size] flex h-full min-h-0 w-full items-center justify-center">
        <Board />
      </div>
      <Rack />
    </RoomLayout>
  )
}
