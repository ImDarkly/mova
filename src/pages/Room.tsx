import RoomLayout from "@/components/room/RoomLayout"
import RoomLobby from "@/components/room/RoomLobby"
import { useRoomSession } from "@/hooks/room/useRoomSession"
import { useParams } from "react-router"

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>()
  const { players, send } = useRoomSession(roomId!)

  if (!roomId) return null

  return (
    <RoomLayout roomId={roomId}>
      <div className="flex min-h-0 w-full flex-1 flex-col gap-2">
        <RoomLobby players={players} send={send} />
      </div>
    </RoomLayout>
  )
}
