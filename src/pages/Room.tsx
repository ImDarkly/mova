import RoomHeader from "@/components/room/RoomHeader"
import { useParams } from "react-router"

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>()

  if (!roomId) return null

  return <RoomHeader roomId={roomId} />
}
