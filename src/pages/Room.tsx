import RoomLayout from "@/components/room/RoomLayout"
import RoomLobby from "@/components/room/RoomLobby"
import { useRoomSession } from "@/hooks/room/useRoomSession"
import { useParams } from "react-router"

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>()
  const { players, myId, send } = useRoomSession(roomId!)

  if (!roomId) return null

  return (
    <RoomLayout roomId={roomId}>
      <div className="flex h-full w-full flex-col gap-2">
        <RoomLobby players={players} send={send} myId={myId} />
      </div>
    </RoomLayout>
  )
}
