import RoomHeader from "@/components/room/RoomHeader"
import RoomLobby from "@/components/room/RoomLobby"
import { useRoomSession } from "@/hooks/room/useRoomSession"
import { useParams } from "react-router"

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>()
  const { players, myId, send } = useRoomSession(roomId!)

  if (!roomId) return null

  return (
    <div className="flex h-full w-full flex-col gap-2">
      <RoomHeader roomId={roomId} />
      <RoomLobby players={players} send={send} myId={myId} />
    </div>
  )
}
